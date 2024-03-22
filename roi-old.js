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

    // Displays
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
    function validateInput(input, buttonNext, classDisable, userInteracted) {
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
        inputsToValidate.forEach((input) => {
            // Handle original value storage for number inputs
            if (input.getAttribute('mb-validate-input') === 'number') {
                input.dataset.originalValue = input.value
            }

            ;['input', 'blur'].forEach((eventType) => {
                input.addEventListener(eventType, function () {
                    if (input.getAttribute('mb-validate-input') === 'number') {
                        // Mark as interacted only if value changes for number inputs
                        if (input.value !== input.dataset.originalValue) {
                            markInputAsInteracted(input)
                        }
                    } else {
                        markInputAsInteracted(input)
                    }

                    // Trigger validation
                    checkAllInputsValid(
                        inputsToValidate,
                        buttonNext,
                        classDisable
                    )
                })
            })
        })

        // Initial validation state check
        checkAllInputsValid(inputsToValidate, buttonNext, classDisable)
    }

    function checkAllInputsValid(inputs, buttonNext, classDisable) {
        let inputsStatus = Array.from(inputs).map((input) => {
            const interacted = checkIfInputInteracted(input)
            const validated = validateInput(
                input,
                buttonNext,
                classDisable,
                interacted
            )

            return {
                id: input.id || input.getAttribute('name'),
                interacted,
                validated,
            }
        })

        console.table(inputsStatus)

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
     * Make Radio Button easier to click
     */
    radioButtons.forEach((radioButton) => {
        const radioInput = radioButton.querySelector('.w-form-formradioinput')

        radioInput.addEventListener('mousedown', function (e) {
            radioInput.click()
            DebugLog('Radio click', radioInput)
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
            const input = component.querySelector(`[${CALC_ATTRIBUTE}="input"]`)

            input.addEventListener('change', () => {
                calculateTotal()
            })
        })
    }

    function calculateSliders(groupObject) {
        Object.keys(groupObject).forEach((key) => {
            const inputElement = groupObject[key][0].querySelector(
                `[${CALC_ATTRIBUTE}="input"]`
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

    function updateDisplayAll() {
        updateDisplay(totalSavingsSpan, value.totalSavings)
        updateDisplay(industrySavingsSpan, value.industrySavings)
        updateDisplay(industrySpan, value.industryText)
        updateDisplay(employeeSpan, value.employeeCount)
        updateDisplay(industrySavingsMinSpan, value.industrySavingsMin)
        updateDisplay(industrySavingsMaxSpan, value.industrySavingsMax)
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

    sliderListeners(sliderComponents)
    observeMutations(radioButtons)
    observeMutations(checkboxButtons)

    calculateTotal()
}

window.addEventListener('DOMContentLoaded', function () {
    initCalc()
})