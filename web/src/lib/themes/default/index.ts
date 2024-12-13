import { createSystem, defaultConfig, defineSlotRecipe } from '@chakra-ui/react';

export const listSlotRecipe = defineSlotRecipe({
    className: "chakra-list",
    slots: [  "root", "item"],
    base: {
        root: {
            "&.chakra-list": {
                flexDirection: "column",
                "& li": {
                    marginBottom: "15px !important",
                    backgroundColor: "#FFFFFF"
                },                
                "& li a": {
                    display: "block !important",
                    padding: "15px 15px 16px !important",
                    textDecoration: "none",
                    fontFamily: "button !important",
                    fontSize: "14px !important",
                    color: "grey.100 !important",
                    _hover: {
                        textDecoration: "none",
                        backgroundColor: "green.200 !important",
                        color: "grey.100 !important"
                    }
                },
                "& li a.new-message": {
                    color: "violet.200 !important",
                    _hover: {
                        color: "violet.200 !important"
                    }
                }
            }
        },
        item: {
            whiteSpace: "normal",
            display: "list-item",
            listStyle: "none",
            color: "black.100"
        }
    }
});

const defaultTheme = createSystem(defaultConfig, {
    theme: {
        tokens: {
            fonts: {
                logo: { value: `'Coiny', sans-serif` },
                button: { value: `'Roboto', sans-serif` },
                input: { value: `'Roboto', sans-serif` }
            },
            colors: {
                dark: {
                    100: { value: "#222222" }
                },
                brown: {
                    100: { value: "#e6e6e6" },
                    200: { value: "#636363" }
                },
                green: {
                    100: { value: "#679186" },
                    200: { value: "#eaf4f4" },
                    300: { value: "#319795" }
                },
                grey: {
                    100: { value: "#8c9191" }
                },                                
                violet: {
                    100: { value: "#280e52" },
                    200: { value: "#3d348b" }
                }
            },
        },
        slotRecipes: {
            list: listSlotRecipe
        }
    }
});

export default defaultTheme;