const steps = [];
var active;
let editMode = false;
let editRow = null;
const penIntEntryTable = document.getElementById('peninttable');
const penIntTablePlaceholder = 'You have not added any penalties or interest.'
//const penIntEntryTableTBody = penIntEntryTable.querySelector('tbody');

const supportingDocTable = document.getElementById('documentsTable');
const supportingDocTablePlaceholder = 'You have not uploaded any files.';
// const supportingDocTableTBody = supportingDocTable.querySelector('tbody');

const selectedFileNameDiv = document.getElementById('fileName');
const selectedFileDefault = 'No file chosen.';

let additionalYearFields = 0;

var penalty = true;
var interest = true;

var severeWeather = false;
var fireOrFlood = false;
var seriouslyIll = false;
var mentalDistress = false;
var signficantDeath = false;
var deathRepresentative = false;
var strikeOrProtest = false;
var craDelay = false;
var craError = false;
var extraordinaryCircumstances = false;
var financial;

var dueTofinancialSituation = false;
var individual = false;
var business = false;

const financialSupDoc = [false,false,false,false,false];
const accidentSupDoc = [false,false,false,false];
const disasterSupDoc = [false,false,false,false,false,false];

const warnings = [false, false, false, false, false];

const stepIcons = ["bybIcon","step1Icon", "step2Icon", "step3Icon", "step4Icon"];

document.querySelectorAll('.step').forEach(element => {

    steps.push(element);
    if (element.classList.contains('active')) {
        active = element;
    }
    
});


//Stepper Functions
function adjustMaxHeight(step) {
    const stepContainer = step.querySelector('.step-container');
    const stepContent = step.querySelector('.step-content');

    if (stepContainer && stepContent) {
        var height = stepContainer.scrollHeight + stepContent.clientHeight;
        //stepContainer.style.maxHeight = height + 'px'; // Adjust the max height based on the content's scroll height
        stepContainer.style.maxHeight = 'auto';
    }
}

function jumpStep(step) {
    var currentStep = document.querySelector('.step.active');
    currentStep.classList.remove('active');
    active = document.querySelector('#' + step);
    active.classList.add('active');
    progressIcons(step);
}

function navigateStep(direction) {

    let currentIndex = steps.indexOf(active); // Find the current index of the active step
    let targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;


    if (direction === 'next' && !validateStep(active)) {
    
        alert('Please fill in all required fields before proceeding.'); // Provide user feedback
        return; // Prevent navigation if validation fails
    }

    // Check if the target index is within bounds (aka if the step is real)
    if (targetIndex >= 0 && targetIndex < steps.length) {
    
        const currentStepAccordions = active.querySelectorAll('.accordion');
        currentStepAccordions.forEach(accordion => {
            accordion.classList.remove('active');
            accordionContent = accordion.nextElementSibling;
            accordionContent.style.maxHeight = null;
        });
        active.classList.remove('active'); // Remove 'active' class from current step
        const stepContainer = active.querySelector('.step-container');
        if (stepContainer) {
            stepContainer.style.maxHeight = null; // Close the current step

        }
       
        const targetStep = steps[targetIndex]; // Get the target step based on direction
        targetStep.classList.add('active'); // Add 'active' class to the target step
        
        active = targetStep; // Update the active variable to the new active step
        adjustMaxHeight(active); // Adjust the max height of the target step

        switch (targetIndex) {
            case 0:
                progressIcons(0);
                break;
            case 1:
                progressIcons(1);
                break;
            case 2:
                progressIcons(2);
                break;
            case 3:
                progressIcons(3);
                break;
            case 4:
                progressIcons(4);
                break;
        }
    }
}

function toggleLB(type) {
    //modify this so the parameter is just the id and it doesnt need individual if statements for everything

    if (type === 'penaltyYear') {
        document.querySelector('#penaltyYearLightbox').classList.toggle('open');
    }
    if (type === 'interestYear') {
        document.querySelector('#interestYearLightbox').classList.toggle('open');
    }
    
    if (type === 'charge') {
        document.querySelector('#chargelightbox').classList.toggle('open');
    }
    if (type === 'assetsForInd') {
        document.querySelector('#assetsForIndLightbox').classList.toggle('open');
    }
    if (type === 'assetsForBiz') {
        document.querySelector('#assetsForBizLightbox').classList.toggle('open');
    }
    if (type === 'assetsForIndBiz') {
        document.querySelector('#assetsForIndBizLightbox').classList.toggle('open');
    }
    if (type === 'responses'){
        document.querySelector('#responses').classList.toggle('open');
    }
}

function progressIcons(currentStepIcons)
{
    numberingIcons = document.getElementsByClassName("numbering");

    var spanToAdd;
    spanToAdd = document.createElement("span");
    spanToAdd.classList.add("material-icons");
    spanToAdd.classList.add("completeNumbering");
    spanToAdd.innerText = "check";

    for(i = 0; i < stepIcons.length; i++)
    {
        if(i == 0)
        {
            numberingIcons[i].innerText ='i';
        }
        else
        {
            numberingIcons[i].innerText = i;
        }
    }

    for(i = 0; i < currentStepIcons; i++)
    {
        numberingIcons[i].innerHTML = spanToAdd.outerHTML;
    }

}

function validateStep(step) {
    let isValid = true;

    if (step.id !== 'step-byb') {
        //console.log(step.id + '-form');
        const stepForm = document.getElementById(step.id + '-form');
        //console.log("stepform:" ,stepForm);
        const requiredFields = stepForm.querySelectorAll('[required]');


        requiredFields.forEach(field => {

            if (field.nodeName === 'FIELDSET') {

                if (field.dataset.fieldsettype === 'radio') {
                    var checked = field.querySelector('input[type="radio"]:checked');
                    if (checked == null) {
                        isValid = false;
                    }
                } else if (field.dataset.fieldsettype === 'checkbox') {


                    var topLevelChecked = field.querySelectorAll('input[type="checkbox"]:checked');
                    if (topLevelChecked.length == 0) {
                        isValid = false;
                    } else {
                        let subCheckboxValidity = true;
                        topLevelChecked.forEach(checkbox => {
                            let subCheckList = checkbox.parentElement.nextElementSibling;
                            //how many top level are checked
                            //if at least one top level has a subfield-wrapper with no elements checked, cannot proceed

                            if (subCheckList && subCheckList.classList.contains('subfield-wrapper')) {
                                let subCheckboxes = subCheckList.querySelectorAll('input[type="checkbox"]');
                                let subTextInput = subCheckList.querySelector('input[type="text"], input[type="textarea"]');

                                if (subCheckboxes.length > 0) {
                                    let checkedCheckboxes = subCheckList.querySelectorAll('input[type="checkbox"]:checked');
                                    if (checkedCheckboxes.length == 0) {
                                        subCheckboxValidity = false;
                                    }
                                } else if (subTextInput && subTextInput.value === '') {
                                    subCheckboxValidity = false;
                                }

                            }

                        });
                        if (!subCheckboxValidity) {
                            isValid = false;
                        }
                    }
                }
            } else if (field.nodeName === 'TEXTAREA') {
                if (field.value === '') {
                    isValid = false;
                }
            } else if (field.nodeName === 'TABLE') {
                if (field == penIntEntryTable) {
                    if (penIntTableData.penalties.length == 0 && penIntTableData.interests.length == 0) {
                        isValid = false;
                    }
                } else {
                    var providingDocs = document.querySelector('input[name="provideDocs"]:checked');

                    if (providingDocs) {
                        if (providingDocs.value == 'Yes') {

                            if (supportingDocTableData.documents.length == 0) {
                                isValid = false;
                            }
                        }
                    }




                }
            }

        });
    }
    return isValid;
}

// function penaltyOrInterest(penOrInt)
// {
//     if(penOrInt == "penalty")
//     {
//         if(penalty == true)
//         {
//             document.querySelector('#step1-penalty-question').classList.remove("hidden");
//             document.querySelector('#step1-penalty-question').setAttribute("required",true);
//             penalty = false;
//         }
//         else
//         {
//             document.querySelector('#step1-penalty-question').classList.add("hidden");
//             document.querySelector('#step1-penalty-question').removeAttribute("required");
//             penalty = true;
//         }
//     }

//     if(penOrInt == "interest")
//         {
//             if(interest == true)
//             {
//                 document.querySelector('#step1-interest-question').classList.remove("hidden");
//                 document.querySelector('#step1-interest-question').setAttribute("required",true);
//                 interest = false;
//             }
//             else
//             {
//                 document.querySelector('#step1-interest-question').classList.add("hidden");
//                 document.querySelector('#step1-interest-question').removeAttribute("required");
//                 interest = true;
//             }
//         } 
// }

// Hides the Misdirect Panels (information panels for when the user isn't requesting relief of a penalty/interest) 
// function hideMisdirectPanels(panelToShow)
// {
//     var elements = document.getElementsByClassName("misdirectPanels");
//     var elementToShow = document.getElementById(panelToShow);
    
//     for(var i = 0; i < elements.length; i++)
//     {
//         elements[i].classList.add("hidden");
//     }

//     elementToShow.classList.remove("hidden");
// }



// Determines whether each subcheckbox from the Financial Hardship, Serious Illness, and Natural Disaster groups have been checked off
// function summarySupportingDocumentation(document, optionNum)
// {
//     if(document == "financial")
//     {
//         if(financialSupDoc[optionNum] == false)
//         {
//             financialSupDoc.splice(optionNum, 1, true);
//         }
//         else
//         {
//             financialSupDoc.splice(optionNum, 1, false);
//         }
//     }
    
//     if(document == "accident")
//     {
//         if(accidentSupDoc[optionNum] == false)
//         {
//             accidentSupDoc.splice(optionNum, 1, true);
//         }
//         else
//         {
//             accidentSupDoc.splice(optionNum, 1, false);
//         }
//     }
    
//     if(document == "disaster")
//     {
//         if(disasterSupDoc[optionNum] == false)
//         {
//             disasterSupDoc.splice(optionNum, 1, true);
//         }
//         else
//         {
//             disasterSupDoc.splice(optionNum, 1, false);
//         }
//     }
    
//     //console.log(document,' ',optionNum,': ', financialSupDoc[optionNum]);
// }

function handleRadioSelection(group, selectedRadio) {
    // Hide content related to all radio buttons in the group
    
    const radios = group.querySelectorAll('input[type="radio"]');
    if(selectedRadio.dataset.everchecked == 'false'){
        selectedRadio.dataset.everchecked = 'true';
    }


    radios.forEach(radio => {
       
        const targets = radio.dataset.target ? radio.dataset.target.split(',') : [];
        targets.forEach(targetId => {
        
            const relatedContent = document.getElementById(targetId.trim());
        
            if (relatedContent) {
                
                if(selectedRadio.dataset.everchecked == undefined || selectedRadio.dataset.everchecked == 'false'){
                  
                    relatedContent.classList.add('hidden');
                    clearContent(relatedContent);
                    clearDependentQuestions(relatedContent);
                }
                
        }
        });
        
    });

    const selectedTargets = selectedRadio.dataset.target ? selectedRadio.dataset.target.split(',') : [];
    selectedTargets.forEach(targetId => {
    // Show content related to the selected radio button
    const targetContent = document.getElementById(targetId.trim());
    if (targetContent) {
        
      
        targetContent.classList.remove('hidden');
    }
});
    outCheck();
}


function handleCheckboxToggle(checkbox) {
    const targets = checkbox.dataset.target ? checkbox.dataset.target.split(',') : [];
    targets.forEach(targetId => {
        const relatedContent = document.getElementById(targetId.trim());

        // Clear other checkboxes in the same group (based on whether this checkbox is exclusive or not)
        clearOtherCheckboxes(checkbox);
     
         if (checkbox.checked) {
             // Show related content
             if (relatedContent) {
                 relatedContent.classList.remove('hidden');
             }
         } 
         else {
                if (relatedContent) {

                    if (checkbox.id === "financial-individual" || checkbox.id === "financial-business") {
                        const individualCheckbox = document.getElementById("financial-individual");
                        const businessCheckbox = document.getElementById("financial-business");
                        const outstandingTaxField = document.getElementById("outstanding-tax-returns");
                        
                        // If either checkbox is checked, show the outstanding tax returns question
                        if (individualCheckbox.checked || businessCheckbox.checked) {
                          
                            console.log("there should be nothing happening")
                          
                        } else {
                 
                            relatedContent.classList.add('hidden');
                            clearContent(relatedContent);
                            // Recursively clear any dependent questions
                            clearDependentQuestions(relatedContent);
                        }   
                    }
                    else {
                        relatedContent.classList.add('hidden');
                        clearContent(relatedContent);
                        // Recursively clear any dependent questions
                        clearDependentQuestions(relatedContent);
                    }
                   
             }
         
        }

    });

    outCheck();
}



function clearOtherCheckboxes(currentCheckbox) {
    const group = currentCheckbox.dataset.group; // Get the group the current checkbox belongs to
    const isExclusive = currentCheckbox.dataset.exclusive === 'true';

    
    const checkboxes = document.querySelectorAll(`input[type="checkbox"][data-group="${group}"]`);
    
    checkboxes.forEach(checkbox => {
        if (checkbox !== currentCheckbox) {
         
            // For exclusive checkboxes, clear all others
            if (isExclusive || checkbox.dataset.exclusive === 'true') {
               
                checkbox.checked = false;
                const relatedContent = document.getElementById(checkbox.dataset.target);
                if (relatedContent) {
                    relatedContent.classList.add('hidden');
                    clearContent(relatedContent); // Clear content of unchecked checkboxes
                    clearDependentQuestions(relatedContent); // Recursively clear dependencies
                }
            }
          
        }
    });
}


// Clear all input fields (checkboxes, radio buttons, text) in the given element
function clearContent(element) {
    const inputs = element.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = false;
            
        } else if(input.type === 'range') {
          
            if(input.id == 'penminslider'){
                
                input.value = 90;
                minVal = 2014; 
                setSliderValue(input,'penalty');
                displayPenAlert();

            }
            else if(input.id == 'penmaxslider') {
                input.value = 100;
                maxVal = 2024; 
                setSliderValue(input,'penalty');
                displayPenAlert();
            }
            else if(input.id == 'intminslider') {
                input.value = 90;
                minVal = 2014; 
                setSliderValue(input,'interest');
                displayIntAlert();
            }
            else if(input.id == 'intmaxslider') {
                input.value = 100;
                maxVal = 2024; 
                setSliderValue(input,'interest');
                displayIntAlert();
            }
        }
        else {
            input.value = '';
        }
    });
}

// Recursively clear dependent questions
function clearDependentQuestions(element) {
    const childCheckboxes = element.querySelectorAll('input[type="checkbox"], input[type="radio"], input[type="range"]');
    
    // Iterate through child checkboxes and hide their corresponding targets
    childCheckboxes.forEach(childCheckbox => {
        
        const targets = childCheckbox.dataset.target ? childCheckbox.dataset.target.split(',') : [];
        targets.forEach(targetId => {
            const childContent = document.getElementById(targetId.trim());
            if (childContent) {
                childContent.classList.add('hidden');
                clearContent(childContent); // Clear the content of the child
                clearDependentQuestions(childContent); // Recursively hide all dependencies
            }
        });
        
    });
}

function checkBizType(){
    var finHardshipTypes = document.querySelectorAll('#current-financial-situation input[type=checkbox]:checked');
    
    if(finHardshipTypes[0] !== undefined){
      
        if(finHardshipTypes.length < 2){
            if(finHardshipTypes[0].id == 'financial-individual'){
                document.getElementById('available-investments-ind').classList.remove('hidden');
                document.getElementById('available-investments-biz').classList.add('hidden');
                document.getElementById('available-investments-indbiz').classList.add('hidden');
            }
            else {
                document.getElementById('available-investments-ind').classList.add('hidden');
                document.getElementById('available-investments-biz').classList.remove('hidden');
                document.getElementById('available-investments-indbiz').classList.add('hidden');
            }
        }
        else {
            document.getElementById('available-investments-ind').classList.add('hidden');
            document.getElementById('available-investments-biz').classList.add('hidden');
            document.getElementById('available-investments-indbiz').classList.remove('hidden');
        }
    }
}

function errorCheck(){
    var reasons = document.querySelectorAll('#step2-question2-fieldset input[type=checkbox]:checked');
    var reasonSelected;
    //0 multiple, 1 beyond control only, 2 fin hardship only, 3 other

    if(reasons[0] !== undefined){
        if(reasons.length == 1){
            if(reasons[0].id == 'step2-question2-beyondcontrol'){
                reasonSelected = 1;
            }
            
            else if(reasons[0].id == 'step2-question2-financialsituation'){
                reasonSelected = 2;
            }
            else {
                reasonSelected = 3;
            }
        }
        else {
            reasonSelected = 0;
        }     
    }

    if(reasonSelected == 0){
        document.getElementById('available-investments-red').classList.add('hidden');
        document.getElementById('available-investments-blue').classList.remove('hidden');
        document.getElementById('didntknow-red').classList.add('hidden');
        document.getElementById('didntknow-blue').classList.remove('hidden');
        document.getElementById('financial-other-red').classList.add('hidden');
        document.getElementById('financial-other-blue').classList.remove('hidden');
        document.getElementById('supdocPanel2-red').classList.add('hidden');
        document.getElementById('supdocPanel2-blue').classList.remove('hidden');
    }
    else if(reasonSelected == 1){
        document.getElementById('didntknow-red').classList.remove('hidden');
        document.getElementById('didntknow-blue').classList.add('hidden');
    
    }
    else if(reasonSelected == 2) {
        document.getElementById('available-investments-red').classList.remove('hidden');
        document.getElementById('available-investments-blue').classList.add('hidden');
        document.getElementById('financial-other-red').classList.remove('hidden');
        document.getElementById('financial-other-blue').classList.add('hidden');
        document.getElementById('supdocPanel2-red').classList.remove('hidden');
        document.getElementById('supdocPanel2-blue').classList.add('hidden');
    } 
}

function documentsCheck() {
  
    var reasons = document.querySelectorAll('#reasonsFieldset input[type="checkbox"]:checked, #current-financial-situation input[type="checkbox"]:checked');


    const tableEntries = {
        'financial-individual': 'financialIndividual',
        'financial-business': 'financialBusiness',
        'natural-disaster-checkbox': 'nd1',
        'fire-flood-checkbox': 'nd2',    
        'serious-illness-checkbox': 'si1',
        'mental-distress-checkbox': 'si2',
        'death-significant-checkbox': 'si3',
        'death-representing-checkbox': 'si4',
        'civil-disturbance-checkbox': 'civ1',
        'cra-delay-checkbox': 'cd1',
        'cra-error-checkbox': 'ce1',
        'extraordinary-circumstances-checkbox': 'oc1'
    };
    // Hide all rows initially
    for (const rowId in tableEntries) {
        document.getElementById(tableEntries[rowId]).style.display = 'none';
    }

    // Show only the rows that correspond to the checked checkboxes
    reasons.forEach(function(checkbox) {
        const tableRowId = tableEntries[checkbox.id];
        if (tableRowId) {
            
            document.getElementById(tableRowId).style.display = 'table-row';
        }
    });
}

function outCheck(){
    var shouldRedirect = false;
  
    const selections = {
        misdirect: document.querySelectorAll('#misdirect-fieldset input[type=radio]:checked'),
        unsureIfPenInt: document.querySelector('#step1-question1-unsure').checked,
        reliefReason_extraordinaryCircumstances: document.querySelector('#step2-question2-beyondcontrol').checked,
        reliefReason_financialSituation: document.querySelector('#step2-question2-financialsituation').checked,
        reliefReason_incorrectCharge: document.querySelector('#step2-question2-ontime').checked,
        reliefReason_none: document.querySelector('#step2-question2-none').checked,
        reliefSpecReason_didNotKnow: document.querySelector('#step2-othercirc-didnotknow').checked,
        hasInvestments: document.querySelector('#available-investments-yes').checked,
        finHardshipOther: document.querySelector('#financial-other').checked,
        noDocs: document.querySelector('#step3-no').checked
        
    };

    const conditions = {
        notHereForPenInt: selections.misdirect.length != 0 || selections.unsureIfPenInt,
        penIntYearPre2014: penRedAlertShowing || intRedAlertShowing,
        reasonForRequest: selections.reliefReason_incorrectCharge || selections.reliefReason_none || (selections.  reliefSpecReason_didNotKnow && selections.reliefReason_extraordinaryCircumstances && !selections.reliefReason_financialSituation),
        financialSituationNotSevere: selections.finHardshipOther && selections.reliefReason_financialSituation && !selections.reliefReason_extraordinaryCircumstances,
        finHardshipOnlyHasInvestments: selections.hasInvestments && selections.reliefReason_financialSituation && !selections.reliefReason_extraordinaryCircumstances,
        noDocsFinHardship: selections.reliefReason_financialSituation && !selections.reliefReason_extraordinaryCircumstances && selections.noDocs
    
    };
    

    shouldRedirect = conditions.notHereForPenInt || conditions.reasonForRequest || conditions.finHardshipOnlyHasInvestments || conditions.financialSituationNotSevere || conditions.penIntYearPre2014 || conditions.noDocsFinHardship;
   

    var nextBtn = active.querySelector(".next-btn");
    var misdirectBtn = active.querySelector(".misdirect-btn");
    if(nextBtn !== null && misdirectBtn !== null){
        if(shouldRedirect){
            nextBtn.classList.add('hidden');
            misdirectBtn.classList.remove('hidden');
        
        }
        else {
            nextBtn.classList.remove('hidden');
            misdirectBtn.classList.add('hidden');
        }
    }
   

    errorCheck();
}

//Accordion functionality
const accordions = document.querySelectorAll('.accordion');
accordions.forEach(accordion => {
    accordion.addEventListener('click', function() {
        this.classList.toggle('active');
        const panel = this.nextElementSibling;

        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + 'px';
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
  

    //Add asterisks to required fields
    const requiredInputs = document.querySelectorAll('.required-label');
    requiredInputs.forEach(input => {
        if (input) {
            const asterisk = document.createElement('span');
            asterisk.textContent = '* ';
            asterisk.classList.add('label-ast');

            input.insertBefore(asterisk, input.firstChild);
        }
    });
    // document.querySelectorAll('input').forEach(input => {
    //     input.addEventListener('change', outCheck);
    // });
   


  // Function to show/hide based on radio buttons
  const radioGroups = document.querySelectorAll('[data-radio-group]');
  radioGroups.forEach(group => {
      const radios = group.querySelectorAll('input[type="radio"]');
      radios.forEach(radio => {
          radio.addEventListener('change', function () {
              handleRadioSelection(group, radio);
          });
      });
  });

  // Function to show/hide based on checkboxes
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function () {
          handleCheckboxToggle(checkbox);
      });
  });
});

var minVal, maxVal;

var penRedAlertShowing = false;
var penBlueAlertShowing = false;
var intRedAlertShowing = false;
var intBlueAlertShowing = false;

function setSliderValue(el, chargeType) {
    
    var sliderContainer = el.parentElement;
    var minSlider, maxSlider;
    
    var fillLeft = sliderContainer.querySelector("#fill-left");
    var fillRight = sliderContainer.querySelector("#fill-right");
    var range = sliderContainer.querySelector("#range");
    var handleLeft = sliderContainer.querySelector("#handle-left");
    var handleRight = sliderContainer.querySelector("#handle-right");
    var signLeft = sliderContainer.querySelector("#sign-left");
    var signRight = sliderContainer.querySelector("#sign-right");

    switch(chargeType){
        
        case "penalty":
            
            minSlider = document.getElementById("penminslider");
            maxSlider = document.getElementById("penmaxslider");
            
            break;
        case 'interest':
            minSlider = document.getElementById("intminslider");
            maxSlider = document.getElementById("intmaxslider");
            
            break;
    }
    if (el == minSlider){
        el.value = Math.min(el.value, maxSlider.value);
        var value =
        (100 / (parseInt(el.max) - parseInt(el.min))) * parseInt(el.value) -
        (100 / (parseInt(el.max) - parseInt(el.min))) * parseInt(el.min);
    
        fillLeft.style.width = value + "%";
        range.style.left = value + "%";
        handleLeft.style.left = value + "%";
        signLeft.style.left = value + "%";
        minVal = 1924 + parseInt(el.value);
        signLeft.childNodes[1].innerHTML = minVal;
    }
    else {
        el.value = Math.max(el.value, minSlider.value);
        var value =
            (100 / (parseInt(el.max) - parseInt(el.min))) * parseInt(el.value) -
            (100 / (parseInt(el.max) - parseInt(el.min))) * parseInt(el.min);
        
        fillRight.style.width = 100 - value + "%";
        range.style.right = 100 - value + "%";
        handleRight.style.left = value + "%";
        signRight.style.left = value + "%";
        maxVal = 1924 + parseInt(el.value);
        signRight.childNodes[1].innerHTML = maxVal;
    }
}
function displayPenAlert(){
    var penaltyAlertBlue = document.getElementById("penaltyPanel-blue");
    var penaltyAlertRed = document.getElementById("penaltyPanel-red");
  
    if(minVal < 2014 && maxVal < 2014){
        penaltyAlertRed.classList.remove('hidden');
        penaltyAlertBlue.classList.add('hidden');
        penRedAlertShowing = true;
        penBlueAlertShowing = false;
        console.log(penRedAlertShowing)
      }
    else if(minVal < 2014 && maxVal >= 2014){
        penaltyAlertRed.classList.add('hidden');
        penaltyAlertBlue.classList.remove('hidden');
        penRedAlertShowing = false;
        penBlueAlertShowing = true;
    }
      else {
        penaltyAlertRed.classList.add('hidden');
        penaltyAlertBlue.classList.add('hidden');
        penRedAlertShowing = false;
        penBlueAlertShowing = false;
    }
    outCheck();
}

function displayIntAlert(){
    var interestAlertBlue = document.getElementById("interestPanel-blue");
    var interestAlertRed = document.getElementById("interestPanel-red");

    if(minVal < 2014 && maxVal < 2014){
        interestAlertRed.classList.remove('hidden');
        interestAlertBlue.classList.add('hidden');
        intRedAlertShowing = true;
        intBlueAlertShowing = false;
      }
    else if(minVal < 2014 && maxVal >= 2014){
        interestAlertRed.classList.add('hidden');
        interestAlertBlue.classList.remove('hidden');
        intRedAlertShowing = false;
        intBlueAlertShowing = true;
    }
    else {
        interestAlertRed.classList.add('hidden');
        interestAlertBlue.classList.add('hidden');
        intRedAlertShowing = false;
        intBlueAlertShowing = false;
    }
    outCheck();
}