<<<<<<< HEAD
import { RenderElements } from "./RenderElements.js";

const main = document.querySelector("main");


const p = document.createElement("p");
p.textContent = "To jest przykładowy paragraf dodany ręcznie.";

const details = RenderElements.renderDetailsSummary(
  "Więcej informacji",
 p
);
main.appendChild(details);








const button = RenderElements.renderButton(
  "Kliknij mnie",
  "primary",
  "button",
  () => {
    alert("Przycisk kliknięty!");
  }
);
main.appendChild(button);

const button2 = RenderElements.renderButton("Kliknij mnie", "secondary", "reset", () => {
  alert("Reset kliknięty!");
});
main.appendChild(button2);

const button3 = RenderElements.renderButton("Kliknij mnie", "tertiary", "submit", () => {
  alert("Przycisk submit kliknięty!");
});
main.appendChild(button3);

const button4 = RenderElements.renderButton("Kliknij mnie", "quaternary");
main.appendChild(button4);

const button5 = RenderElements.renderButton("Kliknij mnie", "fifth");
main.appendChild(button5);

const input = RenderElements.renderInput(
  "Wpisz swoje imię",
  "name",
  "name-input",
  "text",
  "textbox",
  true
);
main.appendChild(input);

const input2 = RenderElements.renderInput(
  "Wpisz swój email",
  "email",
  "email-input",
  "email",
  "textbox",
  true
);
main.appendChild(input2);

const input3 = RenderElements.renderInput(
  "Wpisz swój wiek",
  "age",
  "age-input",
  "number",
  "spinbutton",
  false
);
main.appendChild(input3);

const input4 = RenderElements.renderInput(
  "Wpisz swoje hasło",
  "password",
  "password-input",
  "password",
  "textbox",
  true
);
main.appendChild(input4);

const input5 = RenderElements.renderInput(
  "Wybierz datę",
  "dob",
  "dob-input",
  "date",
  "textbox",
  false
);
main.appendChild(input5);

const input6 = RenderElements.renderInput(
  "Wybierz czas",
  "time",
  "time-input",
  "time",
  "textbox",
  false
);
main.appendChild(input6);

const input7 = RenderElements.renderInput(
  "Wybierz kolor",
  "color",
  "color-input",
  "color",
  "textbox",
  false
);
main.appendChild(input7);

const input8 = RenderElements.renderInput(
  "Wybierz plik",
  "file",
  "file-input",
  "file",
  "textbox",
  false
);
main.appendChild(input8);
const input9 = RenderElements.renderInput(
  "Wybierz tylko pliki pdf lub obrazy",
  "file",
  "file-input-2",
  "file",
  "textbox",
  false,
  "row",
  "",
  ["application/pdf", "image/*"]
);
main.appendChild(input9);

const input10 = RenderElements.renderInput(
  "CheckBox zaznaczony",
  "checkbox",
  "checkbox-input",
  "checkbox",
  "checkbox",
  false,
  "row",
  "true"
);
main.appendChild(input10);

const input10b = RenderElements.renderInput(
  "CheckBox nie zaznaczony",
  "checkbox",
  "checkbox-input-2",
  "checkbox",
  "checkbox",
  false,
  "row",
  "false"
);
main.appendChild(input10b);

const input11 = RenderElements.renderInput(
  "Radio",
  "radio",
  "radio-input",
  "radio",
  "radio",
  false,
  "row",
  "true"
);
main.appendChild(input11);

const input11b = RenderElements.renderInput(
  "Radio 2",
  "radio",
  "radio-input-2",
  "radio",
  "radio",
  false,
  "row",
  "false"
);
main.appendChild(input11b);

const input12 = RenderElements.renderInput(
  "Wybierz zakres",
  "range",
  "range-input",
  "range",
  "slider",
  false
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

const formLogin = RenderElements.renderForm(
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

const fileInputWithPreview = RenderElements.renderFileInputWithPreview(
  "Wybierz plik",
  "file",
  "file-input2"
);
main.appendChild(fileInputWithPreview);

const textArea = RenderElements.renderTextArea(
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

const select = RenderElements.selectInputOptions(selectOptionsData);
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
        src: "https://raw.githubusercontent.com/Code-V-Craft/Filmo-Sfera/refs/heads/main/Obrazy_do_README.md/katalog_projektu.webp",
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
        ]
      },
    ],
    [5, "Element 5", 500, "Edytuj", "Aktywny", { type: "button", label: "Kliknij", buttonStyle: "tertiary", onClick: () => {alert("Hasło pokazane!")} }],
    [6, "Element 6", 600, "Edytuj", "Nieaktywny", {type: "number", value: 42, ariaLabel: "Ilość próbek"}],
    [7, "Element 7", 700, "Edytuj", "Aktywny", {type: "password", value: "Przykładowy tekst", ariaLabel: "Hasło użytkownika"}],
  ],
};

const table = RenderElements.renderResponsiveTable(
  tableData.rows,
  tableData.headers
);
main.appendChild(table);
=======
import { RenderElements } from "./RenderElements.js";

const main = document.querySelector("main");


const p = document.createElement("p");
p.textContent = "To jest przykładowy paragraf dodany ręcznie.";

const details = RenderElements.renderDetailsSummary(
  "Więcej informacji",
 p
);
main.appendChild(details);








const button = RenderElements.renderButton(
  "Kliknij mnie",
  "primary",
  "button",
  () => {
    alert("Przycisk kliknięty!");
  }
);
main.appendChild(button);

const button2 = RenderElements.renderButton("Kliknij mnie", "secondary", "reset", () => {
  alert("Reset kliknięty!");
});
main.appendChild(button2);

const button3 = RenderElements.renderButton("Kliknij mnie", "tertiary", "submit", () => {
  alert("Przycisk submit kliknięty!");
});
main.appendChild(button3);

const button4 = RenderElements.renderButton("Kliknij mnie", "quaternary");
main.appendChild(button4);

const button5 = RenderElements.renderButton("Kliknij mnie", "fifth");
main.appendChild(button5);

const input = RenderElements.renderInput(
  "Wpisz swoje imię",
  "name",
  "name-input",
  "text",
  "textbox",
  true
);
main.appendChild(input);

const input2 = RenderElements.renderInput(
  "Wpisz swój email",
  "email",
  "email-input",
  "email",
  "textbox",
  true
);
main.appendChild(input2);

const input3 = RenderElements.renderInput(
  "Wpisz swój wiek",
  "age",
  "age-input",
  "number",
  "spinbutton",
  false
);
main.appendChild(input3);

const input4 = RenderElements.renderInput(
  "Wpisz swoje hasło",
  "password",
  "password-input",
  "password",
  "textbox",
  true
);
main.appendChild(input4);

const input5 = RenderElements.renderInput(
  "Wybierz datę",
  "dob",
  "dob-input",
  "date",
  "textbox",
  false
);
main.appendChild(input5);

const input6 = RenderElements.renderInput(
  "Wybierz czas",
  "time",
  "time-input",
  "time",
  "textbox",
  false
);
main.appendChild(input6);

const input7 = RenderElements.renderInput(
  "Wybierz kolor",
  "color",
  "color-input",
  "color",
  "textbox",
  false
);
main.appendChild(input7);

const input8 = RenderElements.renderInput(
  "Wybierz plik",
  "file",
  "file-input",
  "file",
  "textbox",
  false
);
main.appendChild(input8);
const input9 = RenderElements.renderInput(
  "Wybierz tylko pliki pdf lub obrazy",
  "file",
  "file-input-2",
  "file",
  "textbox",
  false,
  "row",
  "",
  ["application/pdf", "image/*"]
);
main.appendChild(input9);

const input10 = RenderElements.renderInput(
  "CheckBox zaznaczony",
  "checkbox",
  "checkbox-input",
  "checkbox",
  "checkbox",
  false,
  "row",
  "true"
);
main.appendChild(input10);

const input10b = RenderElements.renderInput(
  "CheckBox nie zaznaczony",
  "checkbox",
  "checkbox-input-2",
  "checkbox",
  "checkbox",
  false,
  "row",
  "false"
);
main.appendChild(input10b);

const input11 = RenderElements.renderInput(
  "Radio",
  "radio",
  "radio-input",
  "radio",
  "radio",
  false,
  "row",
  "true"
);
main.appendChild(input11);

const input11b = RenderElements.renderInput(
  "Radio 2",
  "radio",
  "radio-input-2",
  "radio",
  "radio",
  false,
  "row",
  "false"
);
main.appendChild(input11b);

const input12 = RenderElements.renderInput(
  "Wybierz zakres",
  "range",
  "range-input",
  "range",
  "slider",
  false
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

const formLogin = RenderElements.renderForm(
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

const fileInputWithPreview = RenderElements.renderFileInputWithPreview(
  "Wybierz plik",
  "file",
  "file-input2"
);
main.appendChild(fileInputWithPreview);

const textArea = RenderElements.renderTextArea(
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

const select = RenderElements.selectInputOptions(selectOptionsData);
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
        src: "https://raw.githubusercontent.com/Code-V-Craft/Filmo-Sfera/refs/heads/main/Obrazy_do_README.md/katalog_projektu.webp",
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
        ]
      },
    ],
    [5, "Element 5", 500, "Edytuj", "Aktywny", { type: "button", label: "Kliknij", buttonStyle: "tertiary", onClick: () => {alert("Hasło pokazane!")} }],
    [6, "Element 6", 600, "Edytuj", "Nieaktywny", {type: "number", value: 42, ariaLabel: "Ilość próbek"}],
    [7, "Element 7", 700, "Edytuj", "Aktywny", {type: "password", value: "Przykładowy tekst", ariaLabel: "Hasło użytkownika"}],
  ],
};

const table = RenderElements.renderResponsiveTable(
  tableData.rows,
  tableData.headers
);
main.appendChild(table);
>>>>>>> 088b8cb090ab51e8084b3af46fab348f659a90d3
