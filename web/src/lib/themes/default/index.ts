import { createSystem, defaultConfig, defineSlotRecipe } from '@chakra-ui/react';

export const listSlotRecipe = defineSlotRecipe({
    className: "chakra-list",
    slots: [  "root", "item"],
    base: {
        root: {
            "&": {
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

export const networksSlotRecipe = defineSlotRecipe({
    className: "networks-tabs",
    slots: [  "root", "list", "trigger", "content"],
    base: {
        root: {
            "& button[data-selected]": {
                backgroundColor: "#FFFFFF !important"
            },
            "& .network-account": {
                marginTop: "15px",
                marginRight: "15px",
                borderRadius: "3px",
                backgroundColor: "#dfe0e2 !important"
            },
            "& .network-account button": {
                fontFamily: `var(--font-fallback) !important`,
            },           
            "& .network-account button:last-child": {
                borderLeft: "1px solid #8c9191 !important"
            }            
        },
        list: {
            backgroundColor: "#fdfdfd !important"
        },
        trigger: {
            paddingX: "5px"
        },
        content: {
            width: "85%"
        }
    }
});

const defaultTheme = createSystem(defaultConfig, {
    theme: {
        tokens: {
            fonts: {
                logo: { value: `'Coiny', sans-serif` },
                button: { value: `'Roboto', sans-serif` },
                input: { value: `'Roboto', sans-serif` },
                header: { value: `'Karla', sans-serif` },
                message: { value: `'Roboto', sans-serif` }
            },
            colors: {
                blue: {
                    100: { value: "#eff6ff" }
                },
                brown: {
                    100: { value: "#e6e6e6" },
                    200: { value: "#636363" }
                },
                dark: {
                    100: { value: "#222222" }
                },                
                green: {
                    100: { value: "#679186" },
                    200: { value: "#eaf4f4" },
                    300: { value: "#319795" }
                },
                grey: {
                    100: { value: "#8c9191" }
                },
                red: {
                    100: { value: "#fef2f2" }
                },                          
                violet: {
                    100: { value: "#280e52" },
                    200: { value: "#3d348b" }
                }
            },
        },
        slotRecipes: {
            list: listSlotRecipe,
            tabs: networksSlotRecipe
        }
    }
});

export default defaultTheme;