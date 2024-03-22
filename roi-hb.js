////////////////////////////////////////
// 🏁 Initialize Code
////////////////////////////////////////
function initCalc() {
    console.log('ROI')
    // Initialize the debug mode flag
    window['debug'] = false // Set to false to disable logging

    // Debug log function
    function DebugLog(message) {
        if (window['debug']) {
            console.log('MB Debug:', message)
        }
    }

    ////////////////////////////////////////
    // 🎁 Variables
    ////////////////////////////////////////
    const CALC_ATTRIBUTE = 'mb-calc-element'
    const VALUE_ATTRIBUTE = 'mb-calc-value'
    const FS_ACTIVE_CLASS_ATTRIBUTE = 'fs-inputactive-class'
    const FS_ACTIVE_CLASS_SELECTOR = '[fs-inputactive-class]'

    const calcForm = document.querySelector(`[${CALC_ATTRIBUTE}="form"]`)

    const value = {
        totalSavings: 0,
        industryText: '',
        industrySavings: 0,
        industryMutliplier: 0,
    }

    ////////////////////////////////////////
    // 📦 Elements & Variables
    ////////////////////////////////////////
    const sliderComponents = Array.from(
        calcForm.querySelectorAll(`[${CALC_ATTRIBUTE}^="slider"]`)
    )
    const radioButtons = Array.from(
        calcForm.querySelectorAll(`[${CALC_ATTRIBUTE}^="radio"]`)
    )
    const checkboxButtons = Array.from(
        calcForm.querySelectorAll(`[${CALC_ATTRIBUTE}^="checkbox"]`)
    )
    const sliderGroups = groupElements(sliderComponents)
    const radioGroups = groupElements(radioButtons)
    const checkboxGroups = groupElements(checkboxButtons)

    const textFields = Array.from(
        calcForm.querySelectorAll(`[${CALC_ATTRIBUTE}^="text"]`)
    )
    textFields.forEach((textField) => {
        const attributeValue = textField.getAttribute(CALC_ATTRIBUTE)
        const inputName = attributeValue.substring(
            attributeValue.indexOf('_') + 1
        )
        value[`${inputName}`] = textField.value
    })
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    textFields.forEach((textField) => {
        textField.addEventListener('change', function (event) {
            const attributeValue = event.target.getAttribute(CALC_ATTRIBUTE)
            const inputName = attributeValue.substring(
                attributeValue.indexOf('_') + 1
            )

            const hbInputField = `input${capitalizeFirstLetter(inputName)}`
            value[`${inputName}`] = textField.value
            hbInputField.value = textField.value
            // event.target.value = updatedValue
            calculateTotal()
        })
    })

    /**
     * Elements to display calculations
     */
    const industrySavingsElement = document.querySelector(
        `[${CALC_ATTRIBUTE}="display_industrySavings"]`
    )
    const industrySavingsSpan = industrySavingsElement.querySelector('span')
    value.industryMutliplier = parseFloat(
        industrySavingsElement.getAttribute(VALUE_ATTRIBUTE)
    )
    const industrySavingsMinSpan = document.querySelector(
        `[${CALC_ATTRIBUTE}="display_industrySavingsMinSpan"]`
    )
    const industrySavingsMaxSpan = document.querySelector(
        `[${CALC_ATTRIBUTE}="display_industrySavingsMaxSpan"]`
    )

    const employeeSpan = document.querySelector(
        `[${CALC_ATTRIBUTE}="display_employeeSpan"]`
    )
    const industrySpan = document.querySelector(
        `[${CALC_ATTRIBUTE}="display_industrySpan"]`
    )

    const totalSavingsElement = document.querySelector(
        `[${CALC_ATTRIBUTE}="display_totalSavings"]`
    )
    const totalSavingsSpan = totalSavingsElement.querySelector('span')
    value.totalSavingsMin = parseFloat(
        totalSavingsElement.getAttribute('mb-calc-min')
    )
    value.totalSavingsMax = parseFloat(
        totalSavingsElement.getAttribute('mb-calc-max')
    )

    /**
     * Hubspot Form
     */
    const HB_ATTRIBUTE = 'mb-hubspot-element'
    const hbForm = document.querySelector(`[${HB_ATTRIBUTE}="form"]`)
    const inputIndustryName = hbForm.querySelector(
        `[${HB_ATTRIBUTE}="input_industryName"]`
    )
    const inputIndustryCost = hbForm.querySelector(
        `[${HB_ATTRIBUTE}="input_industryCost"]`
    )
    const inputIndustryMin = hbForm.querySelector(
        `[${HB_ATTRIBUTE}="input_industryMin"]`
    )
    const inputIndustryMax = hbForm.querySelector(
        `[${HB_ATTRIBUTE}="input_industryMax"]`
    )
    const inputEmail = hbForm.querySelector(`[${HB_ATTRIBUTE}="input_email"]`)
    const inputFirstName = hbForm.querySelector(
        `[${HB_ATTRIBUTE}="input_firstName"]`
    )
    const inputLastName = hbForm.querySelector(
        `[${HB_ATTRIBUTE}="input_lastName"]`
    )
    const inputEmployees = hbForm.querySelector(
        `[${HB_ATTRIBUTE}="input_employees"]`
    )
    const inputRecords = hbForm.querySelector(
        `[${HB_ATTRIBUTE}="input_records"]`
    )
    const inputCostMetomic = hbForm.querySelector(
        `[${HB_ATTRIBUTE}="input_costMetomic"]`
    )
    const inputCostBreach = hbForm.querySelector(
        `[${HB_ATTRIBUTE}="input_costBreach"]`
    )
    const inputTotalSavings = hbForm.querySelector(
        `[${HB_ATTRIBUTE}="input_totalSavings"]`
    )

    ////////////////////////////////////////
    // ✅ Form Step Validation
    ////////////////////////////////////////
    /**
     * Form Step Validation
     */
    const validateSteps = Array.from(
        calcForm.querySelectorAll('[mb-validate-step]')
    )
    const MB_VALIDATE_INPUTS_SELECTOR = '[mb-validate-input]'
    const MB_DISABLED_CLASS_ATTRIBUTE = 'mb-disabled-class'
    const MB_DISABLED_CLASS_SELECTOR = '[mb-disabled-class]'
    const MB_BUTTON_NEXT_ATTRIBUTE = 'swiper-button-next'
    const MB_BUTTON_NEXT_SELECTOR = '[swiper-button-next]'

    /**
     * Step 1
     */
    function validateStep1(array) {
        const slideStep = array[0]
        const buttonNext = slideStep.querySelector(MB_BUTTON_NEXT_SELECTOR)
        const classDisable = buttonNext.getAttribute(
            MB_DISABLED_CLASS_ATTRIBUTE
        )
        value.industryText
            ? buttonNext.classList.remove(classDisable)
            : buttonNext.classList.add(classDisable)
    }

    /**
     * Step 2
     */
    // Define regex patterns for different types of inputs
    const patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        name: /^[a-zA-Z\s]+$/,
        number: /^\d+$/,
    }

    // Debounce to save frames
    function debounce(func, wait) {
        let timeout
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout)
                func(...args)
            }
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
        }
    }

    // Wrap your validation check in a debounced function to prevent excessive calls
    const debouncedCheckAllInputsValid = debounce(function (
        inputs,
        buttonNext,
        classDisable
    ) {
        checkAllInputsValid(inputs, buttonNext, classDisable)
    },
    500) // Adjust the delay as needed

    const inputInteractionStates = new Map() // Key: input identifier, Value: boolean

    function markInputAsInteracted(input) {
        const inputId = input.id || input.getAttribute('name') // Ensure a unique identifier
        inputInteractionStates.set(inputId, true)
    }
    function checkIfInputInteracted(input) {
        const inputId = input.id || input.getAttribute('name')
        return inputInteractionStates.get(inputId) || false
    }

    // Update validateInput to include userInteracted parameter
    function validateInput(input, userInteracted) {
        const type = input.getAttribute('mb-validate-input')
        const pattern = patterns[type]

        // Apply validation feedback only if the user has interacted with the input
        if (userInteracted) {
            if (pattern && !pattern.test(input.value.trim())) {
                input.classList.add('is-invalid')
                return false
            } else {
                input.classList.remove('is-invalid')
                return true
            }
        }
        return true // Assume valid if not interacted
    }

    function validateStep2(array) {
        const slideStep = array[1]
        const buttonNext = slideStep.querySelector(MB_BUTTON_NEXT_SELECTOR)
        const classDisable = buttonNext.getAttribute(
            MB_DISABLED_CLASS_ATTRIBUTE
        )
        buttonNext.classList.add(classDisable) // Initially disable the Next button

        const inputsToValidate = slideStep.querySelectorAll(
            MB_VALIDATE_INPUTS_SELECTOR
        )

        setTimeout(() => {
            inputsToValidate.forEach((input) => {
                if (input.getAttribute('mb-validate-input') === 'number') {
                    input.dataset.originalValue = input.value // Assume external function has completed
                }

                ;['input', 'blur'].forEach((eventType) => {
                    input.addEventListener(eventType, function () {
                        if (
                            input.getAttribute('mb-validate-input') === 'number'
                        ) {
                            if (input.value !== input.dataset.originalValue) {
                                markInputAsInteracted(input)
                            }
                        } else {
                            markInputAsInteracted(input)
                        }
                        // Use debounced validation check to improve performance
                        debouncedCheckAllInputsValid(
                            inputsToValidate,
                            buttonNext,
                            classDisable
                        )
                    })
                })
            })
        }, 1000) // Adjust delay as needed for external initialization

        // Perform an initial validation check
        checkAllInputsValid(inputsToValidate, buttonNext, classDisable)
    }

    function checkAllInputsValid(inputs, buttonNext, classDisable) {
        let inputsStatus = Array.from(inputs).map((input) => {
            const interacted = checkIfInputInteracted(input)
            const validated = validateInput(input, interacted)

            return {
                id: input.id || input.getAttribute('name'),
                interacted,
                validated,
            }
        })

        if (window['debug']) {
            console.table(inputsStatus)
        }

        let allInteracted = inputsStatus.every((status) => status.interacted)
        let allValid = inputsStatus.every((status) => status.validated)

        if (allInteracted && allValid) {
            buttonNext.classList.remove(classDisable)
        } else {
            buttonNext.classList.add(classDisable)
        }
    }

    function validateStepAll() {
        validateStep1(validateSteps)
        validateStep2(validateSteps)
    }

    ////////////////////////////////////////
    // 🤖 Functions & Listeners
    ////////////////////////////////////////
    /**
     * Do not submit Calculator Form
     */
    function handleFormSubmit(event) {
        event.preventDefault()
        DebugLog('Form submission prevented')
    }
    calcForm.addEventListener('submit', handleFormSubmit)

    /**
     * Assign Radio's value with its text content
     */
    radioButtons.forEach((radioButton) => {
        const input = radioButton.querySelector('input')
        const text = radioButton.querySelector(
            '.calc-slider_radio-label'
        ).textContent

        // Use the text as the input's value in the value attribute
        input.setAttribute('value', text)
    })

    /**
     * Make Radio Button easier to click
     */
    radioButtons.forEach((radioButton) => {
        const radioInput = radioButton.querySelector('.w-form-formradioinput')

        radioInput.addEventListener('mousedown', function (e) {
            radioInput.click()
            // DebugLog('Radio click', radioInput)
        })
    })

    /**
     * Grouping and Observers
     */
    function groupElements(elements) {
        const groups = {}
        elements.forEach((element) => {
            const attributeValue = element.getAttribute(CALC_ATTRIBUTE)
            const groupName = attributeValue.substring(
                attributeValue.indexOf('_') + 1
            )
            if (!groups[groupName]) {
                groups[groupName] = []
            }
            groups[groupName].push(element)
        })
        return groups
    }

    function sliderListeners(sliderComponents) {
        sliderComponents.forEach((component) => {
            const input = component.querySelector(
                `[${CALC_ATTRIBUTE}^="input"]`
            )

            input.addEventListener('change', () => {
                calculateTotal()
            })
        })
    }

    function calculateSliders(groupObject) {
        Object.keys(groupObject).forEach((key) => {
            const inputElement = groupObject[key][0].querySelector(
                `[${CALC_ATTRIBUTE}^="input"]`
            )
            const hasBaseValue =
                groupObject[key][0].querySelector('[mb-calc-value]') !== null

            if (hasBaseValue) {
                const inputCount = parseFloat(inputElement.value)
                value[`${key.toLowerCase()}Count`] = inputCount
                const inputValueMultiplier = parseFloat(
                    inputElement.getAttribute(VALUE_ATTRIBUTE)
                )
                const inputValue = inputCount * inputValueMultiplier
                value[`${key.toLowerCase()}Value`] = inputValue
            } else {
                const inputValue = parseFloat(inputElement.value)
                value[`${key.toLowerCase()}Value`] = inputValue
            }
        })
    }

    // Mutation Observer
    function createMutationObserver(element, callback) {
        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (
                    mutation.type === 'attributes' &&
                    mutation.attributeName === 'class'
                ) {
                    const groupName = element.getAttribute(CALC_ATTRIBUTE)
                    const isActive = element.classList.contains(
                        getFsActiveClass([element])
                    )
                    // Check if this element has the active class
                    if (isActive && groupName === 'radio_industry') {
                        value.industryText = element.querySelector(
                            '.calc-slider_radio-label'
                        ).textContent
                        DebugLog(
                            'Active Radio Button Text:',
                            value.industryText
                        )
                        value.industrySavingsMin =
                            element.getAttribute('mb-calc-min')
                        value.industrySavingsMax =
                            element.getAttribute('mb-calc-max')
                    }
                    callback() // Continue with the original callback function
                    break
                }
            }
        })
        observer.observe(element, { attributes: true })
    }

    function observeMutations(elements) {
        elements.forEach((element) => {
            createMutationObserver(element, calculateTotal)
        })
    }

    // Assigning selected values
    function getFsActiveClass(array) {
        return array[0]
            .querySelector(FS_ACTIVE_CLASS_SELECTOR)
            .getAttribute(FS_ACTIVE_CLASS_ATTRIBUTE)
    }

    function radioSelector(array) {
        return array.find((item) =>
            item.classList.contains(getFsActiveClass(array))
        )
    }

    function checkboxSelector(array) {
        return array.filter((item) =>
            item.classList.contains(getFsActiveClass(array))
        )
    }

    function radioAggregator(selected) {
        return selected ? parseFloat(selected.getAttribute(VALUE_ATTRIBUTE)) : 0
    }

    function checkboxAggregator(selectedArray) {
        return selectedArray
            ? selectedArray.reduce(
                  (sum, element) =>
                      sum + parseFloat(element.getAttribute(VALUE_ATTRIBUTE)),
                  0
              )
            : 0
    }

    function calculateGroups(groupObject, selectorFn, aggregatorFn) {
        Object.keys(groupObject).forEach((key) => {
            const selectedElements = selectorFn(groupObject[key])
            value[`${key.toLowerCase()}Value`] = aggregatorFn(selectedElements)
        })
    }

    /**
     * Display updates
     */
    function updateDisplay(element, value) {
        if (element && !isNaN(value)) {
            element.textContent = Math.round(value).toLocaleString('en-US')
        } else {
            element.textContent = value
        }
    }
    function updateInput(element, value, formatAsCurrency = true) {
        if (element && !isNaN(value)) {
            let formattedValue = Math.round(value).toLocaleString('en-US')
            element.value = formatAsCurrency
                ? `$${formattedValue}`
                : formattedValue
        } else {
            // Directly assign the value if conditions aren't met
            element.value = value
        }
    }

    function updateDisplayAll() {
        // Update Calculator Texts
        updateDisplay(totalSavingsSpan, value.totalSavings)
        updateDisplay(industrySavingsSpan, value.industrySavings)
        updateDisplay(industrySpan, value.industryText)
        updateDisplay(employeeSpan, value.employeeCount)
        updateDisplay(industrySavingsMinSpan, value.industrySavingsMin)
        updateDisplay(industrySavingsMaxSpan, value.industrySavingsMax)

        // Update Hubspots Inputs
        updateInput(inputIndustryName, value.industryText)
        updateInput(inputIndustryCost, value.industryValue)
        updateInput(inputIndustryMin, value.industrySavingsMin)
        updateInput(inputIndustryMax, value.industrySavingsMax)
        updateInput(inputEmail, value.email, false)
        updateInput(inputFirstName, value.firstName, false)
        updateInput(inputLastName, value.lastName, false)
        updateInput(inputEmployees, value.employeeCount, false)
        updateInput(inputRecords, value.recordValue, false)
        updateInput(inputCostMetomic, value.costMetomic)
        updateInput(inputCostBreach, value.costBreach)
        updateInput(inputTotalSavings, value.totalSavings)
    }

    /**
     * Calculate total
     */
    function calculateTotal() {
        calculateSliders(sliderGroups)
        calculateGroups(radioGroups, radioSelector, radioAggregator)
        calculateGroups(checkboxGroups, checkboxSelector, checkboxAggregator)

        // Total
        value.costMetomic = value.employeeValue
        value.costBreach = value.industryValue * value.recordValue
        value.industrySavings = value.industryValue * value.industryMutliplier
        value.totalSavings = value.costBreach - value.costMetomic
        value.totalSavings = Math.max(
            value.totalSavingsMin,
            Math.min(value.totalSavingsMax, value.totalSavings)
        )

        validateStepAll()
        updateDisplayAll()

        if (window['debug']) {
            console.table(value)
        }
    }

    /**
     * Mirror click submit
     */
    // Identify the target element
    const hubspotSubmitButton = document.querySelector(
        '[mb-hubspot-mirrorsubmit="target"]'
    )

    const clickHubspotSubmitButton = () => {
        console.log('clicked mirror')
        if (hubspotSubmitButton) hubspotSubmitButton.click()
    }

    // Attach the click event to all mirrors
    const mirrors = document.querySelectorAll(
        '[mb-hubspot-mirrorsubmit="mirror"]'
    )
    mirrors.forEach((mirror) => {
        mirror.addEventListener('click', clickHubspotSubmitButton)
    })

    /**
     * Initialize listeners
     */
    sliderListeners(sliderComponents)
    observeMutations(radioButtons)
    observeMutations(checkboxButtons)

    calculateTotal()
}

window.addEventListener('DOMContentLoaded', function () {
    initCalc()
})
