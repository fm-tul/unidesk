const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
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
      maxHeight: {
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