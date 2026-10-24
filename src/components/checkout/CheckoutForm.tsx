import type { FormEvent, ReactNode } from "react";
import { NETWORKS, WALLET_TYPES, type FieldErrors } from "@/lib/orders";
import { focusRing } from "@/lib/ui";

type CheckoutFormProps = {
  errors: FieldErrors;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

/* Erro aparece como texto + borda (nunca só por cor) */
const inputClass = (invalid: boolean) =>
  `w-full rounded border bg-[#1B100B] px-3 py-2 text-xs text-[#F5F1EB] placeholder:text-[#B99665] ${
    invalid ? "border-red-400" : "border-[#3A2112]"
  } ${focusRing}`;

type FieldProps = {
  name: string;
  label: string;
  required?: boolean;
  hideLabel?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
};

/* Rótulo + campo + mensagem de erro, ligados por id (para leitores de tela) */
function Field({ name, label, required, hideLabel, error, className, children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={name} className={hideLabel ? "sr-only" : "text-xs"}>
        {label}
        {required && (
          <span aria-hidden="true" className="text-[#E89B55]">
            {" "}
            *
          </span>
        )}
      </label>
      <div className={hideLabel ? "" : "mt-1"}>{children}</div>
      {error && (
        <p id={`${name}-error`} className="mt-1 text-[11px] text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

const CheckoutForm = ({ errors, onSubmit }: CheckoutFormProps) => {
  // Atributos repetidos em todo campo: id, name e ligação com a mensagem de erro
  const attrs = (name: keyof FieldErrors, required = false) => ({
    id: name,
    name,
    "aria-required": required || undefined,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form
      id="checkout-form"
      onSubmit={onSubmit}
      noValidate // as mensagens de erro são as nossas, não as do navegador
      className="grid gap-4 sm:grid-cols-2"
    >
      <h2 className="text-sm font-bold sm:col-span-2">Perfil do colecionador</h2>

      <Field name="displayName" label="Nome de exibição" required error={errors.displayName}>
        <input {...attrs("displayName", true)} type="text" autoComplete="name" className={inputClass(!!errors.displayName)} />
      </Field>

      <Field name="username" label="Nome de usuário" required error={errors.username}>
        <input {...attrs("username", true)} type="text" autoComplete="username" className={inputClass(!!errors.username)} />
      </Field>

      <Field name="network" label="Rede" required error={errors.network}>
        <select {...attrs("network", true)} defaultValue="" className={inputClass(!!errors.network)}>
          <option value="" disabled>
            Selecione uma rede
          </option>
          {NETWORKS.map((network) => (
            <option key={network} value={network}>
              {network}
            </option>
          ))}
        </select>
      </Field>

      <Field name="profileName" label="Nome do perfil" required error={errors.profileName}>
        <input {...attrs("profileName", true)} type="text" className={inputClass(!!errors.profileName)} />
      </Field>

      <Field name="walletAddress" label="Endereço da carteira" required error={errors.walletAddress}>
        <input
          {...attrs("walletAddress", true)}
          type="text"
          placeholder="Endereço 0x da carteira"
          autoComplete="off"
          spellCheck={false}
          className={inputClass(!!errors.walletAddress)}
        />
      </Field>

      <Field name="secondaryWallet" label="ENS ou carteira secundária (opcional)" hideLabel error={errors.secondaryWallet} className="sm:pt-5">
        <input
          {...attrs("secondaryWallet")}
          type="text"
          placeholder="ENS ou carteira secundária (opcional)"
          autoComplete="off"
          spellCheck={false}
          className={inputClass(!!errors.secondaryWallet)}
        />
      </Field>

      <Field name="walletType" label="Tipo de carteira" required error={errors.walletType}>
        <select {...attrs("walletType", true)} defaultValue="" className={inputClass(!!errors.walletType)}>
          <option value="" disabled>
            Selecione uma carteira
          </option>
          {WALLET_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </Field>

      <Field name="referralCode" label="Código de indicação" required error={errors.referralCode}>
        <input {...attrs("referralCode", true)} type="text" autoComplete="off" className={inputClass(!!errors.referralCode)} />
      </Field>

      <Field name="email" label="E-mail" required error={errors.email}>
        <input {...attrs("email", true)} type="email" autoComplete="email" className={inputClass(!!errors.email)} />
      </Field>

      <Field name="ensName" label="Nome ENS" required error={errors.ensName}>
        <div className="flex">
          <input {...attrs("ensName", true)} type="text" autoComplete="off" className={`${inputClass(!!errors.ensName)} rounded-r-none`} />
          <span className="flex items-center rounded-r border border-l-0 border-[#3A2112] bg-[#3A2112] px-3 text-xs text-[#B99665]">
            .eth
          </span>
        </div>
      </Field>

      <label className="flex items-center gap-2 text-xs sm:col-span-2">
        <input type="checkbox" name="useAnotherWallet" className="h-4 w-4 accent-[#CF8A4B]" />
        Usar outra carteira?
      </label>

      <Field name="notes" label="Observação do colecionador (opcional)" error={errors.notes} className="sm:col-span-2">
        <textarea {...attrs("notes")} rows={5} className={`${inputClass(!!errors.notes)} resize-y sm:max-w-sm`} />
      </Field>
    </form>
  );
};

export default CheckoutForm;
