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

//Скрипт 1. Зміна властивостей атрибутів
function setCreateProps() {
  if (CurrentDocument.inExtId) {
    setPropertyRequired("Branch");
  }
}

function onCardInitialize() {
  setCreateProps();
  SendOutDocTask();
  EnterResultsTask();
  setPropResponsibleAndRegistration();
  setPropRegistration();
}

//Скрипт 2. Зміна властивостей при призначенні завдання
function onTaskExecutedAddEmployee(routeStage) {
  debugger;
  if (routeStage.executionResult == "executed") {
    SendOutDocTask();
  }
}

function SendOutDocTask(stateTask) {
  debugger;
  if (!stateTask) {
    stateTask = EdocsApi.getCaseTaskDataByCode("SendOutDoc")?.state;
  }
  if (stateTask == "assigned" || stateTask == "inProgress" || stateTask == "delegated") {
    //setPropertyRequired("VisaHolders1");
    setPropertyHidden("VisaHolders1", false);
    setPropertyDisabled("VisaHolders1", false);
    setPropertyRequired("Branch");
    setPropertyHidden("Branch", false);
    setPropertyDisabled("Branch", false);
    setPropertyRequired("NumberApplication");
    setPropertyHidden("NumberApplication", false);
    setPropertyDisabled("NumberApplication", false);
    setPropertyRequired("DocKind");
    setPropertyHidden("DocKind", false);
    setPropertyDisabled("DocKind", false);
    setPropertyRequired("DateApplication");
    setPropertyHidden("DateApplication", false);
    setPropertyDisabled("DateApplication", false);
    // setPropertyRequired("TelephoneContactPerson");
    setPropertyHidden("TelephoneContactPerson", false);
    setPropertyDisabled("TelephoneContactPerson", false);
    setPropertyRequired("StructureDepart");
    setPropertyHidden("StructureDepart", false);
    setPropertyDisabled("StructureDepart", false);
    setPropertyRequired("Subject");
    setPropertyHidden("Subject", false);
    setPropertyDisabled("Subject", false);
    setPropertyRequired("VisaHolder");
    setPropertyHidden("VisaHolder", false);
    setPropertyDisabled("VisaHolder", false);
    setPropertyRequired("RegNumber");
    setPropertyHidden("RegNumber", false);
    setPropertyDisabled("RegNumber", false);
    setPropertyRequired("RegDate");
    setPropertyHidden("RegDate", false);
    setPropertyDisabled("RegDate", false);
    setPropertyRequired("Registraion");
    setPropertyHidden("Registraion", false);
    setPropertyDisabled("Registraion", false);
  } else if (stateTask == "completed") {
    setPropertyRequired("VisaHolders1");
    setPropertyHidden("VisaHolders1", false);
    setPropertyDisabled("VisaHolders1");
    setPropertyRequired("Branch");
    setPropertyHidden("Branch", false);
    setPropertyDisabled("Branch");
    setPropertyRequired("DocKind");
    setPropertyHidden("DocKind", false);
    setPropertyDisabled("DocKind");
    setPropertyRequired("NumberApplication");
    setPropertyHidden("NumberApplication", false);
    setPropertyDisabled("NumberApplication");
    setPropertyRequired("DateApplication");
    setPropertyHidden("DateApplication", false);
    setPropertyDisabled("DateApplication");
    // setPropertyRequired("TelephoneContactPerson");
    setPropertyHidden("TelephoneContactPerson", false);
    setPropertyDisabled("TelephoneContactPerson");
    setPropertyRequired("StructureDepart");
    setPropertyHidden("StructureDepart", false);
    setPropertyDisabled("StructureDepart");
    setPropertyRequired("Subject");
    setPropertyHidden("Subject", false);
    setPropertyDisabled("Subject");
    setPropertyRequired("VisaHolder");
    setPropertyHidden("VisaHolder", false);
    setPropertyDisabled("VisaHolder");
    setPropertyRequired("RegNumber");
    setPropertyHidden("RegNumber", false);
    setPropertyDisabled("RegNumber");
    setPropertyRequired("RegDate");
    setPropertyHidden("RegDate", false);
    setPropertyDisabled("RegDate");
    setPropertyRequired("Registraion");
    setPropertyHidden("Registraion", false);
    setPropertyDisabled("Registraion");
  } else if (stateTask == "rejected") {
    if (EdocsApi.getCaseTaskDataByCode("AddEmployee" + EdocsApi.getAttributeValue("Sections").value)?.state == "rejected") {
      EdocsApi.setControlProperties({ code: "DocKind", hidden: true, disabled: true, required: false });
      EdocsApi.setControlProperties({ code: "Subject", hidden: true, disabled: true, required: false });
      EdocsApi.setControlProperties({ code: "Branch", hidden: true, disabled: true, required: false });
      EdocsApi.setControlProperties({ code: "StructureDepart", hidden: true, disabled: true, required: false });
      EdocsApi.setControlProperties({ code: "VisaHolder", hidden: true, disabled: true, required: false });
      EdocsApi.setControlProperties({ code: "Registraion", hidden: true, disabled: true, required: false });
      EdocsApi.setControlProperties({ code: "RegNumber", hidden: true, disabled: true, required: false });
      EdocsApi.setControlProperties({ code: "RegDate", hidden: true, disabled: true, required: false });
    }
  } else {
    setPropertyRequired("VisaHolders1", false);
    setPropertyHidden("VisaHolders1");
    setPropertyDisabled("VisaHolders1", false);
    setPropertyRequired("TelephoneContactPerson", false);
    setPropertyHidden("TelephoneContactPerson");
    setPropertyDisabled("TelephoneContactPerson", false);
    setPropertyRequired("StructureDepart", false);
    setPropertyHidden("StructureDepart");
    setPropertyDisabled("Subject", false);
    setPropertyRequired("Subject", false);
    setPropertyHidden("Subject");
    setPropertyDisabled("DocKind", false);
    setPropertyRequired("DocKind", false);
    setPropertyHidden("DocKind");
    setPropertyDisabled("StructureDepart", false);
    setPropertyRequired("VisaHolder", false);
    setPropertyHidden("VisaHolder");
    setPropertyDisabled("VisaHolder", false);
    setPropertyRequired("NumberApplication", false);
    setPropertyHidden("NumberApplication");
    setPropertyDisabled("NumberApplication", false);
    setPropertyRequired("DateApplication", false);
    setPropertyHidden("DateApplication");
    setPropertyDisabled("DateApplication", false);
    setPropertyRequired("RegNumber", false);
    setPropertyHidden("RegNumber");
    setPropertyDisabled("RegNumber", false);
    setPropertyRequired("RegDate", false);
    setPropertyHidden("RegDate");
    setPropertyDisabled("RegDate", false);
    setPropertyRequired("Registraion", false);
    setPropertyHidden("Registraion");
    setPropertyDisabled("Registraion", false);
  }
}

function onTaskExecuteSendOutDoc(routeStage) {
  debugger;
  if (routeStage.executionResult == "executed") {
    validationIsValue("VisaHolders1", "Інфориаація щодо Технічних умов");
    validationIsValue("StructureDepart", "Постійно-діюча комісія");
    validationIsValue("VisaHolder", "Погоджуючі");

    validationIsValue("RegNumber", "Реєстраційний номер");
    validationIsValue("RegDate", "Реєстраційна дата");
    validationIsValue("Registraion", "Реєстрація");
    sendComment(`Ваше звернення прийняте та зареєстроване за № ${EdocsApi.getAttributeValue("RegNumber").value} від ${moment(new Date(EdocsApi.getAttributeValue("RegDate").value)).format("DD.MM.YYYY")}`);
    sendCommand(routeStage);
  } else {
    SendOutDocTask("rejected");
  }
}

function onTaskExecuteMainTask(routeStage) {
  if (routeStage.executionResult == "rejected") {
    sendCommand(routeStage);
  }
}

//Скрипт 1. Зміна властивостей атрибутів при створені документа
function onCreate() {
  setContractorRPEmailOnCreate();
  setBranchAndSectionsOnCreate();
}
//setCreateProps();

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
    EdocsApi.setControlProperties({ code: "ResultMeeting", hidden: false, disabled: false, required: true });
  } else if (stateTask == "completed") {
    EdocsApi.setControlProperties({ code: "ResultMeeting", hidden: false, disabled: true, required: true });
  } else {
    EdocsApi.setControlProperties({ code: "ResultMeeting", hidden: true, disabled: false, required: false });
  }
}

function onTaskExecuteEnterResults(routeStage) {
  debugger;
  if (routeStage.executionResult == "executed") {
    if (!EdocsApi.getAttributeValue("ResultMeeting").value) throw `Внесіть значення в поле "Результат розгляду Звернення Комісією"`;
    sendComment(`${EdocsApi.getAttributeValue("ResultMeeting").value} - результат розгляду звернення, що прийнятий протокольним рішенням № ${EdocsApi.getAttributeValue("NumberProtocol").value} від ${moment(new Date(EdocsApi.getAttributeValue("DateProtocol").value)).format("DD.MM.YYYY")} Очікуйте інформацію щодо подальших дій.`);
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

//передача коментара в єСайн, додаткових функцій не потрібно
function onTaskCommentedSendOutDoc(caseTaskComment) {
  debugger;
  var orgCode = EdocsApi.getAttributeValue("HomeOrgEDRPOU").value;
  var orgShortName = EdocsApi.getAttributeValue("HomeOrgName").value;
  if (!orgCode || !orgShortName) {
    return;
  }
  var idnumber = CurrentDocument.id;
  //EdocsApi.getAttributeValue("DocId");
  var methodData = {
    extSysDocId: idnumber,
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
function onTaskPickUpedAddEmployee() {
  setPropResponsibleAndRegistration();
}

function onTaskPickUpedInformHead() {
  setPropResponsibleAndRegistration();
}

function setPropResponsibleAndRegistration() {
  debugger;
  var CaseTaskAddEmployee = EdocsApi.getCaseTaskDataByCode("AddEmployee" + EdocsApi.getAttributeValue("Sections").value);
  var CaseTaskInformHead = EdocsApi.getCaseTaskDataByCode("InformHead" + EdocsApi.getAttributeValue("Sections").value);

  if (
    //етап AddEmployee взято в роботу, поточний користувач == виконавець завдання AddEmployee
    (CaseTaskAddEmployee.state == "inProgress" && CurrentUser.employeeId == CaseTaskAddEmployee.executorId) ||
    (CaseTaskAddEmployee.state == "delegated" && CurrentUser.employeeId == CaseTaskAddEmployee.executorId)
  ) {
    EdocsApi.setControlProperties({ code: "Responsible", hidden: false, disabled: false, required: true });
    EdocsApi.setControlProperties({ code: "Registraion", hidden: false, disabled: false, required: true });
    EdocsApi.setControlProperties({ code: "RegDate", hidden: false, disabled: false, required: true });
    EdocsApi.setControlProperties({ code: "RegNumber", hidden: false, disabled: false, required: true });
  } else if (
    //етап InformHead взято в роботу, поточний користувач == виконавець завдання InformHead
    (CaseTaskInformHead.state == "inProgress" && CurrentUser.employeeId == CaseTaskInformHead.executorId) ||
    (CaseTaskInformHead.state == "delegated" && CurrentUser.employeeId == CaseTaskInformHead.executorId)
  ) {
    EdocsApi.setControlProperties({ code: "Responsible", hidden: false, disabled: true, required: false });
    EdocsApi.setControlProperties({ code: "Registraion", hidden: false, disabled: true, required: false });
    EdocsApi.setControlProperties({ code: "RegDate", hidden: false, disabled: true, required: false });
    EdocsApi.setControlProperties({ code: "RegNumber", hidden: false, disabled: true, required: false });
  } else if (CaseTaskAddEmployee.state == "completed" && CaseTaskInformHead.state == "completed") {
    EdocsApi.setControlProperties({ code: "Responsible", hidden: false, disabled: true, required: true });
    EdocsApi.setControlProperties({ code: "Registraion", hidden: false, disabled: true, required: true });
    EdocsApi.setControlProperties({ code: "RegDate", hidden: false, disabled: true, required: true });
    EdocsApi.setControlProperties({ code: "RegNumber", hidden: false, disabled: true, required: true });
  } else {
    setPropertyHidden("Responsible", false);
    setPropertyRequired("Responsible");
    //setPropertyDisabled("Responsible");
    setPropertyHidden("RegDate", false);
    setPropertyRequired("RegDate");
    setPropertyHidden("Registraion", false);
    setPropertyRequired("Registraion");
    setPropertyHidden("RegNumber", false);
    setPropertyRequired("RegNumber");
  }
}

function onTaskExecuteAddEmployee(routeStage) {
  debugger;
  if (routeStage.executionResult == "executed") {
    validationIsValue("Responsible", "Відповідальний працівник");
    validationIsValue("RegDate", "Реєстраційна дата");
    validationIsValue("RegNumber", "Реєстраційний номер");
    validationIsValue("Registraion", "Реєстрація");
  }
}

function setPropRegistration() {
  debugger;
  if (EdocsApi.getCaseTaskDataByCode("AddEmployee" + EdocsApi.getAttributeValue("Sections").value)?.state == "completed" && EdocsApi.getCaseTaskDataByCode("MainTask")?.state == "rejected") {
    EdocsApi.setControlProperties({ code: "Registraion", hidden: true, disabled: true, required: false });
    EdocsApi.setControlProperties({ code: "RegDate", hidden: true, disabled: true, required: false });
    EdocsApi.setControlProperties({ code: "RegNumber", hidden: true, disabled: true, required: false });
  }
}
