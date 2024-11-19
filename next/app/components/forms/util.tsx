import { useState } from "react";
import { buttonStyle, inputStyle } from "../../util/styles";
import usePathTranslation from "@/i18n/hook";

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
  return emailRegex.test(email);
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
  onSubmit: (formData: FullState<LoginData>) => Promise<string | null>;
}) {
  const { t } = usePathTranslation();
  const [formData, setFormData] = useState<FullState<LoginData>>({
    email: "",
    password: "",
    ...props.initState,
  });
  const [errors, setErrors] = useState<string | null>(null); // Store validation errors

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Form Data:", formData);
    e.preventDefault();

    // Validate email before submission
    if (!validateEmail(formData.email)) {
      setErrors("Please enter a valid email address.");
      return; // Stop submission if validation fails
    }

    // More validation?
    const err = await props.onSubmit(formData);
    if (err != null) {
      // Reset password field
      setErrors(err);
      setFormData((prevData) => ({ ...prevData, password: "" }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  let errorComp = <></>;
  if (errors != null) {
    errorComp = (
      <div style={{ backgroundColor: "red", marginTop: 10 }}>
        <h3 style={{ padding: 10 }}>{errors}</h3>
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
          <button type="submit" style={buttonStyle}>
            {t("submit")}
          </button>
        </div>
      </form>
      {errorComp}
    </>
  );
}
