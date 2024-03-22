// Function to initialize the Swiper Roi
const initSwiperRoi = () => {
    // Initialize the debug mode flag
    window['debug'] = false // Set to false to disable logging

    // Debug log function
    function DebugLog(message) {
        if (window['debug']) {
            console.log('MB Debug:', message)
        }
    }
    DebugLog('Swiper Roi Init')

    const swiperRoi = new Swiper('.swiper.is-roi', {
        allowTouchMove: false,
        effect: 'fade',
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 0,
        threshold: 20,
        speed: 600,
        navigation: {
            nextEl: '[swiper-button-next]',
            prevEl: '[swiper-button-prev]',
        },
        on: {
            slideChange: function () {
                DebugLog(this.activeIndex)
                const targetSlideIndex = 2 // Assuming the delay should start after reaching this slide
                if (this.activeIndex === targetSlideIndex) {
                    DebugLog('slide 2')
                    setTimeout(() => {
                        // Automatically move to the next slide after 2 seconds
                        this.slideNext()
                        DebugLog('to slide 3')
                    }, 2000) // 2 seconds delay
                }
            },
        },
        allowTouchMove: false,
    })

    // Select all elements with the custom attribute `mb-swiper-button-to`
    document.querySelectorAll('[mb-swiper-slideto]').forEach((button) => {
        button.addEventListener('click', () => {
            // Retrieve the slide number from the attribute, adjusting for zero-based indexing
            const slideIndex =
                parseInt(button.getAttribute('mb-swiper-slideto'), 10) - 1
            // Use slideTo to navigate to the specified slide
            swiperRoi.slideTo(slideIndex)
            DebugLog(slideIndex)

            // Slide to top the content with oveflows
            if (slideIndex === 0) {
                const scrollableElements = document.querySelectorAll(
                    '[by-scrolltotop-target]'
                )
                scrollableElements.forEach(function (element) {
                    element.scrollTop = 0
                })
            }
        })
    })
}

/**
 * Initialize code
 */
// Event listener to initialize everything after DOM content is loaded
window.addEventListener('DOMContentLoaded', () => {
    initSwiperRoi()
})
