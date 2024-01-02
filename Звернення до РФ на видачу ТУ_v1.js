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
  //викинути помилку, якщо не заповнене значення
  debugger;
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
    setPropertyRequired("ApplicationKind");
    setPropertyRequired("MakingСhanges");
    setPropertyRequired("Branch");
    setPropertyRequired("VisaHolder");
    setPropertyRequired("StructureDepart");
    setPropertyRequired("RegNumber");
    setPropertyRequired("RegDate");
    setPropertyRequired("Registraion");
  }
}

//Скрипт 2. Зміна властивостей атрибутів після виконання завдання
function onCardInitialize() {
  SendOutDocTask();
  EnterResultsTask();
  ReceiptFundsTask();
  EnterActResultTask();
  setCreateProps();
  EnterResultSpecificationTask();
  setPropCompletedOrRejected();
}

function onTaskExecutedSendOutDoc(routeStage) {
  if (routeStage.executionResult == "executed") {
    setPropertyDisabled("ApplicationKind");
    setPropertyDisabled("MakingСhanges");
    setPropertyDisabled("TelephoneContactPerson");
    setPropertyDisabled("Branch");
    setPropertyDisabled("StructureDepart");
    setPropertyDisabled("VisaHolder");
    setPropertyDisabled("RegNumber");
    setPropertyDisabled("RegDate");
    setPropertyDisabled("Registraion");
  }
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
  debugger;
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
  debugger;
  var HomeOrgEDRPOU = EdocsApi.getAttributeValue("HomeOrgEDRPOU").value;
  var HomeOrgName = EdocsApi.getAttributeValue("HomeOrgName").value;
  if (!HomeOrgEDRPOU || !HomeOrgName) {
    return;
  }
  //var comment = comment;
  var methodData = {
    extSysDocId: CurrentDocument.id,
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
function onTaskExecutedAddProtocol(routeStage) {
  debugger;
  if (routeStage.executionResult == "executed") {
    EnterResultsTask();
  }
}

function EnterResultsTask() {
  debugger;
  var stateTask = EdocsApi.getCaseTaskDataByCode("EnterResults")?.state;

  if (stateTask == "assigned" || stateTask == "inProgress" || stateTask == "delegated") {
    setPropertyHidden("ResultMeeting", false);
    setPropertyDisabled("ResultMeeting", false);
  } else if (stateTask == "completed") {
    setPropertyHidden("ResultMeeting", false);
    setPropertyDisabled("ResultMeeting");
  } else {
    setPropertyHidden("ResultMeeting");
    setPropertyDisabled("ResultMeeting", false);
  }
}

function onTaskExecuteEnterResults(routeStage) {
  debugger;
  if (routeStage.executionResult == "executed") {
    validationIsValue("ResultMeeting", "Результат розгляду Звернення Комісією");
    sendComment(`${EdocsApi.getAttributeValue("ResultMeeting").value} - результат розгляду звернення на стороні АТ "Укрзалізниця". Очікуйте інформацію щодо подальших дій.`);
  }
}

//Скрипт 7. Зміна властивостей атрибутів
function ReceiptFundsTask() {
  debugger;
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
  debugger;
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

//Скрипт 1. Зміна властивостей атрибутів
function EnterResultSpecificationTask() {
  debugger;
  var stateTask = EdocsApi.getCaseTaskDataByCode("EnterResultSpecification")?.state;

  if (stateTask == "assigned" || stateTask == "inProgress" || stateTask == "delegated") {
    EdocsApi.setControlProperties({ code: "SpesificationResult", hidden: false, disabled: false, required: true });
  } else if (stateTask == "completed") {
    EdocsApi.setControlProperties({ code: "SpesificationResult", hidden: false, disabled: true, required: true });
  } else {
    EdocsApi.setControlProperties({ code: "SpesificationResult", hidden: true, disabled: false, required: false });
  }
}

function onTaskExecuteEnterResultSpecification(routeStage) {
  debugger;
  if (routeStage.executionResult == "executed") {
    validationIsValue("SpesificationResult", "Результат розгляду ТУ");
  }
}

function onChangeStructureDepart() {
  debugger;
  var StructureDepart = EdocsApi.getAttributeValue("StructureDepart").value;
  if (StructureDepart) {
    var data = EdocsApi.findElementByProperty("id", StructureDepart, EdocsApi.getDictionaryData("Commission")).code; //беремо значення із довідника "StructureDepart" та шукаємо значення в довіднику "Commission"
    setEmployees(data);
  }
}

function setEmployees(data) {
  debugger;
  if (data) {
    const array = data.split(", ");
    var employeeText = null;
    var employee = [];
    for (let index = 0; index < array.length; index++) {
      var employeeById = EdocsApi.getEmployeeDataByEmployeeID(array[index]);
      if (employeeById) {
        employee.push({
          id: 0,
          employeeId: employeeById.employeeId,
          index: index, //потрібно збільшувати на 1
          employeeName: employeeById.shortName,
          positionName: employeeById.positionName,
        });

        employeeText ? (employeeText = employeeText + "\n" + employeeById.positionName + "\t" + employeeById.shortName) : (employeeText = employeeById.positionName + "\t" + employeeById.shortName);
        employeesValue = `[{"id":0,"employeeId":"${employeeById.employeeId}","index":0,"employeeName":"${employeeById.shortName}","positionName":"${employeeById.positionName}"}]`;
      }
    }
    EdocsApi.setAttributeValue({
      code: "VisaHolder",
      value: JSON.stringify(employee),
      text: employeeText,
    });
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

        default:
          break;
      }
  }
}

function onTaskExecuteAddEmployee(routeStage) {
  debugger;
  if (routeStage.executionResult == "executed") {
    validationIsValue("Responsible", "Відповідальний працівник");
  }
}

//Скрипт 2. Зміна властивостей при призначенні завдання
function SendOutDocTask(stateTask) {
  debugger;
  var stateTask = EdocsApi.getCaseTaskDataByCode("SendOutDoc")?.state;

  if (stateTask == "assigned" || stateTask == "inProgress" || stateTask == "delegated") {
    setPropertyHidden("VisaHolders1", false);
    setPropertyDisabled("VisaHolders1", false);
    EdocsApi.setControlProperties({ code: "VisaHolder", hidden: false, disabled: false, required: true });
    // setPropertyRequired("TelephoneContactPerson");
    setPropertyHidden("TelephoneContactPerson", false);
    setPropertyDisabled("TelephoneContactPerson", false);
    EdocsApi.setControlProperties({ code: "StructureDepart", hidden: false, disabled: false, required: true });
    EdocsApi.setControlProperties({ code: "MakingСhanges", hidden: false, disabled: false, required: true });
    EdocsApi.setControlProperties({ code: "ApplicationKind", hidden: false, disabled: false, required: true });
  } else if (stateTask == "completed") {
    EdocsApi.setControlProperties({ code: "VisaHolder", hidden: false, disabled: true, required: true });
    // setPropertyRequired("TelephoneContactPerson");
    setPropertyHidden("TelephoneContactPerson", false);
    setPropertyDisabled("TelephoneContactPerson");
    EdocsApi.setControlProperties({ code: "VisaHolders1", hidden: false, disabled: true, required: true });
    EdocsApi.setControlProperties({ code: "StructureDepart", hidden: false, disabled: true, required: true });
    EdocsApi.setControlProperties({ code: "MakingСhanges", hidden: false, disabled: true, required: true });
    EdocsApi.setControlProperties({ code: "ApplicationKind", hidden: false, disabled: true, required: true });
  } else {
    EdocsApi.setControlProperties({ code: "VisaHolders1", hidden: true, disabled: false, required: false });
    EdocsApi.setControlProperties({ code: "ApplicationKind", hidden: true, disabled: true, required: false });
    EdocsApi.setControlProperties({ code: "MakingСhanges", hidden: true, disabled: true, required: false });
    EdocsApi.setControlProperties({ code: "TelephoneContactPerson", hidden: true, disabled: true, required: false });
    EdocsApi.setControlProperties({ code: "StructureDepar", hidden: true, disabled: true, required: false });
    EdocsApi.setControlProperties({ code: "VisaHolder", hidden: true, disabled: true, required: false });
    EdocsApi.setControlProperties({ code: "Registraion", hidden: true, disabled: true, required: false });
    EdocsApi.setControlProperties({ code: "RegNumber", hidden: true, disabled: true, required: false });
    EdocsApi.setControlProperties({ code: "RegDate", hidden: true, disabled: true, required: false });
  }
}

function onTaskExecuteSendOutDoc(routeStage) {
  debugger;
  if (routeStage.executionResult == "executed") {
    validationIsValue("VisaHolder1", "Інфориаація щодо Технічних умов");
    validationIsValue("StructureDepart", "Постійно-діюча комісія");
    validationIsValue("VisaHolder", "Погоджуючі");

    sendComment(`Ваше звернення прийняте та зареєстроване за № ${EdocsApi.getAttributeValue("RegNumber").value} від ${moment(new Date(EdocsApi.getAttributeValue("RegDate").value)).format("DD.MM.YYYY")}`);
    sendCommand(routeStage);
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
    setPropertyDisabled("Responsible");
    setPropertyHidden("Responsible", false);
    EdocsApi.setControlProperties({ code: "ApplicationKind", hidden: true, disabled: true, required: false });
    EdocsApi.setControlProperties({ code: "MakingСhanges", hidden: true, disabled: true, required: false });
    EdocsApi.setControlProperties({ code: "TelephoneContactPerson", hidden: true, disabled: true, required: false });
    EdocsApi.setControlProperties({ code: "StructureDepart", hidden: true, disabled: true, required: false });
    EdocsApi.setControlProperties({ code: "VisaHolder", hidden: true, disabled: true, required: false });
    EdocsApi.setControlProperties({ code: "Registraion", hidden: true, disabled: true, required: false });
    EdocsApi.setControlProperties({ code: "RegNumber", hidden: true, disabled: true, required: false });
    EdocsApi.setControlProperties({ code: "RegDate", hidden: true, disabled: true, required: false });
  } else if (stateTaskMainTask == "rejected") {
    setPropertyDisabled("ApplicationKind");
    setPropertyDisabled("MakingСhanges");
    setPropertyDisabled("TelephoneContactPerson");
    setPropertyDisabled("StructureDepart");
    setPropertyDisabled("VisaHolder");
    setPropertyDisabled("Responsible");
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
