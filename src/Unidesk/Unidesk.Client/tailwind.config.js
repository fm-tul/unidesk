const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "index.html"
  ],
  theme: {
    screens: {
      xs: '320px',
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    extend: {
      keyframes: {
        "reveal-sm": {
          "0%": { maxHeight: 0, overflow: 'hidden' },
          "99%": { maxHeight: "50px", overflow: 'hidden' },
          "100%": { maxHeight: undefined, overflow: 'initial' },
        },
        "reveal-var": {
          "0%": { maxHeight: 0, overflow: 'hidden' },
          "99%": { maxHeight: "var(--h, 20px)", overflow: 'hidden' },
          "100%": { maxHeight: undefined, overflow: 'initial' },
        },
        "delay-fade-in": {
          "0%": { opacity: 0 },
          "50%": { opacity: 0 },
          "100%": { opacity: 1 },
        }
      },
      animation: {
        "reveal-sm": "reveal-sm 150ms ease-in-out",
        "reveal-var": "reveal-var 150ms ease-in-out",
        "delay-fade-in": "delay-fade-in 150ms ease-in-out",
      },
      fontSize: {
        xxs: ['10px', '14px'],
      },
      fontFamily: {
        'sans': ['Roboto'],
        'roboto': ['Roboto', 'sans-serif'],
      },
      colors: {
        info: colors.sky,
        success: colors.green,
        warning: colors.amber,
        error: colors.red,
      },
      minWidth: {
        xs: '320px',
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1440px',
      },
      maxWidth: {
        xs: '320px',
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1440px',
      },
      width: {
        xs: '320px',
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1440px',
      },
      maxHeight: {
        xs: '320px',
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1440px',
      },
      minHeight: {
        xs: '320px',
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1440px',
      },
      height: {
        xs: '320px',
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1440px',
      },
      variables: {
        DEFAULT: {
          color: {
            white: colors.white,
            black: colors.black,
            neutral: colors.neutral,

            info: colors.sky,
            success: colors.green,
            warning: colors.amber,
            error: colors.red,
          }
        }
      }
    }
  },
  plugins: [
    require('@mertasan/tailwindcss-variables')({ colorVariables: true }),
    require('prettier-plugin-tailwindcss'),
    require("tailwindcss-animate"),
    require('@tailwindcss/typography'),

    plugin(function ({ addVariant }) {
      addVariant('optional', '&:optional');
      addVariant('hocus', ['&:hover', '&:focus']);
      addVariant('selected', '&.selected');
      addVariant('loading', '&.loading');
      addVariant('peer-loading', '.peer.loading &');
      addVariant('has-backdrop', '@supports (backdrop-filter: blur(0px))');
    })
  ],
  corePlugins: {
    // preflight: false,
  },
  // important: '#root',
}