function setPropertyRequired(attributeName, boolValue = true) {
  //обов"язкове
  var attributeProps = EdocsApi.getControlProperties(attributeName);
  attributeProps.required = boolValue;
  EdocsApi.setControlProperties(attributeProps);
}

function setPropertyHidden(attributeName, boolValue = true) {
  //приховане
  var attributeProps = EdocsApi.getControlProperties(attributeName);
  attributeProps.hidden = boolValue;
  EdocsApi.setControlProperties(attributeProps);
}

function setPropertyDisabled(attributeName, boolValue = true) {
  //недоступне
  var attributeProps = EdocsApi.getControlProperties(attributeName);
  attributeProps.disabled = boolValue;
  EdocsApi.setControlProperties(attributeProps);
}

function validationIsValue(attributeName, nameForThrow) {
  if (!EdocsApi.getAttributeValue(attributeName).value) {
    throw `Не заповнено значення поля "${nameForThrow}"`;
  }
}
//Скрипт 1. Зміна властивостей атрибутів при створені документа
function onCreate() {
  setContractorRPEmailOnCreate();
  setBranchAndSectionsOnCreate();
}

function setCreateProps() {
  if (CurrentDocument.inExtId) {
    setPropertyRequired("Subject");
    setPropertyRequired("Branch");
    setPropertyRequired("RegNumber");
    setPropertyRequired("RegDate");
    setPropertyRequired("Registraion");
  }
}

//Скрипт 2. Зміна властивостей атрибутів після виконання завдання
function onCardInitialize() {
  SendOutDocTask();
  ToDoPaymentOptionTask();
  ReceiptFundsTask();
  EnterActResultTask();
  setCreateProps();
  setPropCompletedOrRejected();
}

//Скрипт 4. Автоматичне визначення email контактної особи Замовника
function setContractorRPEmailOnCreate() {
  if (CurrentDocument.inExtId) {
    var atr = EdocsApi.getInExtAttributes(CurrentDocument.id.toString())?.tableAttributes;
    if (atr)
      EdocsApi.setAttributeValue({
        code: "ContractorRPEmail",
        value: EdocsApi.findElementByProperty("code", "ContactPersonEmail", atr)?.value,
        text: null,
      });
  }
}

function sendCommand(routeStage) {
  var command;
  var comment;
  if (routeStage.executionResult == "executed") {
    command = "CompleteTask";
  } else {
    command = "RejectTask";
    comment = routeStage.comment;
  }
  var signatures = EdocsApi.getSignaturesAllFiles();
  var DocCommandData = {
    extSysDocID: CurrentDocument.id,
    extSysDocVersion: CurrentDocument.version,
    command: command,
    legalEntityCode: EdocsApi.getAttributeValue("HomeOrgEDRPOU").value,
    userEmail: EdocsApi.getEmployeeDataByEmployeeID(CurrentUser.employeeId).email,
    userTitle: CurrentUser.fullName,
    comment: comment,
    signatures: signatures,
  };

  routeStage.externalAPIExecutingParams = {
    externalSystemCode: "ESIGN1", // код зовнішньої системи
    externalSystemMethod: "integration/processDocCommand", // метод зовнішньої системи
    data: DocCommandData, // дані, що очікує зовнішня система для заданого методу
    executeAsync: false, // виконувати завдання асинхронно
  };
}

function sendComment(comment) {
  var HomeOrgEDRPOU = EdocsApi.getAttributeValue("HomeOrgEDRPOU").value;
  var HomeOrgName = EdocsApi.getAttributeValue("HomeOrgName").value;
  if (!HomeOrgEDRPOU || !HomeOrgName) {
    return;
  }
  var methodData = {
    extSysDocId: CurrentDocument.id,
    ExtSysDocVersion: CurrentDocument.version,
    eventType: "CommentAdded",
    comment: comment,
    partyCode: HomeOrgEDRPOU,
    userTitle: CurrentUser.name,
    partyName: HomeOrgName,
    occuredAt: new Date(),
  };
  EdocsApi.runExternalFunction("ESIGN1", "integration/processEvent", methodData);
}

//Скрипт 6. Зміна властивостей атрибутів
function onTaskExecutedSendOutDoc(routeStage) {
  if (routeStage.executionResult == "executed") {
    ToDoPaymentOptionTask();
  }
}

function ToDoPaymentOptionTask() {
  var stateTask = EdocsApi.getCaseTaskDataByCode("ToDoPaymentOption" + EdocsApi.getAttributeValue("Sections").value)?.state;

  if (stateTask == "assigned" || stateTask == "inProgress" || stateTask == "delegated") {
    setPropertyDisabled("PaymentOption", false);
    setPropertyHidden("PaymentOption", false);
  } else if (stateTask == "completed") {
    setPropertyDisabled("PaymentOption");
    setPropertyHidden("PaymentOption", false);
  } else {
    setPropertyDisabled("PaymentOption", false);
    setPropertyHidden("PaymentOption");
  }
}

function onTaskExecutePaymentOption(routeStage) {
  if (routeStage.executionResult == "executed") {
    validationIsValue("PaymentOption", "Спосіб оплати коштів Замовником");
  }
}

//Скрипт 7. Зміна властивостей атрибутів
function ReceiptFundsTask() {
  var stateTask = EdocsApi.getCaseTaskDataByCode("ReceiptFunds" + EdocsApi.getAttributeValue("Sections").value)?.state;

  if (stateTask == "assigned" || stateTask == "inProgress" || stateTask == "delegated") {
    EdocsApi.setControlProperties({ code: "StatusInvoice", hidden: false, disabled: false, required: true });
  } else if (stateTask == "completed") {
    EdocsApi.setControlProperties({ code: "StatusInvoice", hidden: false, disabled: true, required: true });
  } else {
    EdocsApi.setControlProperties({ code: "StatusInvoice", hidden: true, disabled: false, required: false });
  }
}

function onTaskExecuteReceiptFunds(routeStage) {
  if (routeStage.executionResult == "executed") {
    validationIsValue("StatusInvoice", "Статус оплати Замовником");
  }
}

//Скрипт 8. Зміна властивостей атрибутів
function EnterActResultTask() {
  debugger;
  var stateTask = EdocsApi.getCaseTaskDataByCode("EnterActResult" + EdocsApi.getAttributeValue("Sections").value)?.state;

  if (stateTask == "assigned" || stateTask == "inProgress" || stateTask == "delegated") {
    EdocsApi.setControlProperties({ code: "ActMeetingResult", hidden: false, disabled: false, required: true });
  } else if (stateTask == "completed") {
    EdocsApi.setControlProperties({ code: "ActMeetingResult", hidden: false, disabled: true, required: true });
  } else {
    EdocsApi.setControlProperties({ code: "ActMeetingResult", hidden: true, disabled: false, required: false });
  }
}

function onTaskExecuteEnterActResult(routeStage) {
  debugger;
  if (routeStage.executionResult == "executed") {
    validationIsValue("ActMeetingResult", "Результат розгляду акту комісією");
  }
}

//Автоматичне визначення розрізу за кодом ЄДРПОУ
function setBranchAndSectionsOnCreate() {
  debugger;
  if (CurrentDocument.inExtId) {
    var atr = EdocsApi.getInExtAttributes(CurrentDocument.id.toString())?.tableAttributes;
    if (atr)
      switch (atr.find((x) => x.code == "LegalEntityCode" && x.row == "1")?.value) {
        case "40081195":
          EdocsApi.setAttributeValue({ code: "Branch", value: 82, text: null });
          EdocsApi.setAttributeValue({ code: "Sections", value: "40081195", text: null });
          break;

        case "40081216":
          EdocsApi.setAttributeValue({ code: "Branch", value: 86, text: null });
          EdocsApi.setAttributeValue({ code: "Sections", value: "40081216", text: null });
          break;

        case "40081237":
          EdocsApi.setAttributeValue({ code: "Branch", value: 252, text: null });
          EdocsApi.setAttributeValue({ code: "Sections", value: "40081237", text: null });
          break;
      }
  }
}

//Скрипт 2. Зміна властивостей при призначенні завдання
function SendOutDocTask(stateTask) {
  var stateTask = EdocsApi.getCaseTaskDataByCode("SendOutDoc")?.state;

  if (stateTask == "assigned" || stateTask == "inProgress" || stateTask == "delegated") {
    EdocsApi.setControlProperties({ code: "Subject", hidden: false, disabled: false, required: true });
    setPropertyHidden("TelephoneContactPerson", false);
    setPropertyDisabled("TelephoneContactPerson", false);
  } else if (stateTask == "completed") {
    EdocsApi.setControlProperties({ code: "Subject", hidden: false, disabled: true, required: true });
    setPropertyHidden("TelephoneContactPerson", false);
    setPropertyDisabled("TelephoneContactPerson");
    setPropertyDisabled("Branch");
  } else {
    EdocsApi.setControlProperties({ code: "Subject", hidden: true, disabled: false, required: false });
    EdocsApi.setControlProperties({ code: "TelephoneContactPerson", hidden: true, disabled: false, required: false });
  }
}

function onTaskExecuteSendOutDoc(routeStage) {
  if (routeStage.executionResult == "executed") {
    sendCommand(routeStage);
    sendComment(`Ваше звернення прийняте та зареєстроване за № ${EdocsApi.getAttributeValue("RegNumber").value} від ${moment(new Date(EdocsApi.getAttributeValue("RegDate").value)).format("DD.MM.YYYY")}`);
  }
}

function onTaskExecuteMainTask(routeStage) {
  if (routeStage.executionResult == "rejected") {
    sendCommand(routeStage);
  }
}

//передача коментара в єСайн, додаткових функцій не потрібно
function onTaskCommentedSendOutDoc(caseTaskComment) {
  var orgCode = EdocsApi.getAttributeValue("HomeOrgEDRPOU").value;
  var orgShortName = EdocsApi.getAttributeValue("HomeOrgName").value;
  if (!orgCode || !orgShortName) {
    return;
  }

  var methodData = {
    extSysDocId: CurrentDocument.id,
    eventType: "CommentAdded",
    comment: caseTaskComment.comment,
    partyCode: orgCode,
    userTitle: CurrentUser.name,
    partyName: orgShortName,
    occuredAt: new Date(),
  };

  caseTaskComment.externalAPIExecutingParams = {
    externalSystemCode: "ESIGN1", // код зовнішньої системи
    externalSystemMethod: "integration/processEvent", // метод зовнішньої системи
    data: methodData, // дані, що очікує зовнішня система для заданого методу
    executeAsync: true, // виконувати завдання асинхронно
  };
}

//зміна властивостей при паралельних процесах
//Скрипт 1. Зміна властивостей атрибутів полів карточки
function setPropCompletedOrRejected() {
  debugger;

  var stateTaskAddEmployee = EdocsApi.getCaseTaskDataByCode("AddEmployee" + EdocsApi.getAttributeValue("Sections").value)?.state;
  var stateTaskMainTask = EdocsApi.getCaseTaskDataByCode("MainTask")?.state;
  var stateTaskSendOutDoc = EdocsApi.getCaseTaskDataByCode("SendOutDoc")?.state;

  if (stateTaskAddEmployee == "completed" && stateTaskMainTask == "rejected") {
    EdocsApi.setControlProperties({ code: "Registraion", hidden: true, disabled: true, required: false });
    EdocsApi.setControlProperties({ code: "RegNumber", hidden: true, disabled: true, required: false });
    EdocsApi.setControlProperties({ code: "RegDate", hidden: true, disabled: true, required: false });
    setPropertyDisabled("Responsible");
  } else if (stateTaskSendOutDoc == "rejected" && stateTaskMainTask == "rejected") {
    EdocsApi.setControlProperties({ code: "Subject", hidden: true, disabled: true, required: false });
    setPropertyDisabled("Responsible");
    setPropertyHidden("Responsible", false);
    EdocsApi.setControlProperties({ code: "TelephoneContactPerson", hidden: true, disabled: true, required: false });
    EdocsApi.setControlProperties({ code: "StructureDepart", hidden: true, disabled: true, required: false });
    EdocsApi.setControlProperties({ code: "VisaHolder", hidden: true, disabled: true, required: false });
    EdocsApi.setControlProperties({ code: "Registraion", hidden: true, disabled: true, required: false });
    EdocsApi.setControlProperties({ code: "RegNumber", hidden: true, disabled: true, required: false });
    EdocsApi.setControlProperties({ code: "RegDate", hidden: true, disabled: true, required: false });
  } else if (stateTaskMainTask == "rejected") {
    setPropertyDisabled("Subject");
    setPropertyDisabled("Responsible");
    setPropertyDisabled("TelephoneContactPerson");
    setPropertyDisabled("StructureDepart");
    setPropertyDisabled("VisaHolder");
    setPropertyDisabled("Registraion");
    setPropertyDisabled("RegDate");
    setPropertyDisabled("RegNumber");
  } else if (stateTaskAddEmployee == "completed") {
    setPropertyDisabled("Responsible");
    setPropertyDisabled("Registraion");
    setPropertyDisabled("RegDate");
    setPropertyDisabled("RegNumber");
  } else {
    setPropertyHidden("Responsible", false);
    setPropertyHidden("RegDate", false);
    setPropertyHidden("Registraion", false);
    setPropertyHidden("RegNumber", false);
  }
}

function onTaskExecuteAddEmployee(routeStage) {
  if (routeStage.executionResult == "executed") {
    validationIsValue("Responsible", "Відповідальний працівник");
    validationIsValue("RegDate", "Реєстраційна дата");
    validationIsValue("RegNumber", "Реєстраційний номер");
    validationIsValue("Registraion", "Реєстрація");
  }
}

function onTaskExecutedAddEmployee() {
  setPropertyDisabled("Responsible");
  setPropertyDisabled("RegDate");
  setPropertyDisabled("Registraion");
  setPropertyDisabled("RegNumber");
}
