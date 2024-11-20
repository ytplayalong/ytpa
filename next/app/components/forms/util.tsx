import { useState } from "react";
import { buttonAttrs, inputStyle } from "../../util/styles";
import usePathTranslation from "@/i18n/hook";
import { errorBackground, successBackground } from "@/app/util/colors";

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
  return emailRegex.test(email);
};

export type ResponseData = {
  error?: string;
  info?: string;
};
export type FormFieldData = {
  type: "password" | "text";
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export const FormField = (props: FormFieldData) => {
  return (
    <div className="row" style={{ marginTop: "0.5em" }}>
      <div className="twocols">
        <label className="twocols" htmlFor={props.name}>
          {props.label}
        </label>
      </div>
      <div className="twocols rightcol">
        <input
          type={props.type}
          style={{ ...inputStyle, resize: "vertical" }}
          value={props.value}
          onChange={props.onChange}
          name={props.name}
          id={props.name}
        />
      </div>
    </div>
  );
};

export type FullState<T> = T & LoginData;

export function UserDataForm<AddStateT>(props: {
  title: string;
  initState: AddStateT;
  addForms?: FormFieldData[];
  onSubmit: (formData: FullState<LoginData>) => Promise<ResponseData>;
}) {
  const { t } = usePathTranslation();
  const [formData, setFormData] = useState<FullState<LoginData>>({
    email: "",
    password: "",
    ...props.initState,
  });
  const [errors, setErrors] = useState<ResponseData>({}); // Store validation errors

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Submitting:", formData);
    e.preventDefault();

    // Validate email before submission
    if (!validateEmail(formData.email)) {
      setErrors({ error: "Please enter a valid email address." });
      return; // Stop submission if validation fails
    }

    // More validation?
    const err = await props.onSubmit(formData);
    if (err.error) {
      // Reset password field
      setFormData((prevData) => ({ ...prevData, password: "" }));
    }
    setErrors(err);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  let errorComp = <></>;
  if (errors.error) {
    errorComp = (
      <div
        style={{
          backgroundColor: errorBackground,
          marginTop: 10,
          ...inputStyle,
        }}
      >
        <h3 style={{ padding: 10 }}>{errors.error}</h3>
      </div>
    );
  }

  let infoComp = <></>;
  if (errors.info) {
    infoComp = (
      <div
        style={{
          backgroundColor: successBackground,
          marginTop: 10,
          ...inputStyle,
        }}
      >
        <h3 style={{ padding: 10 }}>{errors.info}</h3>
      </div>
    );
  }

  return (
    <>
      <h4>{props.title}</h4>
      <form onSubmit={handleSubmit}>
        <FormField
          name="email"
          type="text"
          onChange={handleChange}
          value={formData.email}
          label={t("email")}
        />
        <FormField
          name="password"
          type="password"
          onChange={handleChange}
          value={formData.password}
          label={t("password")}
        />

        {props.addForms?.map((el) => {
          const newFormAttrs = {
            ...el,
            onChange: handleChange,
            value: (formData as any)[el.name],
          };
          return <FormField {...newFormAttrs} key={el.name} />;
        })}

        <div className="row" style={{ marginTop: "0.5em" }}>
          <button type="submit" {...buttonAttrs}>
            {t("submit")}
          </button>
        </div>
      </form>
      {errorComp}
      {infoComp}
    </>
  );
}
