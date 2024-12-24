import { createSystem, defaultConfig, defineSlotRecipe } from '@chakra-ui/react';

export const listSlotRecipe = defineSlotRecipe({
    slots: [  "root", "item"],
    base: {
        root: {
            "&.list": {
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
                },
                "& li a .message-time": {
                    lineHeight: "25px",
                    fontSize: "13px",
                    color: "grey.100"
                },               
                "& li a.message-active": {
                    borderRadius: "0 !important",
                    backgroundColor: "#36558f !important",
                    color: "#FFFFFF !important",
                    _hover: {
                        backgroundColor: "#36558f !important",
                        color: "#FFFFFF !important"
                    }
                },
                "& li a.message-active .message-time": {
                    color: "#FFFFFF !important"
                }                
                
            },
            "&.navigation": {
                flexDirection: "row",
                "& li": {
                    borderLeft: "1px solid #dfe0e2 !important"
                },
                "& li:first-child": {
                    borderLeft: "none !important"
                },
                "& li .page-link": {
                    display: "block !important",
                    minWidth: "35px !important",
                    height: "32px !important",
                    lineHeight: "32px !important",
                    textAlign: "center !important",
                    fontFamily: "'Roboto', sans-serif !important",
                    fontSize: "13px !important",
                    fontWeight: "400 !important",   
                    backgroundColor: "#FFFFFF !important",
                    color: "#222222 !important",
                },
                "& li:first-child .page-link": {
                    borderTopLeftRadius: "3px",
                    borderBottomLeftRadius: "3px"
                }, 
                "& li:last-child .page-link": {
                    borderTopRightRadius: "3px",
                    borderBottomRightRadius: "3px"
                },                
                "& li:first-child .page-link, & li:last-child .page-link": {
                    padding: "9px 10.5px !important"
                },
                "& li .page-link:hover, & li .page-link:active, & li .page-link:focus": {
                    backgroundColor: "#bbd4ce !important",
                    color: "#222222 !important"
                },
                "& li.disabled .page-link, & li.active .page-link": {
                    backgroundColor: "#d9e7e4 !important",
                    color: "#777777 !important",
                    pointerEvents: "none !important"
                }                                         
            },
            "&.messages": {
                padding: "15px !important",
                width: "100% !important",
                "& li.guest-message, & li.my-message": {
                    marginBottom: "15px !important",
                    padding: "15px !important",
                    width: "80% !important",
                    borderRadius: "6px !important",
                    fontFamily: "'Roboto', sans-serif !important",
                    fontSize: "13px !important",
                    fontWeight: "400 !important",
                    backgroundColor: "#eaf4f4 !important",
                    color: "#222222 !important"
                },
                "& li.my-message": {
                    marginLeft: "20%",
                    backgroundColor: "#92b4f4 !important"
                },
                "& li span": {
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "600 !important"
                },
                "& li .message-time": {
                    marginTop: "15px",
                    color: "#8c9191"
                },
                "& li.my-message .message-time": {
                    color: "#36558f"
                }, 
                "& li .message-time .message-time-icon": {
                    display: "inline-block",
                    verticalAlign: "middle",
                    marginTop: "1px",
                    marginRight: "4px",             
                    fontSize: "medium"
                },
                "& li .load-more-messages": {
                    marginBottom: "15px",
                    paddingX: "25px !important",
                    height: "35px !important",
                    borderRadius: "3px !important",
                    fontFamily: "'Roboto', sans-serif !important",
                    fontSize: "13px !important",
                    fontWeight: "400 !important",
                    backgroundColor: "#dfe0e2 !important",
                    color: "#222222 !important"
                },
                "& li .load-more-messages .load-more-messages-icon": {
                    marginTop: "-2px",
                    height: "16px",
                    color: "#222222 !important"
                },
                "& li .load-more-messages.load-more-messages-disabled": {
                    opacity: "0.3 !important",
                    pointerEvents: "none !important"
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
                padding: "5px 10px !important",
                height: "inherit",
                fontFamily: "'Roboto', sans-serif !important",
                fontSize: "13px !important"
            },           
            "& .network-account button:last-child": {
                borderLeft: "1px solid #8c9191 !important"
            },
            "& .no-accounts-found": {
                marginTop: "15px",
                padding: "10px 15px !important",
                backgroundColor: "#f5f7f7 !important",
                color: "#222222 !important"
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
                    100: { value: "#eff6ff" },
                    200: { value: "#36558f" }
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
                    300: { value: "#319795" },
                    400: { value: "#bbd4ce" }
                },
                grey: {
                    100: { value: "#8c9191" },
                    200: { value: "#dfe0e2" }
                },
                red: {
                    100: { value: "#fef2f2" },
                    200: { value: "#ef476f" }
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