import { UIFacade } from "./Class/UIFacade.js";

const main = document.querySelector("main");


const p = document.createElement("p");
p.textContent = "To jest przykładowy paragraf dodany ręcznie.";

const details = UIFacade.createDetails(
  "Więcej informacji",
 p
);
main.appendChild(details);








const button = UIFacade.createButton(
  "Kliknij mnie",
  "primary",
  "button",
  () => {
    alert("Przycisk kliknięty!");
  }
);
main.appendChild(button);

const button2 = UIFacade.createButton("Kliknij mnie", "secondary", "reset", () => {
  alert("Reset kliknięty!");
});
main.appendChild(button2);

const button3 = UIFacade.createButton("Kliknij mnie", "tertiary", "submit", () => {
  alert("Przycisk submit kliknięty!");
});
main.appendChild(button3);

const button4 = UIFacade.createButton("Kliknij mnie", "quaternary");
main.appendChild(button4);

const button5 = UIFacade.createButton("Kliknij mnie", "fifth");
main.appendChild(button5);

const input = UIFacade.createInput(
  "Wpisz swoje imię",
  "name",
  "name-input",
  "text",
  true,
  { role: "textbox" }
);
main.appendChild(input);

const input2 = UIFacade.createInput(
  "Wpisz swój email",
  "email",
  "email-input",
  "email",
  true,
  { role: "textbox" }
);
main.appendChild(input2);

const input3 = UIFacade.createInput(
  "Wpisz swój wiek",
  "age",
  "age-input",
  "number",
  false,
  { role: "spinbutton" }
);
main.appendChild(input3);

const input4 = UIFacade.createInput(
  "Wpisz swoje hasło",
  "password",
  "password-input",
  "password",
  true,
  { role: "textbox" }
);
main.appendChild(input4);

const input5 = UIFacade.createInput(
  "Wybierz datę",
  "dob",
  "dob-input",
  "date",
  false,
  { role: "textbox" }
);
main.appendChild(input5);

const input6 = UIFacade.createInput(
  "Wybierz czas",
  "time",
  "time-input",
  "time",
  false,
  { role: "textbox" }
);
main.appendChild(input6);

const input7 = UIFacade.createInput(
  "Wybierz kolor",
  "color",
  "color-input",
  "color",
  false,
  { role: "textbox" }
);
main.appendChild(input7);

const input8 = UIFacade.createInput(
  "Wybierz plik",
  "file",
  "file-input",
  "file",
  false,
  { role: "textbox" }
);
main.appendChild(input8);
const input9 = UIFacade.createInput(
  "Wybierz tylko pliki pdf lub obrazy",
  "file",
  "file-input-2",
  "file",
  false,
  { role: "textbox", direction: "row", value: "", acceptFiles: ["application/pdf", "image/*"] }
);
main.appendChild(input9);

const input10 = UIFacade.createInput(
  "CheckBox zaznaczony",
  "checkbox",
  "checkbox-input",
  "checkbox",
  false,
  { role: "checkbox", direction: "row", value: "true" }
);
main.appendChild(input10);

const input10b = UIFacade.createInput(
  "CheckBox nie zaznaczony",
  "checkbox",
  "checkbox-input-2",
  "checkbox",
  false,
  { role: "checkbox", direction: "row", value: "false" }
);
main.appendChild(input10b);

const input11 = UIFacade.createInput(
  "Radio",
  "radio",
  "radio-input",
  "radio",
  false,
  { role: "radio", direction: "row", value: "true" }
);
main.appendChild(input11);

const input11b = UIFacade.createInput(
  "Radio 2",
  "radio",
  "radio-input-2",
  "radio",
  false,
  { role: "radio", direction: "row", value: "false" }
);
main.appendChild(input11b);

const input12 = UIFacade.createInput(
  "Wybierz zakres",
  "range",
  "range-input",
  "range",
  false,
  { role: "slider" }
);
main.appendChild(input12);

const loginFormDataInputs = [
  {
    label: "Nazwa użytkownika",
    name: "username",
    id: "login-username",
    type: "text",
    role: "textbox",
    required: true,
  },
  {
    label: "Hasło",
    name: "password",
    id: "login-password",
    type: "password",
    role: "textbox",
    required: true,
  },
];

const formLogin = UIFacade.createForm(
  loginFormDataInputs,
  "Zaloguj się",
  (formData) => {
    alert(
      `Nazwa użytkownika: ${formData.get("username")}\nHasło: ${formData.get(
        "password"
      )}`
    );
  }
);

main.appendChild(formLogin);

const fileInputWithPreview = UIFacade.createFileInputWithPreview(
  "Wybierz plik",
  "file",
  "file-input2"
);
main.appendChild(fileInputWithPreview);

const textArea = UIFacade.createTextArea(
  "Wpisz swoją wiadomość",
  "message",
  "message-input",
  15,
  60,
  true
);
main.appendChild(textArea);

const selectOptionsData = [
  { value: "", text: "Wybierz opcję" },
  { value: "option1", text: "Opcja 1" },
  { value: "option2", text: "Opcja 2" },
  { value: "option3", text: "Opcja 3" },
];

const select = UIFacade.createSelect("Lista wyboru", selectOptionsData);
main.appendChild(select);

const tableData = {
  headers: ["ID", "Nazwa", "Wartość", "Akcje", "Status", "Elementy HTML"],
  rows: [
    [1, "Element 1", 300, "Edytuj", "Aktywny", "2023-01-01"],
    [
      2,
      "Element 2",
      200,
      "Edytuj",
      "Nieaktywny",
      { type: "checkbox", checked: false },
    ],
    [
      3,
      "Element 3",
      300,
      "Edytuj",
      "Aktywny",
      {
        type: "image",
        src: "/logo.png",
        alt: "Obrazek",
      },
    ],
    [
      4,
      "Element 4",
      400,
      "Edytuj",
      "Nieaktywny",
      {
        type: "select",
        options: [
          { value: "option1", text: "Opcja 1" },
          { value: "option2", text: "Opcja 2" },
          { value: "option3", text: "Opcja 3" },
        ],
        placeholder: "Wybierz opcję",
      },
    ],
    [5, "Element 5", 500, "Edytuj", "Aktywny", { type: "button", label: "Kliknij", buttonStyle: "tertiary", onClick: () => {alert("Hasło pokazane!")} }],
    [6, "Element 6", 600, "Edytuj", "Nieaktywny", {type: "number", value: 42, ariaLabel: "Ilość próbek"}],
    [7, "Element 7", 700, "Edytuj", "Aktywny", {type: "password", value: "Przykładowy tekst", ariaLabel: "Hasło użytkownika"}],
  ],
};

const table = UIFacade.createTable(
  tableData.rows,
  tableData.headers
);
main.appendChild(table);