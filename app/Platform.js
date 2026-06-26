'use client';
import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";

/* ═══ COLORS & FONTS ═══ */
const CL = {dk:"#18332f",bg:"#f8efe6",bg2:"#f0e5d8",gr:"#6b7f7a",gr2:"#96a5a1",ln:"#d4cdc4",gn:"#2d6b4f",yl:"#b8860b",rd:"#a33030",bl:"#1a5276",wh:"#ffffff"};
const CD = {dk:"#e8dfd6",bg:"#1a1f1e",bg2:"#242a28",gr:"#8a9b96",gr2:"#6b7f7a",ln:"#2e3835",gn:"#4a9e75",yl:"#d4a017",rd:"#cf5050",bl:"#3a8cc2",wh:"#212826"};
let C = CL;
const DP = "'Cormorant Garamond',Georgia,serif";
const IMG_SCALE = {default:1.32, MCLEAN:1.55, MCQUEEN:1.55, LAMARR:1.55, CLEO:1.55};
const imgScale = (model) => IMG_SCALE[(model||"").toUpperCase().trim()] || IMG_SCALE.default;
const PSTAGES = [["nuevo","etapaNuevo","#8e44ad"],["contactado","etapaContactado","#2980b9"],["interesado","etapaInteresado","#c47a00"],["cliente","etapaCliente","#1d6e4e"],["descartado","etapaDescartado","#9aa4a0"]];
const BD = "'DM Sans',system-ui,sans-serif";
const LOGO = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAH0AfQDASIAAhEBAxEB/8QAHQABAAMBAQEBAQEAAAAAAAAAAAcICQYFBAMBAv/EAFUQAAEDAgMDBgcKCAoKAwAAAAABAgMEBQYHEQgSIRMxQVFhkRQiMlJxgbEVI0JydaGjs8HCFjM3YoKiw9EkJjZDU2WSk7LhFxgnNGNkdISU01aDtP/EABkBAQADAQEAAAAAAAAAAAAAAAADBAUCAf/EACgRAQACAgEDBAIDAQEBAAAAAAABAgMRBBIxMhMhM1EUIiNBcUJh8P/aAAwDAQACEQMRAD8ArqACVlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOjwbgbF2MZHMw1h+tuLWu3Hyxs3YmO6nSO0ai9iqe3iTJvM3D1E6tueEK1KdqK576d8dTuInOruSc7dTtU86o7bdRS0xuIcCAD1yAAAAAAAAA+m2UFddK+KgttFUVtXMu7FBTxLJI9epGpxUkGLIfNmShSsbg6oSJW7266qgbJp8RX72vZpqeTaI7uopa3aEag+29Wm6WS4SW68W6qt9ZH5cFTE6N6dS6KmunafEeuQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA7zIjAn+kPMWkscz3x0EbHVVc9i6OSFioiona5zmt16N7XoODJ+2G6iGPM+6wSORJZrO/k9enSWJVRPVx9RxeZiszCTFWLXiJW+sdpttjtcFrtFDBQ0VO3dihhYjWtT9/WvOp9gBQbKqW2JldbbXSxY8w/SR0jZJ0hucETd1iudruzIicEVV8V3WqtXn1VayF79rmqp6fIi9RTuRH1M1NFCi9L0nY/T+yxy+oogXcMzNfdl8qsVyewACVWAAAP6nFdEP4ftRPZFWQSyJqxkjXOTrRF4gX2yAyvtmXuE6aSWljfiCrhR9fVOaivaqoi8k1ehrebhzqmq9GkmH+YZI5omSxPR8b2o5rk5lReKKf6M6ZmZ3LbrWKxqHD5yZcWbMXC89BWQRR3KKNy0Fbu+PDJzomvOrFXnb9qIpnrXUs9FWz0dVGsc8EjopWLztc1dFTvQ1CM2czaqnrsyMT1tI5HU1Rd6uWJycysdM9UXuVCxx5n3hS5lYjUudABZUQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPZwViS6YRxPQ4hs0qR1lHJvt3uLXpzOY5OlqoqovpPGB53exOveF+Mus9MAYttkUlReaSx3HdTl6O4TJFuu6d17tGvTq0XXrRDor3mdl7ZqJ9XXYysm4xNd2GrZNI70MYquX1IZyghnBG1uOZbXvCWNorNybMq8w0lvjlpcP0DlWmifwfM9eCyvToXTgidCKvWpE4BNWIrGoVbWm87kAB65AAAAAFpdnTP+2UNjpsJ47qnU3gjEiork5quYsacGxyaIqoqcyO5tOfTTVZ/Zj7Ar4EnbjTDixKmu/7pw6f4jNsENsMTO1qnLtWNT7rc5+7Qtnp7JU4ewFXJX3CpY6Ka4RIqRUzVTReTd8J6ovBU4Jz6qpUYA7pSKxqEOTLbJO5AAdowAAAAAAAAAACw2GdmG4X/CNnv9NiyCndcaKKqWnmol975RiO03kfx4L1IV6RFVURE1VeZDTnD1EltsFutyJolLSxQInVusRv2EOa811pa42KuSZ6lOM1Nna54HwHU4mjv7Ls6lkZ4RTx0ixoyJV0V6O3lVdFVvDROCqvQQYaf3e30l1tVXa6+Fs1JVwvgmjXmcxyKip3KZwZiYYq8G41umG6zeV9FOrGPVNOUjXix/raqL6xhyTb2k5OGMepr2c+ACZVAAAAP9Ma572sY1XOcuiIiaqq9QEnZE5QV2aLrrI26e5VJQMa1KhaflUklcvBmm834KKqrrw1ThxJIi2Sbos2kuNaNsWvlNoHOd3b6e0nfIrBjcCZaWyyyRo2uezwmuVOdZ3oiuTt3U0b6GodyVLZrb9mlj4tOmOqPdmljywOwtjO8YddOtR7nVclOkqs3eUa1dEdpqumqaLpqvOeIShtUUS0We2Ik3dGTOhnb270LFX59SLyzWdxEs+8dNpgOzybwTHmFjiDDMlzW28tBLI2dIeV0Vjd7Td3m695xhKmydMsOfWHk6JEqWL/AOPIvtRBadVnT3HETeIlItRsk3Jq/wAHxtSSJ/xLe5nsep/iHZKvCr77jOgYn5tE933kLZAqetf7aX4uL6UPz3ydblbbrRO7EXutLcZZWbqUfIoxGI1dfLdr5XYROWi29pVWXB0CLwRta5U9PIInsUq6WcczNdyoZ6xW8xAd9kflyuZuJa2xsu7bXJT0LqtsjqflUfpIxm6qbzdPL11483McCTvsQP3c3a5vn2WZv0sK/Ye3mYrMw5xVi14iXQRbJV2WXSXGlEyPXym0LnL3bye0jHPDKS8ZY3KDlZ1uVoqkRIK9sW4iv08Zjm6ruu51Tiuqc3MqJf8APLxZh+04pw/V2K90jaqhqmbsjF506nNXoci8UXoUrVzW37r9+LSa/r3Zlg7zOnLS7ZbYndQVW/UW2oVX0Fbu6NmZ1L1PThqnr5lQ4MtxMTG4Z1qzWdSAA9cgAA7/ACOy5TM3EldY23lLVLT0Lqtki0/Ko/R7GK1U3m6eWnEliHZKuqy6TY1omR6+U2hc5dPRvp7TndiOTczfq2+fZ5m/SRL9hdMrZclq21C/x8NL03MM0cdWRmG8ZXjD8dUtW23VklLy6s3OU3HK1V3dV05ubVTxTpM05eXzOxVNrryl5rHd8zzmyxHZSt3kLLUOyrLcbRRXKixvGjaqnjmSOW2r4u81HaapJx5+orSaU5bv5XLvDUvn2mld3wtIs15rrSxxsdbzMWhWr/VLvW/p+GVv3evwN+vdvH5X/ZddYsL3a+12NmPbbqKaqWKK2r4/JsV2m8snDXTqUtycPn7U+CZMYsl103rbJF/bTc+8QxlvM62tW42OImdM7wAXGWAAAfpTMbLUxRvduNe9GudpzIq85+YAs3WbJNwbIvgeNqWRmvDlbe5i/M9Tk819n+XL7AdViasxVHXSRSxRMpo6JWI5XuRNd9XrzJqvMXUopeWo4Zv6SNru9NSENtuo5HKCliRf94vEMfdHK77pUpltNohpZePjrSZiFKwAW2anjJ7Z9p8wsA02JUxZJbpJpZY3QeAJKjVY5U5+Ubzpop08uyPUJ+Kx5E741qVP2qne7FsvKZM7n9Fc52fMx33ibCpfLaLTG2lj4+O1ImYVNk2Srwi+94zoHJ+dRvT7yn5/6pl+/wDl9t/8Z/7y2xwk2cOWUFZNRz4wt8U8Ejo5GP327rmroqcU60PIy3ns6nj4Y7oFTZLvvTjC2p/2r/3n6M2Srqq+PjSib6KFy/fQn6DNbLWbyMc2BPj1rG+1UPSpMdYJrNPBMY4en1/o7lC72OHqZHkYMP8A9Kuztk5Kamlqq3HqJFExz3pHauOiJqvFZfsKwmmFzrrbdLJXUtHcqOZ09NJG3k52u4uaqdC9pmeTYbzbe1bk46010gAJlUAAAAAAAB7mX9D7p48w/bd3eSqudNCqdjpWovtNLDP7ZooPdHPHDEO7qkdQ+oXs5ON70XvahoCVeRPvENHhx+syFZtt7BHL26348ooffKZUo69WpzxuX3t6+hyq39JvUWZPNxVZKLEmG7hYbizfpK+nfBInSiOTnTtRdFTtRCKlumdrGWnXWasyQeri2xV2GcTXGwXFm7VUFQ6GThwdovBydipoqdioeUX2PMaAAHgTDsm4I/CzM6G41UO/bbGjaybVODpdfemf2kV3oYpDxfzZqwP+BGWFFDVQ8nc7jpW1uqeM1zkTdYvxW6Jp173WRZbdNVjjY+u/+JMABSaqlm23RLT5u0tSjdG1dphfr1ua+Rq/M1CCize3lRbl1wpcUb+NgqYVX4jo3J/jUrIXsU7pDI5EaySEj7M0nJZ6YXd11Eje+F6faRwd/s7P3M7cKr/zyJ3tch1bxlxj84/1oSADPbSp23lJrfcKxebTVDu9zP3FaCx23c/XGGHI+q3yL3yf5FcS9i8IZPI+SQm/Yqfu5yPb59rnT9aNfsIQJn2NXbudlOnnUFQn6qL9h7k8Zc4fkheEAFBsOfzCwfZccYYqbBfIOUglTWORvlwSJ5MjF6HJ86aovBVKBZpYEvWX2KprHeI95vF9LUtbpHUxa8Ht+1OheHaaOnIZs5f2bMXCstmujUjmbq+jq2t1fTSacHJ1ovMrelO3RUlx5Omffsr58EZI3HdnMD3cd4UvOC8TVWH75TLDVQLwcnFkrF8l7F6Wr/kuioqHhFyJ2y5iYnUgAPXibNi527nOiedbZ0+di/YXcKPbGrtM7KdPOoKhP1UUvCU8/k0+J8bM3GUvL4wvU/Pylwnf3yOU8k+i4zeEXCpn115SVz9fSqqfOW4Zs9w0iymdv5V4Sf51jol+gYZumj+T/wCSXB/yFRfUMIOR2hc4XlLqSLtqyoWnyGxEqLo6RKeNPXUR6/NqSiQ9thybmR9wb59XTN+kRfsIKeULmXwn/FGAAX2MAAAAANN8MScrhq1y6679HC7vYhBe3VJpl5Y4dfKuyO7oZE+0mvAb+UwNYH+dbKdfomkFbdz9MJ4bj86uld3R/wCZRx+cNbP8UqjAAvMlc7YckV+VFzjX4F7l09Cwwr+8nor7sLu1y3vTOq8OXvhi/cWCKOXzlr4PjgMxsQyrPiC4zquqyVUr+96qacmXc7+Vnkk89yu71JeP/avzf+X5gAsqAAAAAAAAAAAAAAnTYmt61WblRWK3VtFa5ZEd1Oc9jE+Zzu4t/iW/27D1PSVFzl5KGqrIqNj+hJJF3W69mvSVv2DbevKYruzm8ESmp41/vHO9jDpNuSvdT5dWahjerHVF2bIui8VRkT/tci+oqXjqyaaOGfTwdSwII/2fscJjzLS33OaVH3GmTwSvTXjyrETxv0kVrvWqdBIBDManS3W0WjcKrbbuB+TqKDH1DD4sulHcd1PhInvT19KatVexiFYDS/HGHaLFmErnhy4J/B6+B0Su01Vjudr07WuRHJ2oZwYjtFbYL9XWS5RclV0M74Jm9G81dNU60XnRelFLWG+40zuXj6bdUf288AE6olLZjwN+G2Z1J4VDv2u16VlZqniu3V8SNfjO04dSOLx4rvdDhvDdwv1yfuUlBTunk61RE4NTtVdETtVCPtmDAv4E5Z0z6uHcut20rKzVPGYip73GvxW9HQrnEb7buOOSpKDAVDN482lZcN1fgIvvTF9KorlT81vWVLfyX00qR6GLqnusXha6Je8M2q9NajEr6KGqRqLqicoxHafOeicLs/VfhuS2FJtdd23Mh/u9WfdO6IZjUrNZ3WJV426qLlMBWG4buqwXRYdepHxOX9mU+Lz7YdF4VkfcJ93XwOrp5vRrIkf3yjBbwT+rN5cayB3ez8umdOFF/rFn2nCHdZAflown8pRklu0ocflDQ4AGe2lQNutf4+WFOq1qv0riuxYjbq/l/Yfkr9q8ruXsXhDI5HySEzbG6a520q9VDUL+qhDJNexgzezoYvm22df8Kfae5PGXmH5IW6zSqZaPLLFNXBI+OWGzVcjHsXRzXJC9UVF6F1Iv2Z86Y8aUUeGMSTsjxHTs96ldwSuYieUn/EROdOnnTpRJIzjXTKTGHyHWfUPM6aGrqaCthraKokp6mB6SRSxuVrmORdUVFTmVFK+KkXrK7nyzjvEw1BBDuzlnHTZg2ttnvEkcGJqSPWRvBratifzjE6/Ob0c6cOaYiK1ZrOpWaXi8bhH2eGWFrzKwytLLuU13pkV1BW7vGN3mO6VY7pTo505ihWJrHdMN32rsl5pH0ldSPVksb/mVF6UVOKKnBUU02Iq2hco6PMexeF0LYqfEdGxfBJ14JM3n5F69S9C/BVepV1kxZOn2nsr8jB1x1V7qGA+m6UFba7jUW6400tLV00ixzQyN0cxyLoqKh8xcZiYtjtdM8KBOukqE/UUvBXSclRTy+ZG53chR3Y+/Llbf+lqfq1LsYmk5LDdzl8yjld3MUqZ/NpcT45ZjgAts0NIco27mVOEWdVjok+gYZvGkuVyaZZ4WTqs1J9Swr8jtC7wvKXRkL7Zi6ZKzJ13CnT51JoIV2z1/2Lv+UYPvEGPyhbzfHKkIAL7HAAAAAGlOWy65dYaXrtFKv0LSBtvJ+llwozrqale5sf7yeMs00y3wwnVZ6T6lhAO3qv8AAsHt65KxfmhKWP5Grn+GVVQAXWUuDsKr/EC+p/Wv7JhYcrxsKfyBv3yon1TCw5Ry+ctfj/HD+ScI3L2KZcGo703mqnWmhU2PZKvK/jMZUDfi0b1+8h3hvFd7RcrHa+umFagWdj2SKtfxmOoG/Ftir+1Q+yn2R4E/H48kf8S1I32yqTetT7VPxsv0qsC0mJ9mLDtgwpdr5U4ruUyW+hmqla2nY1HcmxXac68+hVs7reLdnGTHbH5AAOkYAAAAAAAC6OxHbVpMqKyucnjV10kc1fzGMY1PnRxx23nWKtThK3o7g1lVM5OvVYkT2OJj2abb7l5H4Zg00dLTOqXL18rI6RPmchXzblq1lzMtFEi+LBaGv9b5ZNfmahVp75dtHJ+vHiP8ePsi45/BbMdtlrJty233dpnby+KydF96d61VWfpp1F4DLmN745GyRvcx7FRzXNXRUVOZUU0NyKxszHuW1uvT3tWujb4NXtT4M7ERHLp0byaOTscM9f8Ap5w8m46JdyVP228C+DXOix7QQ6RVelJcN1OaRE97evpaitVfzW9ZbA8THuGqLF+D7nhu4InIV0Cxo7TVY387Hp2tciL6iKlum21nNj9SkwzSJR2ZsCfhxmZStq4d+1WvSsrdU8VyNXxI1+M7Th1I4j3EFprbFfK2zXKJYqyinfBMzqc1dF0606UXpQvRsy4D/AfLSmSrh5O7XTSsrdU8ZmqeJGvxW9HnK4tZb9NfZncfF139/wCkiX+60VjslbeLjKkVHRQPnmf1Namq6dvDghm/jvEdbi7GFzxHXqvL107pN3XXk28zGJ2NaiJ6izm21jjwGx0WBaGbSevVKqu3V4pC1fEavxnpr+h2lSDnBXUbScvJu3TH9L27ItV4RkVZ41XVaaapi+me77xLZA+w/VrPlPX0zl4014lRE/NdFEvtVxPBXyRq0rmGd44cLtA0SV+S2K4Fbru258/93pJ90zxNNsWUKXPC12tqt3kq6KaDTr32K37TMkn48+0wqc2P2iQ7rID8tGE/lKM4U7rID8tGE/lKMmt2lVx+UNDgAZ7aU/26v5f2H5K/avK7liNur+X9h+Sv2ryu5exeEMjkfJITnsSs3s4ah3mWid30kSfaQYT7sNRb2al1l6GWSRPWs8P7lPcnjLzB8kLQZyfkkxh8h1n1LzOI0dzk/JJjD5DrPqXmcRFx+0rHN8ofXZrlX2e6010tdVLSVtLIkkM0a6OY5On/AC6S92z/AJsUGZNg5KpWKmxBRsTw2lRdEenNysaeavSnwV4dSrQY9TCl/u2F7/SXyyVb6WupX70b28y9bVTpaqcFTpQkyY4vCDDmnHP/AI00BweSmZlpzKww2uptynudOiMr6Le4xP8AOTrYvHRfUvFFO8KUxMTqWtW0WjcIT2l8mosc25+IsPwMjxJSx8WpoiVsaJ5C/np8FfUvDRUpPPDLTzyQTxPiljcrHse1Wua5F0VFReZUU1EK87UeSqYhgnxphSlT3YibvV1JG3/e2onltT+kROj4SdvPPiy69pVOTg6v2r3Q7sfflytv/S1P1Slz8dv5PBF+k8221C90TimGx+ipnnbUVNFSmqfq1LkZlu3MucTP820Va/QuPM3nD3i/FLNcAFtmhpRlom7lzhlOq0UifQtM1zSvLxNMAYdTqtVKn0TSvyO0LvC7y90hXbPTXJZ/ZcYPvE1EPbYcKy5HXB6J+Kq6Z6/3iN+8QY/KFzN8cqMAAvsYAAAA/oGluAo1iwNYIl52Wymb3RNK77e7ve8GN61rl/8AzlmLRT+CWmjpVTTkYGR6ehqJ9hWHb1kRavB8WvFrKx2npWH9xSxebV5HtilV8AF1lLg7Cn8gb98qJ9UwsOV42FP5A375UT6phYco5fOWvx/jgVURFVeZCN257ZTu5sY03rp5k+4SLUrpTyL1MX2GXR1ixxfe3HIzTi1poRFnVlZL5ONLcnxke32tPtgzXy1m8jHNhT49YxntVDOoEv48fav+Zb6aB5lYrwjfsscT0FrxbYaqeotNTHE2G4xPVzlidonB3SvAz8AO6U6EObNOWYmYAASIQAAAAAP6iKqoiIqqvBEQ/h0mV9sW85j4cte7vNqbnTsen5nKJvL/AGdTyfZ7EbnTRLCltbZ8LWm0NajW0VFDToidG4xG/YUv2yanl87KmLXXwehp4/Rq1XfeLxFBdqWo8Jz4xK/XVGPgjTs3aeNPailXB72aPL9scQjEnPY5xv8Ag7mC7DdZNu2++okTN5eDKluvJr+lqre1Vb1EGH60s81LVRVVNK6KaF6SRvauitci6oqL1opZtXqjShS80tFoahg5LJ/GEOOsvbXiJitSeWLk6tjfgTt4PTsTXinYqHWlCY1OmzExMbhDuPsl6LE2dlixm5kSW+NvKXWFf56WLTkeHTvcEd2R9pLN1r6S12uqudfM2GkpIXzTSO5mMaiqq9yH0le9tTHHuThOlwZRTbtXd15Wq3V4tpmLwT9J6dzHJ0nUbvMQjt04qzZV7MnFVXjTG90xLV7zVrJlWKNV/FRJwYz1NRE9OqnOAF6I0yJmZncrY7B1Yj7Hiq368Yamnm0+O16fsyy5UjYQqlZirEtFrwloYpdPiSKn3y25TzectXjTvHAZm4zoUteML1bEbupSXCeDTq3JHN+w0yM+No2gS3Z3Yqp0bu79by/96xsn3zvjz7zCHmx+sSj47rID8tGE/lKM4U73Z5Zv514UT/n2r3Iqli3aVLH5Q0LABntpUDbrT+Plgd12tU+lcV2LH7dzNMX4ck66CRO6T/MrgXsXhDI5HySFi9hOPXHGIJtPJtrW98rV+wroWY2DYtb5iqbzKanb3uev3Rl8Je8f5IWFzk/JJjD5DrPqXmcRo7nHxykxh8h1n1LzOIj4/aU3N8oAAWFJ0GX+LrzgjFFNiCxz8nUQro+NfImjXyo3p0tX5uCpxRC/+V2OrNmDhWC+2iTdVfEqaZztX08unFjvai9KaKZwHZ5Q5hXfLnFcd3tyrLSyaMraRXaMqI9ebscnOjuhexVRYsuPqj27rGDP6c6ns0VB4+DMS2jF+HKS/wBjqkqKOpbqi8zmO6WOToci8FQ9gp9mpE794RhHlPQWvO2hzCsSR00czJ2XKlRNGrI+NUSVnaq+UnWuvWdZmkumWWKl/qas+pedGc1msumV2LF/qSs+oee7mZjbnpitZ0zcABoMUNJMqqltXljhapauqSWekd6+Rbr85m2Xx2T78y+ZK2qJZGuntj5KGZE6N12rP1HMIM8e21zhz+0wlcjraVt63LI7FEDW6rHTNqE7OSkZIvzNUkU+K/W2C8WOvtFUmsFdTSU8qafBe1Wr8ylWs6na/aOqswzEB9t9tlXZb3W2iuZydVRVD6eZvU5jlRfYfEaLEAAAPcwBbXXjHVhtTWK7wu4wQqmnQ6RqL82p4ZNGx3hl97zchuj41WlssD6l7lThyjkVkbfTq5XJ8Q5tOomXeOvVaIXgKd7c1xbPmJZrY1dfBLZyjux0kjuHcxO8uIZ67QmImYnzgxBcoZN+mjqPBYF6NyJEj1TsVWq71lXBG7baHLtqmvtwIALjMXC2FU/2f31f61/ZMLDFfdhdumW16f13hyd0MX7ywRRy+ctfj/HD8a5dKKdeqN3sMvTUKvTWhqE64newy9JeP/atzf8AkABZUQAAAAAAAAAACW9ke1+6WeNplVNWUMM9U5PRGrE/We0iQsnsI2pJcS4lvSs/3ajipWu0/pHq5fqkOMk6rKXBG8kQtqZ3Z9VPhWc2LJUXXducsf8AYXc+6aIma2ZE/hWYeJKrXXlrtVSa+mZykHH7yt82f1h4AALTPWD2K8b+5GL6rBtbNu0l4TlKbeXg2pYnN+kxFT0tahcUzBtVfVWu50tyoZnQ1VJMyaGRvO17VRWr3oaO5bYppMaYIteJKTdRtZAjpGIuvJypwez1ORUKueup20eJk3HTP9Pdq6iCkpZqqplbFBCx0kkjl0RrUTVVXsREM583MXz45zBumIpFckM0u5Ssd/NwN4MTsXRNV7VUtTtj42/B7L1mG6Obdr765Y36LxZTN0WRf0lVre1Fd1FKjrBXUdSPmZNz0QAAsKSedh+dYs2q+HXhNZpU07UlhX7FLnlG9jio5HO6jj105eiqI/T4m990vIU8/k0+JP8AGFJNtK3+B5y+Eo3RK62wTa9aoro/2aF2yqe3lblbcsK3ZreEkNRTvd1bqsc1P13dx5hnV3vKjeNWMkbZoj5TPPC7eqpe7uiev2EckqbJ8Cz59YeXThElTIvqp5ET51Qt38ZZ+Lzj/V9AAZ7ZVP28o9L5hWXzqaob3OZ+8rOWj29ol38HTonBUrWL9AqfaVcL2Lwhk8n5ZC02wTAqRYwqV5lWjYnq5ZV9qFWS3mwlT7uDMRVen4y4sj1+LGi/fPM3hL3ix/LCZ814+VytxZF59krG98DzNw0vx1EtRgm+wImqyW2oZ3xOQzQOOP2lLze8AALCkAACTMgc1K7LbEqcsstRYaxyNr6VF106ElYnnp86cF6FS+VouNDd7XTXO21UdVR1UaSwzRrq17VTgqGYJOWzBnC7BVzbhnENQq4crJPEkcuvgUqr5XxFXyk6PK69YMuPfvC3xs/TPTbsusc1mv8AktxZ8iVn1DzpGPbIxr2Oa5jk1a5F1RU60ObzX/Jbiz5ErPqHlWO7Qt4yzcABosQJt2RswosJY4fYrpOkVqve7FvuXxYqhF97cvUi6q1fS1V4IQkDm1YtGpd0vNLRaGpAKv7PG0HTNo6bCuPqvkXxIkVJdZF8VzeZGzL0KnQ/mX4WnOtnoZYp4WTQyMlie1HMexyK1yLzKipzoUbUms6lrY8lckbhWTa3yhra+skx/hmkfUSKxEutLE3V67qaJM1E5+CIjkTqResqoakEaY9yNy7xhUyVlXaXW+ulVVfVW9/Iucq9Kt0Vir2q3Umx5tRqVfNxeqeqqgQLa1uyXZHvVaLGNwhb0JNSMkXvRzT+2/ZLsbJEW4YwuNQzpSClZEvequ9hL61Fb8XJ9KqWi2193udPbLZSS1dZUvSOGGJu857l6EQvzkBlzFlxgdlBOscl2rHJPcZWcU39ODEXpa1OHaqqvSejlxlhgzAEblw9a0bVvbuyVk7uUnenVvL5KdjUROw+vMfHuG8A2R1zxBXNjVUXkKZmjpqh3msb0+nmTpVCHJk6/aFrDgjF+1peDtD49iwFlzWVcMyNutc11Lbmovjco5OMnoYnjendTpM/lVVXVV1VTr82sf3fMXFcl7ufvULU5OkpWu1ZTxa8Gp1qvOq9K9SaInHk+OnRCpny+pb27AAJEC52w5ErMp7lIv8AOXuVU9CQwp+8nohTYui5PJhH6fjblO/5mN+6TWUMnlLYwfHD+Paj2OYvM5NDLp7VY9WOTRWroqGoxyC5X5cq9XuwPh5znLqquoI11XuOsWSKbcZ8M5dalnMDSCDLnL6FdYsDYZavX7lw69+6enSYaw5SaeC4ftMGnNyVHG32IS/kR9K/4U/bNWioa2ufuUVHUVLuqGJXr8yHzGnN7f4Fh+vlp2IxYaWR7EamiIqNVUMxiTHk69oc2H0te4ACRAAAAAABKOT2ctzyzsNfbrTZKCsmrahJnz1L38ERqNRu63Tm4rrr0kXA8mImNS6raazuFh6LawxgyTWtw3Ypma80PKxr3q93sK/3CpfWV9RWSJo+eV0jk6lcqr9p+APK0ivZ7fJa/lIADpwErZMZ23vLSy11oprZT3OlqJ0njZPK5vIv00dppzo5Eb3dpFIPJiJjUuq2ms7h1+bePblmLi9+ILjCym95ZBBTsermwsanMirz6uVzvWcgAIjUah5MzadyAA9eOmyvxdPgTHFvxTTUjKySjSVEge9WNfvxuZxVEXm3tfUTFU7WGLnKvg2GbHGnRyiyv9jkK7g4mlbTuYSVy3pGqysFDtXY5RffrBhx6fmRzN9sinJZzZ0V+ZtgobZcLDR0MlHU8u2eCZztUVqtVuip06ovP0EVARjrE7iHs5r2jUyHW5TY2my/xlDiWnt8VfLDDJG2KSRWN8dumuqIpyQOpjcaRxMxO4WEqtq/GrnL4Nh3D8SdCSNmf7HofnDtW47R3v1hw29OpkM7fbKpX8HHpU+kvr5PtJ2dOcFfmfb7XTXCy0tBJb5JHtkglc5H76NRU0Xm8lOkjEA7iIiNQjtabTuQlfKPO675bYTqLFaLJb6t09Y6qfPVPevFWMbu7rVTgm519JFAE1iY1JW01ncLBt2qcWT001NccNWOaKaN0buQWWNdFTTpc4r4AeVrFez2+S1/KQAHTgAAAAATNl1tD4uwbhCLDrKKhujKZ2lLNWOeroo/6PxVTVE6OPBOHNpp6F52m8W3rD10stzsFjWG4Uc1K59OksbmJIxWbybz3IumupBIOPTrveksZskRrYADtEAAAdrl/mnjjA27HYb3K2jRdVoqhOVgXr0a7yfS3RTigeTET3exaazuFoMN7Wc7WNjxHhGOR2njTUFSrePZG9F/xHa2/aky5qGp4RSX+jd08pSscne16+wpUCOcNJTxyskf2vE7aYyuRuqVV1cvUlCuvtPGuu1XgaBrkt1lv1a9OZXxxxMX176r8xTYHnoVdTy8iwGMtqXGFzikp8OWqhsUbkVElcvhM6dqK5EYn9lSDr7eLrfrnLc7zcKm4VkvlzVEivcvZqvMnZzIfACStIr2QXyWv5SAA6cAAAmfK7P+64AwRTYZt+HaGqSGSSRZ5pnIrle5XeSidGunP0Huy7V+NVX3rDuH2p+c2ZfvoV7BxOOs++ksZ8kRqJT+u1bj3osWGk/+mf8A9p/ldqzMHosuF0/7ef8A9xAQPPTp9PfXyfaf2bVuPUXx7FhpU7IZ0/an0xbWGLk/G4ZsbvirK37yldwPSp9H5GT7WQftXXienkgqsG26RkjFY5G1b26oqaLzopW8A6rWK9nF8lr+UgAOnAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//2Q==";
const fmt = n => n.toFixed(2).replace(".",",");
const hashPw = async (plain, email) => { const data = new TextEncoder().encode("minue_" + (email||"").toLowerCase().trim() + "_" + plain); const buf = await crypto.subtle.digest("SHA-256", data); return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,"0")).join(""); };

/* ═══ i18n DICTIONARY ═══ */
const T = {
  connexion:{fr:"Connexion",es:"Conexión",en:"Login",it:"Accesso"},
  sortir:{fr:"Sortir",es:"Salir",en:"Logout",it:"Esci"},
  prototype:{fr:"Prototype interactif",es:"Prototipo interactivo",en:"Interactive prototype",it:"Prototipo interattivo"},
  admin:{fr:"Admin",es:"Admin",en:"Admin",it:"Admin"},
  distributeur:{fr:"Distributeur",es:"Distribuidor",en:"Distributor",it:"Distributore"},
  client:{fr:"Client",es:"Cliente",en:"Client",it:"Cliente"},
  catalogue:{fr:"Catalogue",es:"Catálogo",en:"Catalog",it:"Catalogo"},
  panier:{fr:"Panier",es:"Carrito",en:"Cart",it:"Carrello"},
  commandes:{fr:"Commandes",es:"Pedidos",en:"Orders",it:"Ordini"},
  tarifs:{fr:"Tarifs",es:"Tarifas",en:"Pricing",it:"Tariffe"},
  ressources:{fr:"Ressources",es:"Recursos",en:"Resources",it:"Risorse"},
  dashboard:{fr:"Dashboard",es:"Dashboard",en:"Dashboard",it:"Dashboard"},
  clients:{fr:"Clients",es:"Clientes",en:"Clients",it:"Clienti"},
  promos:{fr:"Promos",es:"Promos",en:"Promos",it:"Promozioni"},
  stock:{fr:"Stock",es:"Stock",en:"Stock",it:"Stock"},
  factures:{fr:"Factures",es:"Facturas",en:"Invoices",it:"Fatture"},
  stats:{fr:"Stats",es:"Stats",en:"Stats",it:"Statistiche"},
  collSS26:{fr:"Collection SS26",es:"Colección SS26",en:"SS26 Collection",it:"Collezione SS26"},
  collSub:{fr:"Prix wholesale HT",es:"Precio wholesale sin IVA",en:"Wholesale price excl. VAT",it:"Prezzo wholesale IVA esclusa"},
  rechercher:{fr:"Rechercher...",es:"Buscar...",en:"Search...",it:"Cerca..."},
  ajouter:{fr:"Ajouter",es:"Añadir",en:"Add",it:"Aggiungi"},
  ajouterPanier:{fr:"Ajouter au panier",es:"Añadir al carrito",en:"Add to cart",it:"Aggiungi al carrello"},
  enPanier:{fr:"en panier",es:"en carrito",en:"in cart",it:"nel carrello"},
  panierVide:{fr:"Votre panier est vide",es:"Tu carrito está vacío",en:"Your cart is empty",it:"Il tuo carrello è vuoto"},
  voirCat:{fr:"Voir le catalogue",es:"Ver catálogo",en:"View catalog",it:"Vedi catalogo"},
  cmdPour:{fr:"Commander pour :",es:"Pedir para:",en:"Order for:",it:"Ordine per:"},
  choisir:{fr:"— Choisir —",es:"— Elegir —",en:"— Select —",it:"— Seleziona —"},
  totalHT:{fr:"Total HT",es:"Total sin IVA",en:"Total excl. VAT",it:"Totale IVA esclusa"},
  unites:{fr:"unités",es:"unidades",en:"units",it:"unità"},
  commEst:{fr:"Commission estimée",es:"Comisión estimada",en:"Estimated commission",it:"Commissione stimata"},
  passerCmd:{fr:"Passer commande",es:"Realizar pedido",en:"Place order",it:"Effettua ordine"},
  cmdEnvoyee:{fr:"Commande envoyée",es:"Pedido enviado",en:"Order submitted",it:"Ordine inviato"},
  tarifActuel:{fr:"Tarif actuel",es:"Tarifa actual",en:"Current tier",it:"Tariffa attuale"},
  prochain:{fr:"Prochain",es:"Siguiente",en:"Next",it:"Prossimo"},
  economisez:{fr:"vous économisez",es:"ahorras",en:"you save",it:"risparmi"},
  meilleurTarif:{fr:"Meilleur tarif ✓",es:"Mejor tarifa ✓",en:"Best tier ✓",it:"Miglior tariffa ✓"},
  paiementUnique:{fr:"Paiement unique",es:"Pago único",en:"Single payment",it:"Pagamento unico"},
  deuxPaiements30:{fr:"2 paiements (30j)",es:"2 pagos (30d)",en:"2 payments (30d)",it:"2 pagamenti (30gg)"},
  deuxPaiements1545:{fr:"2 paiements (15+45j)",es:"2 pagos (15+45d)",en:"2 payments (15+45d)",it:"2 pagamenti (15+45gg)"},
  dePago:{fr:"Payant",es:"De pago",en:"Paid shipping",it:"Spedizione a pagamento"},
  gratuit:{fr:"Gratuit",es:"Gratuito",en:"Free",it:"Gratuito"},
  expOpt:{fr:"8,90 € (opt.)",es:"8,90 € (opc.)",en:"8.90 € (opt.)",it:"8,90 € (opz.)"},
  exp2:{fr:"2 expos. gratuits",es:"2 expos. gratis",en:"2 free displays",it:"2 espositori gratis"},
  exp3:{fr:"3 expos. gratuits",es:"3 expos. gratis",en:"3 free displays",it:"3 espositori gratis"},
  paiement:{fr:"Paiement",es:"Pago",en:"Payment",it:"Pagamento"},
  envoi:{fr:"Envoi",es:"Envío",en:"Shipping",it:"Spedizione"},
  expositor:{fr:"Expositor",es:"Expositor",en:"Display",it:"Espositore"},
  parUnite:{fr:"par unité HT",es:"por unidad",en:"per unit",it:"per unità"},
  contactAgent:{fr:"Contactez votre agent Minuë",es:"Contacte con su agente Minuë",en:"Contact your Minuë agent",it:"Contatta il tuo agente Minuë"},
  prontoPago:{fr:"Pronto pago −3%",es:"Pronto pago −3%",en:"Early payment −3%",it:"Pronto pagamento −3%"},
  prontoDesc:{fr:"Réduction si paiement anticipé",es:"Descuento por pago anticipado",en:"Discount for early payment",it:"Sconto per pagamento anticipato"},
  tarifVolume:{fr:"Tarifs par volume",es:"Tarifas por volumen",en:"Volume pricing",it:"Tariffe per volume"},
  tarifVolSub:{fr:"Prix dégressifs · PVP 50-55 € · Envoi gratuit dès 20 uds",es:"Precios por volumen · PVP 50-55 € · Envío gratis desde 20 uds",en:"Volume pricing · RRP 50-55 € · Free shipping from 20 units",it:"Tariffe per volume · PVP 50-55 € · Spedizione gratuita da 20 unità"},
  votreTarif:{fr:"Votre tarif",es:"Tu tarifa",en:"Your tier",it:"La tua tariffa"},
  mesCmd:{fr:"Mes commandes",es:"Mis pedidos",en:"My orders",it:"I miei ordini"},
  aucuneCmd:{fr:"Aucune commande",es:"Sin pedidos",en:"No orders",it:"Nessun ordine"},
  nouvelleCmd:{fr:"+ Nouvelle commande",es:"+ Nuevo pedido",en:"+ New order",it:"+ Nuovo ordine"},
  creerCmd:{fr:"Créer la commande",es:"Crear pedido",en:"Create order",it:"Crea ordine"},
  modifierCmd:{fr:"Modifier la commande",es:"Modificar pedido",en:"Edit order",it:"Modifica ordine"},
  detailArt:{fr:"DÉTAIL DES ARTICLES",es:"DETALLE DE ARTÍCULOS",en:"LINE ITEMS",it:"ARTICOLI"},
  articles:{fr:"ARTICLES",es:"ARTÍCULOS",en:"ITEMS",it:"ARTICOLI"},
  modeles:{fr:"modèles",es:"modelos",en:"models",it:"modelli"},
  tarifApplique:{fr:"Tarif appliqué",es:"Tarifa aplicada",en:"Applied tier",it:"Tariffa applicata"},
  prixPerso:{fr:"Prix personnalisé",es:"Precio personalizado",en:"Custom price",it:"Prezzo personalizzato"},
  enregistrer:{fr:"Enregistrer",es:"Guardar",en:"Save",it:"Salva"},
  confirme:{fr:"Confirmé",es:"Confirmado",en:"Confirmed",it:"Confermato"},
  expedie:{fr:"Expédié",es:"Enviado",en:"Shipped",it:"Spedito"},
  partiel:{fr:"Partiel",es:"Parcial",en:"Partial",it:"Parziale"},
  livre:{fr:"Livré",es:"Entregado",en:"Delivered",it:"Consegnato"},
  enAttente:{fr:"En attente",es:"Pendiente",en:"Pending",it:"In attesa"},
  enPrepa:{fr:"En prépa.",es:"En prep.",en:"Preparing",it:"In preparazione"},
  facture:{fr:"Facturé",es:"Facturado",en:"Invoiced",it:"Fatturato"},
  paye:{fr:"Payé",es:"Pagado",en:"Paid",it:"Pagato"},
  statutCmd:{fr:"Statut commande",es:"Estado pedido",en:"Order status",it:"Stato ordine"},
  statutPay:{fr:"Statut paiement",es:"Estado pago",en:"Payment status",it:"Stato pagamento"},
  tracking:{fr:"N° de suivi",es:"N° seguimiento",en:"Tracking",it:"Tracciamento"},
  notesInt:{fr:"Notes internes",es:"Notas internas",en:"Notes",it:"Note"},
  canal:{fr:"Canal",es:"Canal",en:"Channel",it:"Canale"},
  nouveau:{fr:"+ Nouveau",es:"+ Nuevo",en:"+ New",it:"+ Nuovo"},
  nouveauClient:{fr:"Nouveau client",es:"Nuevo cliente",en:"New client",it:"Nuovo cliente"},
  boutique:{fr:"Boutique",es:"Tienda",en:"Store",it:"Negozio"},
  contact:{fr:"Contact",es:"Contacto",en:"Contact",it:"Contatto"},
  ville:{fr:"Ville",es:"Ciudad",en:"City",it:"Città"},
  pays:{fr:"Pays",es:"País",en:"Country",it:"Paese"},
  prospect:{fr:"Prospect",es:"Prospecto",en:"Prospect",it:"Potenziale"},
  actif:{fr:"Actif",es:"Activo",en:"Active",it:"Attivo"},
  condComm:{fr:"Conditions commerciales",es:"Condiciones comerciales",en:"Commercial terms",it:"Condizioni commerciali"},
  tarifAuto:{fr:"Tarif auto (volume)",es:"Tarifa auto (volumen)",en:"Auto tier (volume)",it:"Tariffa automatica (volume)"},
  prixFixe:{fr:"Prix fixe personnalisé",es:"Precio fijo personalizado",en:"Custom fixed price",it:"Prezzo fisso"},
  prixUnit:{fr:"Prix unitaire fixe (€)",es:"Precio unitario fijo (€)",en:"Fixed unit price (€)",it:"Prezzo unitario"},
  prixAutoDesc:{fr:"Calculé selon le volume",es:"Calculado según volumen",en:"Calculated by volume",it:"Calcolato per volume"},
  prixFixeDesc:{fr:"S'applique à toutes ses commandes",es:"Se aplica a todos sus pedidos",en:"Applies to all orders",it:"Si applica a tutti gli ordini"},
  enregistrerCond:{fr:"Enregistrer",es:"Guardar",en:"Save",it:"Salva"},
  notesComm:{fr:"Notes commerciales",es:"Notas comerciales",en:"Commercial notes",it:"Note commerciali"},
  ventesTot:{fr:"Ventes totales",es:"Ventas totales",en:"Total sales",it:"Vendite totali"},
  commTot:{fr:"Commission totale",es:"Comisión total",en:"Total commission",it:"Commissione totale"},
  percue:{fr:"Perçue",es:"Cobrada",en:"Collected",it:"Incassata"},
  aPercevoir:{fr:"À percevoir",es:"Pendiente",en:"Pending",it:"Da incassare"},
  dernieresCmd:{fr:"Dernières commandes",es:"Últimos pedidos",en:"Recent orders",it:"Ordini recenti"},
  mesClients:{fr:"Mes clients",es:"Mis clientes",en:"My clients",it:"I miei clienti"},
  stockBas:{fr:"Stock bas",es:"Stock bajo",en:"Low stock",it:"Stock basso"},
  promosActives:{fr:"Promotions",es:"Promociones",en:"Promotions",it:"Promozioni"},
  promosSub:{fr:"Offres actives",es:"Ofertas activas",en:"Active offers",it:"Offerte attive"},
  active:{fr:"Active",es:"Activa",en:"Active",it:"Attivo"},
  inactive:{fr:"Inactive",es:"Inactiva",en:"Inactive",it:"Inattivo"},
  tableauBord:{fr:"Tableau de bord",es:"Panel de control",en:"Dashboard",it:"Pannello di controllo"},
  ca:{fr:"CA",es:"Facturación",en:"Revenue",it:"Fatturato"},
  canaux:{fr:"Canaux",es:"Canales",en:"Channels",it:"Canali"},
  prixCustom:{fr:"Prix custom",es:"Precio custom",en:"Custom pricing",it:"Prezzo personalizzato"},
  tousStandard:{fr:"Tous au tarif standard",es:"Todos en tarifa estándar",en:"All standard",it:"Tutti standard"},
  gestionStock:{fr:"Gestion du stock",es:"Gestión de stock",en:"Stock management",it:"Gestione stock"},
  nouveauProduit:{fr:"+ Produit",es:"+ Producto",en:"+ Product",it:"+ Prodotto"},
  editer:{fr:"Éditer",es:"Editar",en:"Edit",it:"Modifica"},
  editerStock:{fr:"Éditer le stock",es:"Editar stock",en:"Edit stock",it:"Modifica stock"},
  stockActuel:{fr:"Stock actuel",es:"Stock actual",en:"Current stock",it:"Stock attuale"},
  nouveauStock:{fr:"Nouveau stock",es:"Nuevo stock",en:"New stock",it:"Nuovo stock"},
  mettreAJour:{fr:"Mettre à jour",es:"Actualizar",en:"Update",it:"Aggiorna"},
  ajouterCat:{fr:"Ajouter",es:"Añadir",en:"Add",it:"Aggiungi"},
  modele:{fr:"Modèle",es:"Modelo",en:"Model",it:"Modello"},
  couleur:{fr:"Couleur",es:"Color",en:"Color",it:"Colore"},
  categorie:{fr:"Catégorie",es:"Categoría",en:"Category",it:"Categoria"},
  stockInit:{fr:"Stock initial",es:"Stock inicial",en:"Initial stock",it:"Stock iniziale"},
  nouvFacture:{fr:"+ Facture",es:"+ Factura",en:"+ Invoice",it:"+ Fattura"},
  genererPDF:{fr:"PDF",es:"PDF",en:"PDF",it:"PDF"},
  resVisuelles:{fr:"Ressources visuelles",es:"Recursos visuales",en:"Visual resources",it:"Risorse visive"},
  resSub:{fr:"Photos et assets pour votre boutique",es:"Fotos y assets para tu tienda",en:"Photos and assets for your store",it:"Foto e materiali per il tuo negozio"},
  telecharger:{fr:"Télécharger",es:"Descargar",en:"Download",it:"Scarica"},
  commission:{fr:"Commission",es:"Comisión",en:"Commission",it:"Commissione"},
  choisirClient:{fr:"— Choisir un client —",es:"— Elegir cliente —",en:"— Select client —",it:"— Seleziona cliente —"},
  email:{fr:"Email",es:"Email",en:"Email",it:"Email"},
  motDePasse:{fr:"Mot de passe",es:"Contraseña",en:"Password",it:"Password"},
  errLogin:{fr:"Email ou mot de passe incorrect",es:"Email o contraseña incorrectos",en:"Incorrect email or password",it:"Errore di accesso"},
  accesDemo:{fr:"Comptes de démo",es:"Cuentas de demo",en:"Demo accounts",it:"Account demo"},
  utilisateurs:{fr:"Utilisateurs",es:"Usuarios",en:"Users",it:"Utenti"},
  gestionUsers:{fr:"Gestion des utilisateurs",es:"Gestión de usuarios",en:"User management",it:"Gestione utenti"},
  recomendaciones:{fr:"Recommandations",es:"Recomendaciones",en:"Recommendations",it:"Raccomandazioni"},
  recomendarA:{fr:"Recommander à",es:"Recomendar a",en:"Recommend to",it:"Raccomanda a"},
  diseñosRecomendados:{fr:"Modèles recommandés pour vous",es:"Diseños recomendados para ti",en:"Models recommended for you",it:"Modelli consigliati per te"},
  pagoPendiente:{fr:"Paiement en attente",es:"Pago pendiente",en:"Payment pending",it:"Pagamento in sospeso"},
  pagosPendientes:{fr:"paiements en attente",es:"pagos pendientes",en:"payments pending",it:"pagamenti in sospeso"},
  revisaPedidos:{fr:"Vérifiez vos commandes pour voir les options de paiement",es:"Revisa tus pedidos para ver las opciones de pago",en:"Check your orders to see payment options",it:"Controlla i tuoi ordini per vedere le opzioni di pagamento"},
  verPedido:{fr:"Voir commande",es:"Ver pedido",en:"View order",it:"Vedi ordine"},
  proximoTramoLbl:{fr:"PROCHAIN PALIER",es:"PRÓXIMO TRAMO",en:"NEXT TIER",it:"PROSSIMO LIVELLO"},
  paraPrecio:{fr:"pour prix",es:"para precio",en:"for price",it:"per prezzo"},
  porUd:{fr:"/u",es:"/ud",en:"/u",it:"/u"},
  seguirComprando:{fr:"Continuer les achats",es:"Seguir comprando",en:"Continue shopping",it:"Continua a comprare"},
  hasAhorrado:{fr:"VOUS AVEZ ÉCONOMISÉ",es:"HAS AHORRADO",en:"YOU SAVED",it:"HAI RISPARMIATO"},
  vsRetail:{fr:"vs. prix retail",es:"vs. precio retail",en:"vs. retail price",it:"vs. prezzo al dettaglio"},
  enUnidadesCompradas:{fr:"sur %n unités achetées",es:"en %n unidades compradas",en:"on %n units purchased",it:"su %n unità acquistate"},
  prontoPagoLbl:{fr:"⚡ PAIEMENT ANTICIPÉ",es:"⚡ PRONTO PAGO",en:"⚡ EARLY PAYMENT",it:"⚡ PAGAMENTO ANTICIPATO"},
  prontoPagoDesc:{fr:"3% de remise si vous payez %id sous 7 jours",es:"3% descuento si pagas %id en 7 días",en:"3% discount if you pay %id within 7 days",it:"3% di sconto se paghi %id entro 7 giorni"},
  esperandoConfirmacion:{fr:"En attente de confirmation de Minuë pour activer le paiement. Vous recevrez un email avec les instructions.",es:"Esperando confirmación de Minuë para activar el pago. Recibirás un email con las instrucciones.",en:"Waiting for Minuë confirmation to activate payment. You will receive an email with instructions.",it:"In attesa della conferma di Minuë per attivare il pagamento. Riceverai un'email con le istruzioni."},
  pagoDelPedido:{fr:"Paiement de la commande",es:"Pago del pedido",en:"Order payment",it:"Pagamento dell'ordine"},
  metodo:{fr:"Méthode",es:"Método",en:"Method",it:"Metodo"},
  pagarAhora:{fr:"Payer maintenant",es:"Pagar ahora",en:"Pay now",it:"Paga ora"},
  pendienteGenerarLink:{fr:"En attente de génération du lien de paiement. Nous vous préviendrons bientôt.",es:"Pendiente de generar link de pago. Te avisaremos pronto.",en:"Pending payment link generation. We'll notify you soon.",it:"In attesa di generazione del link di pagamento. Ti avviseremo presto."},
  notifConfigPago:{fr:"configurer le paiement",es:"configurar pago",en:"configure payment",it:"configurare pagamento"},
  notifPagoVencido:{fr:"⚠ Paiement échu:",es:"⚠ Pago vencido:",en:"⚠ Overdue payment:",it:"⚠ Pagamento scaduto:"},
  notifCobrado:{fr:"💰 Encaissé:",es:"💰 Cobrado:",en:"💰 Paid:",it:"💰 Incassato:"},
  notifSolicitaAcceso:{fr:"demande l'accès",es:"solicita acceso",en:"requests access",it:"richiede l'accesso"},
  notifAgotado:{fr:"📦 Épuisé:",es:"📦 Agotado:",en:"📦 Out of stock:",it:"📦 Esaurito:"},
  notifStockBajo:{fr:"⚡ Stock faible:",es:"⚡ Stock bajo:",en:"⚡ Low stock:",it:"⚡ Stock basso:"},
  notifPagoPendiente:{fr:"💳 Paiement en attente:",es:"💳 Pago pendiente:",en:"💳 Payment pending:",it:"💳 Pagamento in sospeso:"},
  notifEnviado:{fr:"🚚 Votre commande %id a été expédiée",es:"🚚 Tu pedido %id ha sido enviado",en:"🚚 Your order %id has been shipped",it:"🚚 Il tuo ordine %id è stato spedito"},
  notifEnPrepa:{fr:"📦 %id en préparation",es:"📦 %id está en preparación",en:"📦 %id is being prepared",it:"📦 %id in preparazione"},
  notifEntregado:{fr:"✓ %id livré",es:"✓ %id entregado",en:"✓ %id delivered",it:"✓ %id consegnato"},
  notifRecoParaTi:{fr:"✨ Recommandation pour vous:",es:"✨ Recomendación para ti:",en:"✨ Recommendation for you:",it:"✨ Raccomandazione per te:"},
  notifPromoActiva:{fr:"Promo active",es:"Promo activa",en:"Active promo",it:"Promo attiva"},
  notifDistEnviado:{fr:"🚚 %id envoyé à",es:"🚚 %id enviado a",en:"🚚 %id shipped to",it:"🚚 %id spedito a"},
  notifPendienteCobro:{fr:"💰 En attente d'encaissement:",es:"💰 Pendiente cobro:",en:"💰 Pending payment:",it:"💰 In attesa di incasso:"},
  notifTituloPanel:{fr:"Notifications",es:"Notificaciones",en:"Notifications",it:"Notifiche"},
  notifPendientes:{fr:"en attente",es:"pendientes",en:"pending",it:"in sospeso"},
  notifPendiente:{fr:"en attente",es:"pendiente",en:"pending",it:"in sospeso"},
  notifTodoAlDia:{fr:"✓ Tout est à jour",es:"✓ Todo al día",en:"✓ All up to date",it:"✓ Tutto aggiornato"},
  precioEspecial:{fr:"Votre tarif spécial",es:"Tu precio especial",en:"Your special price",it:"Il tuo prezzo speciale"},
  precioEspecialDesc:{fr:"En tant que client privilégié, vous bénéficiez d'un tarif unique par unité",es:"Como cliente preferente tienes un precio único por unidad",en:"As a preferred client you have a single unit price",it:"Come cliente privilegiato hai un prezzo unico per unità"},
  fundasPreferidos:{fr:"Couleurs d'étuis préférées",es:"Colores de funda preferidos",en:"Preferred case colors",it:"Colori custodia preferiti"},
  fundasDesc:{fr:"Sélectionnez une ou plusieurs couleurs. Expédié selon disponibilité du stock.",es:"Selecciona uno o varios colores. Se enviará según disponibilidad de stock.",en:"Select one or more colors. Shipped subject to stock availability.",it:"Seleziona uno o più colori. Spedito in base alla disponibilità."},
  coloresSeleccionados:{fr:"%n couleurs sélectionnées — expédié selon disponibilité",es:"%n colores seleccionados — enviaremos según disponibilidad",en:"%n colors selected — shipped per availability",it:"%n colori selezionati — spediremo secondo disponibilità"},
  sinStockBtn:{fr:"Rupture",es:"Sin stock",en:"Out of stock",it:"Esaurito"},
  direccionEnvio:{fr:"Adresse de livraison",es:"Dirección de envío",en:"Shipping address",it:"Indirizzo di consegna"},
  miDireccion:{fr:"📌 Mon adresse enregistrée",es:"📌 Mi dirección guardada",en:"📌 My saved address",it:"📌 Il mio indirizzo salvato"},
  nuevaDireccion:{fr:"➕ Nouvelle adresse",es:"➕ Nueva dirección",en:"➕ New address",it:"➕ Nuovo indirizzo"},
  calleNum:{fr:"Rue et numéro",es:"Calle y número",en:"Street and number",it:"Via e numero"},
  codigoPostal:{fr:"Code postal",es:"Código postal",en:"Postal code",it:"Codice postale"},
  ciudadInput:{fr:"Ville",es:"Ciudad",en:"City",it:"Città"},
  paisInput:{fr:"Pays",es:"País",en:"Country",it:"Paese"},
  fechaPreferente:{fr:"Date de livraison préférée",es:"Fecha preferente de entrega",en:"Preferred delivery date",it:"Data di consegna preferita"},
  fechaPreferenteDesc:{fr:"Si vous avez une préférence, indiquez-nous quand vous souhaitez recevoir la commande",es:"Si tienes una preferencia, indicanos cuándo te gustaría recibir el pedido",en:"If you have a preference, tell us when you want to receive the order",it:"Se hai una preferenza, dicci quando vorresti ricevere l'ordine"},
  envioMinimoInfo:{fr:"⏱ Délai de livraison minimum 3-5 jours ouvrables (peut varier en saison de forte demande)",es:"⏱ Envío mínimo 3-5 días laborables (puede variar en temporada de alta demanda)",en:"⏱ Minimum shipping 3-5 business days (may vary in peak season)",it:"⏱ Spedizione minima 3-5 giorni lavorativi (può variare nelle stagioni di alta domanda)"},
  insightsTitle:{fr:"Le saviez-vous ?",es:"¿Sabías que...?",en:"Did you know?",it:"Lo sapevi?"},
  gestionInsights:{fr:"Gérer les insights",es:"Gestionar insights",en:"Manage insights",it:"Gestisci insights"},
  nuevoInsight:{fr:"Nouvel insight",es:"Nuevo insight",en:"New insight",it:"Nuovo insight"},
  iconoLabel:{fr:"Icône",es:"Icono",en:"Icon",it:"Icona"},
  tituloLabel:{fr:"Titre",es:"Título",en:"Title",it:"Titolo"},
  textoLabel:{fr:"Texte",es:"Texto",en:"Text",it:"Testo"},
  activoLabel:{fr:"Actif",es:"Activo",en:"Active",it:"Attivo"},
  precioPorColeccion:{fr:"Prix par collection",es:"Precio por colección",en:"Price by collection",it:"Prezzo per collezione"},
  precioPorColeccionDesc:{fr:"Définissez un prix unitaire spécifique pour chaque collection. Laissez à 0 pour appliquer les tarifs par volume standards.",es:"Define un precio unitario específico por colección. Deja en 0 para aplicar las tarifas por volumen estándar.",en:"Set a specific unit price per collection. Leave at 0 to apply standard volume tiers.",it:"Definisci un prezzo unitario specifico per ogni collezione. Lascia a 0 per applicare le tariffe a volume standard."},
  precioGlobalAlerta:{fr:"⚠ Prix global activé — il remplace les prix par collection",es:"⚠ Precio global activado — sustituye los precios por colección",en:"⚠ Global price active — overrides per-collection prices",it:"⚠ Prezzo globale attivato — sostituisce i prezzi per collezione"},
  oTarifaEstandar:{fr:"(ou tarif standard)",es:"(o tarifa estándar)",en:"(or standard tariff)",it:"(o tariffa standard)"},
  invitadoPor:{fr:"Invité par",es:"Invitado por",en:"Invited by",it:"Invitato da"},
  miEnlaceInvitacion:{fr:"Mon lien d'invitation",es:"Mi enlace de invitación",en:"My invitation link",it:"Il mio link di invito"},
  miEnlaceDesc:{fr:"Partagez ce lien avec les boutiques que vous souhaitez intégrer. Elles seront automatiquement rattachées à vous.",es:"Comparte este enlace con las tiendas que quieras integrar. Quedarán automáticamente vinculadas a ti.",en:"Share this link with stores you want to onboard. They will be auto-linked to you.",it:"Condividi questo link con i negozi che vuoi integrare. Saranno automaticamente collegati a te."},
  copiarEnlace:{fr:"Copier le lien",es:"Copiar enlace",en:"Copy link",it:"Copia link"},
  enlaceCopiado:{fr:"✓ Lien copié",es:"✓ Enlace copiado",en:"✓ Link copied",it:"✓ Link copiato"},
  guiaUsoTitulo:{fr:"Guide d'utilisation",es:"Guía de uso",en:"User guide",it:"Guida all'uso"},
  paso1Titulo:{fr:"Inviter vos boutiques",es:"Invita a tus tiendas",en:"Invite your stores",it:"Invita i tuoi negozi"},
  paso1Desc:{fr:"Copiez votre lien d'invitation et envoyez-le aux boutiques. Elles s'inscrivent et vous sont rattachées automatiquement.",es:"Copia tu enlace de invitación y mándalo a las tiendas. Se registran y quedan vinculadas a ti automáticamente.",en:"Copy your invitation link and send it to stores. They register and are automatically linked to you.",it:"Copia il tuo link di invito e invialo ai negozi. Si registrano e vengono automaticamente collegati a te."},
  paso2Titulo:{fr:"Approbation par Minuë",es:"Aprobación por Minuë",en:"Approval by Minuë",it:"Approvazione da Minuë"},
  paso2Desc:{fr:"Minuë valide chaque nouvelle boutique avant qu'elle puisse passer commande. Cela protège votre territoire.",es:"Minuë valida cada nueva tienda antes de que pueda hacer pedidos. Esto protege tu territorio.",en:"Minuë validates each new store before they can place orders. This protects your territory.",it:"Minuë convalida ogni nuovo negozio prima che possa effettuare ordini. Questo protegge il tuo territorio."},
  paso3Titulo:{fr:"Passer commande pour elles",es:"Haz pedidos por ellas",en:"Place orders for them",it:"Effettua ordini per loro"},
  paso3Desc:{fr:"Vous pouvez passer commande au nom de vos boutiques depuis Catalogue → ajouter au panier → sélectionner la boutique → valider.",es:"Puedes hacer pedidos en nombre de tus tiendas desde Catálogo → añadir al carrito → seleccionar tienda → confirmar.",en:"You can place orders for your stores from Catalog → add to cart → select store → confirm.",it:"Puoi effettuare ordini per i tuoi negozi da Catalogo → aggiungi al carrello → seleziona negozio → conferma."},
  paso4Titulo:{fr:"Suivi de vos commissions",es:"Sigue tus comisiones",en:"Track your commissions",it:"Monitora le tue commissioni"},
  paso4Desc:{fr:"Toutes les commandes de vos boutiques génèrent une commission. Consultez Tableau de bord → KPIs et l'onglet Commandes.",es:"Todos los pedidos de tus tiendas generan comisión. Consulta Dashboard → KPIs y la pestaña Pedidos.",en:"All orders from your stores generate commission. Check Dashboard → KPIs and the Orders tab.",it:"Tutti gli ordini dei tuoi negozi generano commissioni. Controlla Dashboard → KPI e la scheda Ordini."},
  paso5Titulo:{fr:"Pas de gestion de paiements",es:"Sin gestión de pagos",en:"No payment management",it:"Nessuna gestione pagamenti"},
  paso5Desc:{fr:"Vous ne gérez pas les paiements: les boutiques paient directement Minuë. Vous voyez seulement le statut.",es:"Tú no gestionas los pagos: las tiendas pagan directamente a Minuë. Tú solo ves el estado.",en:"You don't handle payments: stores pay Minuë directly. You only see the status.",it:"Non gestisci i pagamenti: i negozi pagano direttamente a Minuë. Vedi solo lo stato."},
  registrarManualmente:{fr:"Enregistrer manuellement une boutique",es:"Dar de alta una tienda manualmente",en:"Manually register a store",it:"Registrare manualmente un negozio"},
  bienvenidaDistribuidor:{fr:"Bienvenue sur votre espace partenaire",es:"Bienvenido a tu espacio de partner",en:"Welcome to your partner space",it:"Benvenuto nel tuo spazio partner"},
  vide:{fr:"vide",es:"vacío",en:"empty",it:"vuoto"},
  resumenPedido:{fr:"Résumé de commande",es:"Resumen del pedido",en:"Order summary",it:"Riepilogo ordine"},
  guiaParaTiendas:{fr:"Comment fonctionne Minuë B2B",es:"Cómo funciona Minuë B2B",en:"How Minuë B2B works",it:"Come funziona Minuë B2B"},
  guiaTienda1Titulo:{fr:"Découvrir le catalogue",es:"Explora el catálogo",en:"Browse the catalog",it:"Esplora il catalogo"},
  guiaTienda1Desc:{fr:"Parcourez nos collections Essential, Icons et Acetato. Sauvegardez vos favoris pour y revenir.",es:"Recorre nuestras colecciones Essential, Icons y Acetato. Guarda tus favoritos para volver fácilmente.",en:"Browse our Essential, Icons and Acetato collections. Save favorites to come back to them easily.",it:"Sfoglia le nostre collezioni Essential, Icons e Acetato. Salva i preferiti per tornarci facilmente."},
  guiaTienda2Titulo:{fr:"Construire votre commande",es:"Construye tu pedido",en:"Build your order",it:"Costruisci il tuo ordine"},
  guiaTienda2Desc:{fr:"Ajoutez au panier. Plus vous commandez, meilleur est le prix unitaire. Vous pouvez sauvegarder un brouillon pour revenir plus tard.",es:"Añade al carrito. Cuanto más pidas, mejor precio por unidad. Puedes guardar como borrador para volver más tarde.",en:"Add to cart. The more you order, the better the unit price. Save as draft to come back later.",it:"Aggiungi al carrello. Più ordini, migliore è il prezzo unitario. Puoi salvare come bozza per tornarci più tardi."},
  guiaTienda3Titulo:{fr:"Valider et payer",es:"Confirmar y pagar",en:"Confirm and pay",it:"Conferma e paga"},
  guiaTienda3Desc:{fr:"Indiquez votre adresse, date préférée et notes. Minuë vous envoie le moyen de paiement (carte, virement, SEPA, échéance).",es:"Indica dirección, fecha preferente y notas. Minuë te envía el medio de pago (tarjeta, transferencia, SEPA, aplazado).",en:"Set address, preferred date and notes. Minuë sends you the payment method (card, transfer, SEPA, deferred).",it:"Indica indirizzo, data preferita e note. Minuë ti invia il metodo di pagamento (carta, bonifico, SEPA, dilazionato)."},
  guiaTienda4Titulo:{fr:"Suivre votre commande",es:"Sigue tu pedido",en:"Track your order",it:"Segui il tuo ordine"},
  guiaTienda4Desc:{fr:"De confirmé → en préparation → expédié → livré. Vous recevez le tracking dès que c'est expédié.",es:"De confirmado → en preparación → enviado → entregado. Recibes el tracking en cuanto sale.",en:"From confirmed → preparing → shipped → delivered. You receive tracking as soon as it ships.",it:"Da confermato → in preparazione → spedito → consegnato. Ricevi il tracking appena spedito."},
  ocultarGuia:{fr:"Masquer le guide",es:"Ocultar la guía",en:"Hide guide",it:"Nascondi la guida"},
  verGuia:{fr:"Voir le guide",es:"Ver la guía",en:"Show guide",it:"Mostra la guida"},
  mensajes:{fr:"Messagerie",es:"Mensajes",en:"Messages",it:"Messaggi"},
  atencionCliente:{fr:"Service client",es:"Atención al cliente",en:"Customer support",it:"Assistenza clienti"},
  nuevoMensaje:{fr:"Nouveau message",es:"Nuevo mensaje",en:"New message",it:"Nuovo messaggio"},
  asunto:{fr:"Sujet",es:"Asunto",en:"Subject",it:"Oggetto"},
  mensaje:{fr:"Message",es:"Mensaje",en:"Message",it:"Messaggio"},
  enviar:{fr:"Envoyer",es:"Enviar",en:"Send",it:"Invia"},
  responder:{fr:"Répondre",es:"Responder",en:"Reply",it:"Rispondi"},
  cerrarConversacion:{fr:"Fermer la conversation",es:"Cerrar conversación",en:"Close conversation",it:"Chiudi conversazione"},
  abrirConversacion:{fr:"Rouvrir",es:"Reabrir",en:"Reopen",it:"Riapri"},
  marcarLeido:{fr:"Marquer comme lu",es:"Marcar como leído",en:"Mark as read",it:"Segna come letto"},
  todasConversaciones:{fr:"Toutes les conversations",es:"Todas las conversaciones",en:"All conversations",it:"Tutte le conversazioni"},
  noLeidos:{fr:"Non lus",es:"No leídos",en:"Unread",it:"Non letti"},
  abiertas:{fr:"Ouvertes",es:"Abiertas",en:"Open",it:"Aperte"},
  cerradas:{fr:"Fermées",es:"Cerradas",en:"Closed",it:"Chiuse"},
  sinMensajes:{fr:"Aucun message pour le moment",es:"Aún no tienes mensajes",en:"No messages yet",it:"Nessun messaggio ancora"},
  iniciaConversacion:{fr:"Démarrez une conversation avec Minuë",es:"Inicia una conversación con Minuë",en:"Start a conversation with Minuë",it:"Avvia una conversazione con Minuë"},
  temaPedido:{fr:"Commande",es:"Pedido",en:"Order",it:"Ordine"},
  temaProducto:{fr:"Produit",es:"Producto",en:"Product",it:"Prodotto"},
  temaFacturacion:{fr:"Facturation",es:"Facturación",en:"Billing",it:"Fatturazione"},
  temaDevolucion:{fr:"Retour",es:"Devolución",en:"Return",it:"Reso"},
  temaComercial:{fr:"Commercial",es:"Comercial",en:"Sales",it:"Commerciale"},
  temaOtro:{fr:"Autre",es:"Otro",en:"Other",it:"Altro"},
  selecTema:{fr:"Sujet du message",es:"Tema del mensaje",en:"Message topic",it:"Argomento messaggio"},
  refPedido:{fr:"Référence commande (optionnel)",es:"Referencia de pedido (opcional)",en:"Order reference (optional)",it:"Riferimento ordine (opzionale)"},
  escribirRespuesta:{fr:"Écrire une réponse...",es:"Escribir una respuesta...",en:"Write a reply...",it:"Scrivi una risposta..."},
  hace:{fr:"il y a",es:"hace",en:"",it:""},
  minutos:{fr:"min",es:"min",en:"min ago",it:"min fa"},
  horas:{fr:"h",es:"h",en:"h ago",it:"h fa"},
  dias:{fr:"j",es:"d",en:"d ago",it:"g fa"},
  conversacionCerrada:{fr:"Conversation fermée",es:"Conversación cerrada",en:"Conversation closed",it:"Conversazione chiusa"},
  nuevaConversacion:{fr:"Nouvelle conversation",es:"Nueva conversación",en:"New conversation",it:"Nuova conversazione"},
  yo:{fr:"Moi",es:"Yo",en:"Me",it:"Io"},
  equipoMinue:{fr:"Équipe Minuë",es:"Equipo Minuë",en:"Minuë Team",it:"Team Minuë"},
  opcional:{fr:"facultatif",es:"opcional",en:"optional",it:"facoltativo"},
  notasPara:{fr:"📝 Notes pour Minuë",es:"📝 Notas para Minuë",en:"📝 Notes for Minuë",it:"📝 Note per Minuë"},
  notasPlaceholder:{fr:"Toute indication particulière sur la commande...",es:"Cualquier indicación especial sobre el pedido...",en:"Any special indication about the order...",it:"Qualsiasi indicazione speciale sull'ordine..."},
  guardarBorrador:{fr:"💾 Sauvegarder brouillon",es:"💾 Guardar borrador",en:"💾 Save draft",it:"💾 Salva bozza"},
  borradoresGuardados:{fr:"💾 Brouillons sauvegardés",es:"💾 Borradores guardados",en:"💾 Saved drafts",it:"💾 Bozze salvate"},
  recuperar:{fr:"Récupérer",es:"Recuperar",en:"Restore",it:"Recupera"},
  borradorGuardado:{fr:"✓ Panier enregistré comme brouillon",es:"✓ Carrito guardado como borrador",en:"✓ Cart saved as draft",it:"✓ Carrello salvato come bozza"},
  agregarRec:{fr:"Ajouter recommandation",es:"Añadir recomendación",en:"Add recommendation",it:"Aggiungi raccomandazione"},
  fundasColor:{fr:"Couleur des étuis",es:"Color de fundas",en:"Case color",it:"Colore custodie"},
  fundaCrema:{fr:"Crème",es:"Crema",en:"Cream",it:"Crema"},
  fundaPistacho:{fr:"Pistache",es:"Pistacho",en:"Pistachio",it:"Pistacchio"},
  fundaBabyBlue:{fr:"Bleu bébé",es:"Baby Blue",en:"Baby Blue",it:"Azzurro bebé"},
  fundaYellowAmalfi:{fr:"Jaune Amalfi",es:"Amarillo Amalfi",en:"Amalfi Yellow",it:"Giallo Amalfi"},
  fundaNaranja:{fr:"Orange",es:"Naranja",en:"Orange",it:"Arancione"},
  sinStock:{fr:"Rupture",es:"Sin stock",en:"Out of stock",it:"Esaurito"},
  preferenciaColorFunda:{fr:"Préférence couleur d'étui",es:"Preferencia color de funda",en:"Case color preference",it:"Preferenza colore custodia"},
  empleados:{fr:"Employés",es:"Empleados",en:"Employees",it:"Dipendenti"},
  fichaje:{fr:"Pointage",es:"Fichaje",en:"Clock in/out",it:"Timbratura"},
  ficharEntrada:{fr:"Pointer l'entrée",es:"Fichar entrada",en:"Clock in",it:"Timbra entrata"},
  ficharSalida:{fr:"Pointer la sortie",es:"Fichar salida",en:"Clock out",it:"Timbra uscita"},
  fichado:{fr:"Pointé",es:"Fichado",en:"Clocked in",it:"Timbrato"},
  noFichado:{fr:"Non pointé",es:"Sin fichar",en:"Not clocked in",it:"Non timbrato"},
  horasHoy:{fr:"Heures aujourd'hui",es:"Horas hoy",en:"Hours today",it:"Ore oggi"},
  horasSemana:{fr:"Heures cette semaine",es:"Horas esta semana",en:"Hours this week",it:"Ore questa settimana"},
  horasMes:{fr:"Heures ce mois",es:"Horas este mes",en:"Hours this month",it:"Ore questo mese"},
  totalHoras:{fr:"Total heures",es:"Total horas",en:"Total hours",it:"Totale ore"},
  fueraDeRango:{fr:"Vous êtes trop loin du bureau",es:"Estás fuera del rango de la oficina",en:"You are too far from the office",it:"Sei troppo lontano dall'ufficio"},
  distanciaActual:{fr:"Distance actuelle",es:"Distancia actual",en:"Current distance",it:"Distanza attuale"},
  ubicacionNoDisponible:{fr:"Localisation non disponible",es:"Ubicación no disponible",en:"Location not available",it:"Posizione non disponibile"},
  historialFichajes:{fr:"Historique pointages",es:"Historial fichajes",en:"Clock history",it:"Storico timbrature"},
  entrada:{fr:"Entrée",es:"Entrada",en:"In",it:"Entrata"},
  salida:{fr:"Sortie",es:"Salida",en:"Out",it:"Uscita"},
  sinFichajes:{fr:"Aucun pointage",es:"Sin fichajes",en:"No records",it:"Nessuna timbratura"},
  diasTrabajados:{fr:"Jours travaillés",es:"Días trabajados",en:"Days worked",it:"Giorni lavorati"},
  mediaHoras:{fr:"Moyenne heures/jour",es:"Media horas/día",en:"Avg hours/day",it:"Media ore/giorno"},
  nouvelUser:{fr:"+ Utilisateur",es:"+ Usuario",en:"+ User",it:"+ Utente"},
  nouveauUser:{fr:"Nouvel utilisateur",es:"Nuevo usuario",en:"New user",it:"Nuovo utente"},
  editUser:{fr:"Modifier l'utilisateur",es:"Editar usuario",en:"Edit user",it:"Modifica utente"},
  roleLabel:{fr:"Rôle",es:"Rol",en:"Role",it:"Ruolo"},
  emailLabel:{fr:"Email",es:"Email",en:"Email",it:"Email"},
  pwLabel:{fr:"Mot de passe",es:"Contraseña",en:"Password",it:"Password"},
  entreprise:{fr:"Entreprise",es:"Empresa",en:"Company",it:"Azienda"},
  commissionRate:{fr:"Commission %",es:"Comisión %",en:"Commission %",it:"Commissione %"},
  langue:{fr:"Langue",es:"Idioma",en:"Language",it:"Lingua"},
  desactiver:{fr:"Désactiver",es:"Desactivar",en:"Disable",it:"Disattiva"},
  userActif:{fr:"Actif",es:"Activo",en:"Active",it:"Attivo"},
  userInactif:{fr:"Désactivé",es:"Desactivado",en:"Disabled",it:"Disattivato"},
  gestionPromos:{fr:"Gestion des promos",es:"Gestión de promos",en:"Promo management",it:"Gestione promo"},
  nouvellePromo:{fr:"+ Promo",es:"+ Promo",en:"+ Promo",it:"+ Promo"},
  nouveauPromo:{fr:"Nouvelle promotion",es:"Nueva promoción",en:"New promotion",it:"Nuova promozione"},
  editPromo:{fr:"Modifier la promo",es:"Editar promo",en:"Edit promo",it:"Modifica promo"},
  nomPromo:{fr:"Nom",es:"Nombre",en:"Name",it:"Nome"},
  typePromo:{fr:"Type",es:"Tipo",en:"Type",it:"Tipo"},
  reduction:{fr:"Réduction %",es:"Descuento %",en:"Discount %",it:"Sconto"},
  conditionFr:{fr:"Condition (FR)",es:"Condición (FR)",en:"Condition (FR)",it:"Condizione (FR)"},
  conditionEs:{fr:"Condition (ES)",es:"Condición (ES)",en:"Condition (ES)",it:"Condizione (ES)"},
  conditionEn:{fr:"Condition (EN)",es:"Condición (EN)",en:"Condition (EN)",it:"Condizione (EN)"},
  visiblePour:{fr:"Visible pour",es:"Visible para",en:"Visible to",it:"Visibile a"},
  percent:{fr:"Pourcentage",es:"Porcentaje",en:"Percentage",it:"Percentuale"},
  cadeau:{fr:"Cadeau",es:"Regalo",en:"Gift",it:"Omaggio"},
  promosClient:{fr:"Promotions en cours",es:"Promociones activas",en:"Current promotions",it:"Promozioni attive"},
  monCompte:{fr:"Mon compte",es:"Mi cuenta",en:"My account",it:"Il mio account"},
  donneesEntreprise:{fr:"Données entreprise",es:"Datos empresa",en:"Company details",it:"Dati aziendali"},
  raisonSociale:{fr:"Raison sociale",es:"Razón social",en:"Company name",it:"Ragione sociale"},
  nif:{fr:"NIF / TVA",es:"NIF / CIF",en:"Tax ID",it:"P. IVA"},
  adresse:{fr:"Adresse",es:"Dirección",en:"Address",it:"Indirizzo"},
  codePostal:{fr:"Code postal",es:"Código postal",en:"Postal code",it:"CAP"},
  telephone:{fr:"Téléphone",es:"Teléfono",en:"Phone",it:"Telefono"},
  donneesBancaires:{fr:"Données bancaires",es:"Datos bancarios",en:"Banking details",it:"Dati bancari"},
  iban:{fr:"IBAN",es:"IBAN",en:"IBAN",it:"IBAN"},
  bic:{fr:"BIC / SWIFT",es:"BIC / SWIFT",en:"BIC / SWIFT",it:"BIC / SWIFT"},
  titulaire:{fr:"Titulaire du compte",es:"Titular de la cuenta",en:"Account holder",it:"Intestatario"},
  sauvegarder:{fr:"Sauvegarder",es:"Guardar",en:"Save",it:"Salva"},
  donneesSauvees:{fr:"Données sauvegardées",es:"Datos guardados",en:"Data saved",it:"Dati salvati"},
  nouveautes:{fr:"Nouveautés",es:"Novedades",en:"What's new",it:"Novità"},
  nouveautesSub:{fr:"Recommandations et actualités",es:"Recomendaciones y novedades",en:"Recommendations and news",it:"Consigli e novità"},
  gestionNouveautes:{fr:"Gestion des nouveautés",es:"Gestión de novedades",en:"News management",it:"Gestione novità"},
  nouvelleNouveaute:{fr:"+ Nouveauté",es:"+ Novedad",en:"+ News",it:"+ Novità"},
  titreNouveaute:{fr:"Titre",es:"Título",en:"Title",it:"Titolo"},
  contenu:{fr:"Contenu",es:"Contenido",en:"Content",it:"Contenuto"},
  datePublication:{fr:"Date",es:"Fecha",en:"Date",it:"Data"},
  epingle:{fr:"Épinglé",es:"Fijado",en:"Pinned",it:"In evidenza"},
  topVenta:{fr:"Top vente",es:"Top venta",en:"Best seller",it:"Bestseller"},
  nuevo:{fr:"Nouveau",es:"Nuevo",en:"New",it:"Nuovo"},
  recomendado:{fr:"Recommandé",es:"Recomendado",en:"Recommended",it:"Consigliato"},
  etiquetas:{fr:"Étiquettes",es:"Etiquetas",en:"Tags",it:"Tag"},
  notesClient:{fr:"Note pour le client",es:"Nota para el cliente",en:"Note for customer",it:"Note cliente"},
  noteDuCmd:{fr:"Note de Minuë",es:"Nota de Minuë",en:"Note from Minuë",it:"Nota da Minuë"},
  lienUrl:{fr:"Lien (URL)",es:"Enlace (URL)",en:"Link (URL)",it:"Link (URL)"},
  voirPlus:{fr:"Voir plus",es:"Ver más",en:"Read more",it:"Leggi tutto"},
  factureDetail:{fr:"Détail facture",es:"Detalle factura",en:"Invoice detail",it:"Dettaglio fattura"},
  sousTotal:{fr:"Sous-total",es:"Subtotal",en:"Subtotal",it:"Subtotale"},
  tva:{fr:"TVA 21%",es:"IVA 21%",en:"VAT 21%",it:"IVA 21%"},
  totalTTC:{fr:"Total TTC",es:"Total con IVA",en:"Total incl. VAT",it:"Totale"},
  factureNum:{fr:"Facture",es:"Factura",en:"Invoice",it:"Fattura"},
  emetteur:{fr:"Émetteur",es:"Emisor",en:"From",it:"Da"},
  destinataire:{fr:"Destinataire",es:"Destinatario",en:"To",it:"A"},
  aide:{fr:"Aide",es:"Ayuda",en:"Help",it:"Aiuto"},
  faq:{fr:"Questions fréquentes",es:"Preguntas frecuentes",en:"FAQ",it:"FAQ"},
  faqSub:{fr:"Trouvez votre réponse",es:"Encuentra tu respuesta",en:"Find your answer",it:"Trova la tua risposta"},
  nouvelleFaq:{fr:"+ Question",es:"+ Pregunta",en:"+ Question",it:"+ Domanda"},
  questionLabel:{fr:"Question",es:"Pregunta",en:"Question",it:"Domanda"},
  reponseLabel:{fr:"Réponse",es:"Respuesta",en:"Answer",it:"Risposta"},
  detailCmd:{fr:"Détail de la commande",es:"Detalle del pedido",en:"Order detail",it:"Dettaglio ordine"},
  artSupprime:{fr:"retiré (rupture de stock)",es:"retirado (rotura de stock)",en:"removed (out of stock)",it:"rimosso (esaurito)"},
  supprimerLigne:{fr:"Retirer",es:"Retirar",en:"Remove",it:"Rimuovi"},
  fraisEnvoi:{fr:"Frais d'envoi",es:"Gastos de envío",en:"Shipping cost",it:"Costi spedizione"},
  envoiInclus:{fr:"Envoi inclus",es:"Envío incluido",en:"Shipping included",it:"Spedizione inclusa"},
  resPhotos:{fr:"Photos produit HD",es:"Fotos producto HD",en:"Product photos HD",it:"Foto prodotto HD"},
  resLifestyle:{fr:"Photos lifestyle",es:"Fotos lifestyle",en:"Lifestyle photos",it:"Foto lifestyle"},
  resLogos:{fr:"Logos Minuë",es:"Logos Minuë",en:"Minuë logos",it:"Loghi Minuë"},
  resTextes:{fr:"Textes commerciaux",es:"Textos comerciales",en:"Commercial texts",it:"Testi commerciali"},
  resCatalogue:{fr:"Catalogue PDF SS26",es:"Catálogo PDF SS26",en:"SS26 PDF Catalog",it:"Catalogo PDF SS26"},
  resGuide:{fr:"Guide de vente",es:"Guía de venta",en:"Sales guide",it:"Guida vendita"},
  acceder:{fr:"Accéder",es:"Acceder",en:"Access",it:"Accedi"},
  transporteur:{fr:"Transporteur",es:"Transportista",en:"Carrier",it:"Corriere"},
  urlSuivi:{fr:"URL de suivi",es:"URL de seguimiento",en:"Tracking URL",it:"URL tracciamento"},
  suivreColis:{fr:"Suivre le colis",es:"Seguir envío",en:"Track shipment",it:"Traccia spedizione"},
  astucePrix:{fr:"Plus vous commandez, moins cher le prix unitaire ! Consultez Tarifs pour voir les paliers.",es:"¡Cuantas más unidades, menor el precio! Consulta Tarifas para ver los tramos.",en:"The more you order, the lower the unit price! Check Pricing for volume tiers.",it:"Più ordini, più basso il prezzo unitario! Consulta le Tariffe."},
  prixFixeClient:{fr:"Prix négocié",es:"Precio negociado",en:"Negotiated price",it:"Prezzo negoziato"},
  eliminarCmd:{fr:"Supprimer la commande",es:"Eliminar pedido",en:"Delete order",it:"Elimina ordine"},
  eliminar:{fr:"Supprimer",es:"Eliminar",en:"Delete",it:"Elimina"},
  eliminarTarea:{fr:"Supprimer la tâche",es:"Eliminar tarea",en:"Delete task",it:"Elimina compito"},
  telephone:{fr:"Téléphone",es:"Teléfono",en:"Phone",it:"Telefono"},
  ville:{fr:"Ville",es:"Ciudad",en:"City",it:"Città"},
  pays:{fr:"Pays",es:"País",en:"Country",it:"Paese"},
  notesUser:{fr:"Notes internes",es:"Notas internas",en:"Internal notes",it:"Note interne"},
  panierMoyen:{fr:"Panier moyen",es:"Ticket medio",en:"Avg. order",it:"Ordine medio"},
  voirTout:{fr:"Voir tout",es:"Ver todo",en:"See all",it:"Vedi tutto"},
  stockBajo:{fr:"Stock faible",es:"Stock bajo",en:"Low stock",it:"Stock basso"},
  accueil:{fr:"Accueil",es:"Inicio",en:"Home",it:"Home"},
  bienvenida:{fr:"Bonjour",es:"Hola",en:"Hello",it:"Benvenuto/a"},
  bienvenidaSub:{fr:"Ravie de vous revoir. Voici les dernières nouveautés pour vous.",es:"Encantados de verte. Aquí tienes lo último para ti.",en:"Great to see you. Here's what's new for you.",it:"Bello rivederti. Ecco le novità per te."},
  descubrirCol:{fr:"Découvrir la collection",es:"Descubrir la colección",en:"Discover the collection",it:"Scopri la collezione"},
  recoPour:{fr:"Sélection pour vous",es:"Seleccionados para ti",en:"Selected for you",it:"Selezionato per te"},
  dernieresNouv:{fr:"Actualités",es:"Novedades",en:"What's new",it:"Novità"},
  promosActives:{fr:"Offres en cours",es:"Ofertas activas",en:"Active offers",it:"Promozioni"},
  solliciterAcces:{fr:"Demander l'accès",es:"Solicitar acceso",en:"Request access",it:"Richiedi accesso"},
  retourLogin:{fr:"← Retour à la connexion",es:"← Volver al inicio de sesión",en:"← Back to login",it:"Torna al login"},
  envoyerDemande:{fr:"Envoyer",es:"Enviar",en:"Submit",it:"Invia"},
  demandeEnvoyee:{fr:"Demande reçue!Notre équipe reviendra vers vous sous 24h.",es:"Solicitud recibida!Nuestro equipo te contactará en menos de 24h.",en:"Request received!Our team will get back to you within 24h.",it:"Richiesta ricevuta!Il nostro team ti contatterà entro 24 ore."},
  pwNoMatch:{fr:"Les mots de passe ne correspondent pas",es:"Las contraseñas no coinciden",en:"Passwords don't match",it:"Le password non coincidono"},
  confirmerPw:{fr:"Confirmer mot de passe",es:"Confirmar contraseña",en:"Confirm password",it:"Conferma password"},
  webInstagram:{fr:"Site web / Instagram",es:"Web / Instagram",en:"Website / Instagram",it:"Sito web / Instagram"},
  messageSolicitud:{fr:"Un mot sur votre boutique",es:"Cuéntanos sobre tu tienda",en:"A word about your store",it:"Una parola sul tuo negozio"},
  solicitudSub:{fr:"Plateforme wholesale exclusive pour retailers sélectionnés.",es:"Plataforma wholesale exclusiva para retailers seleccionados.",en:"Exclusive wholesale platform for selected retailers.",it:"Piattaforma wholesale esclusiva per retailer selezionati."},
  pendientes:{fr:"En attente",es:"Pendientes",en:"Pending",it:"In attesa"},
  solicitudes:{fr:"demandes d'accès",es:"solicitudes de acceso",en:"access requests",it:"Richieste"},
  activerCompte:{fr:"Activer le compte",es:"Activar cuenta",en:"Activate account",it:"Attiva account"},
  monProfil:{fr:"Mon profil",es:"Mi perfil",en:"My profile",it:"Il mio profilo"},
  fermer:{fr:"Fermer",es:"Cerrar",en:"Close",it:"Chiudi"},
  topVentas:{fr:"Meilleures ventes",es:"Top ventas",en:"Top sales",it:"Top vendite"},
  clientsPays:{fr:"Clients par pays",es:"Clientes por país",en:"Clients by country",it:"Clienti per paese"},
  codePostal:{fr:"Code postal",es:"Código postal",en:"Postal code",it:"CAP"},
  rechercherClient:{fr:"Rechercher client...",es:"Buscar cliente...",en:"Search client...",it:"Cerca cliente..."},
  echeance:{fr:"Échéance",es:"Vencimiento",en:"Due date",it:"Scadenza"},
  assignee:{fr:"Assigné à",es:"Asignado a",en:"Assigned to",it:"Assegnato a"},
  enRetard:{fr:"En retard",es:"Atrasada",en:"Overdue",it:"In ritardo"},
  sansEcheance:{fr:"Sans échéance",es:"Sin vencimiento",en:"No due date",it:"Senza scadenza"},
  deconnexion:{fr:"Déconnexion",es:"Cerrar sesión",en:"Log out",it:"Disconnetti"},
  filtrerStatus:{fr:"État",es:"Estado",en:"Status",it:"Stato"},
  filtrerPay:{fr:"Paiement",es:"Pago",en:"Payment",it:"Pagamento"},
  rechercherProd:{fr:"Rechercher produit...",es:"Buscar producto...",en:"Search product...",it:"Cerca prodotto..."},
  agotado:{fr:"Rupture",es:"Agotado",en:"Out of stock",it:"Esaurito"},
  alerteStock:{fr:"Alerte stock",es:"Alerta stock",en:"Stock alert",it:"Allerta stock"},
  notifTitre:{fr:"Mises à jour",es:"Novedades de pedidos",en:"Order updates",it:"Aggiornamenti ordine"},
  notifStatus:{fr:"Votre commande %s est passée à",es:"Tu pedido %s ha cambiado a",en:"Your order %s changed to",it:"Il tuo ordine %s è cambiato in"},
  datosPersonales:{fr:"Données personnelles",es:"Datos personales",en:"Personal info",it:"Dati personali"},
  dirEnvio:{fr:"Adresse de livraison",es:"Dirección de envío",en:"Shipping address",it:"Indirizzo di spedizione"},
  dirFacturacion:{fr:"Données de facturation",es:"Datos de facturación",en:"Billing info",it:"Dati fatturazione"},
  direccion:{fr:"Adresse",es:"Dirección",en:"Address",it:"Indirizzo"},
  fichaCliente:{fr:"Fiche client",es:"Ficha del cliente",en:"Client file",it:"Scheda cliente"},
  condiciones:{fr:"Conditions commerciales",es:"Condiciones comerciales",en:"Commercial terms",it:"Condizioni"},
  notesCmd:{fr:"Notes pour cette commande",es:"Notas para este pedido",en:"Notes for this order",it:"Note per questo ordine"},
  notesPlaceholder:{fr:"Instructions spéciales, adresse alternative...",es:"Instrucciones especiales, dirección alternativa...",en:"Special instructions, alternative address...",it:"Istruzioni speciali, indirizzo alternativo..."},
  dirEnvioClient:{fr:"Adresse de livraison du client",es:"Dirección de envío del cliente",en:"Client shipping address",it:"Indirizzo spedizione cliente"},
  utiliserAdresse:{fr:"Utiliser l'adresse du client",es:"Usar dirección del cliente",en:"Use client address",it:"Usa indirizzo cliente"},
  resumeClient:{fr:"Résumé",es:"Resumen",en:"Summary",it:"Riepilogo"},
  totalDepense:{fr:"Total commandé",es:"Total pedido",en:"Total ordered",it:"Totale speso"},
  nbCommandes:{fr:"Commandes",es:"Pedidos",en:"Orders",it:"N° ordini"},
  dernierCmd:{fr:"Dernière commande",es:"Último pedido",en:"Last order",it:"Ultimo ordine"},
  notesPrivees:{fr:"Notes privées",es:"Notas privadas",en:"Private notes",it:"Note private"},
  notesPriveesDesc:{fr:"Visibles uniquement par vous",es:"Solo visibles para ti",en:"Only visible to you",it:"Visibile solo a te"},
  editarCmd:{fr:"Modifier la commande",es:"Editar pedido",en:"Edit order",it:"Modifica ordine"},
  cmdNonConfirmee:{fr:"Non confirmée — modifiable",es:"No confirmada — editable",en:"Not confirmed — editable",it:"Ordine non confermato — modificabile"},
  novedades:{fr:"Nouveautés",es:"Novedades",en:"New arrivals",it:"Novità"},
  tuTarifa:{fr:"Votre tarif",es:"Tu tarifa",en:"Your pricing",it:"Le tue tariffe"},
  proximoTramo:{fr:"Plus que %n unités pour débloquer",es:"Solo %n unidades más para desbloquear",en:"Only %n more units to unlock",it:"Solo %n unità in più per sbloccare"},
  porUnidad:{fr:"/unité",es:"/unidad",en:"/unit",it:"/unità"},
  exporterCSV:{fr:"Exporter CSV",es:"Exportar CSV",en:"Export CSV",it:"Esporta CSV"},
  sessionExpiree:{fr:"Session expirée. Veuillez vous reconnecter.",es:"Sesión expirada. Vuelve a iniciar sesión.",en:"Session expired. Please log in again.",it:"Sessione scaduta. Effettua nuovamente l'accesso."},
  favoris:{fr:"Favoris",es:"Favoritos",en:"Favorites",it:"Preferiti"},
  ajouteFav:{fr:"Ajouté aux favoris",es:"Añadido a favoritos",en:"Added to favorites",it:"Aggiunto ai preferiti"},
  voirFavoris:{fr:"Voir favoris",es:"Ver favoritos",en:"View favorites",it:"Vedi preferiti"},
  packaging:{fr:"Packaging",es:"Packaging",en:"Packaging",it:"Packaging"},
  packagingSub:{fr:"Étuis, présentoirs et merchandising",es:"Fundas, expositores y merchandising",en:"Cases, displays and merchandising",it:"Custodie, espositori e merchandising"},
  packType:{fr:"Type",es:"Tipo",en:"Type",it:"Tipo"},
  packDesc:{fr:"Description",es:"Descripción",en:"Description",it:"Descrizione"},
  editPack:{fr:"Modifier packaging",es:"Editar packaging",en:"Edit packaging",it:"Modifica packaging"},
  nouveauPack:{fr:"Nouveau",es:"Nuevo",en:"New",it:"Nuovo"},
  packEtui:{fr:"Étuis",es:"Fundas",en:"Cases",it:"Custodie"},
  packDisplay:{fr:"Présentoirs",es:"Expositores",en:"Displays",it:"Espositori"},
  packMerch:{fr:"Merchandising",es:"Merchandising",en:"Merchandising",it:"Merchandising"},
  employe:{fr:"Équipe",es:"Equipo",en:"Team",it:"Team"},
  cmdEnAttente:{fr:"Commandes en attente",es:"Pedidos pendientes",en:"Pending orders",it:"Ordini in attesa"},
  aExpedier:{fr:"À expédier",es:"Por enviar",en:"To ship",it:"Da spedire"},
  totalCmd:{fr:"Total commandes",es:"Total pedidos",en:"Total orders",it:"Totale ordini"},
  preparacion:{fr:"Préparation",es:"Preparación",en:"Preparation",it:"Preparazione"},
  preparacionSub:{fr:"Commandes à préparer",es:"Pedidos por preparar",en:"Orders to prepare",it:"Ordini da preparare"},
  packingList:{fr:"Liste d'emballage",es:"Lista de empaque",en:"Packing list",it:"Lista imballaggio"},
  gamuza:{fr:"Chiffon microfibre",es:"Gamuza",en:"Microfiber cloth",it:"Panno microfibra"},
  expositor:{fr:"Présentoir",es:"Expositor",en:"Display stand",it:"Espositore"},
  cajita:{fr:"Boîte",es:"Cajita",en:"Box",it:"Scatolina"},
  funda:{fr:"Étui",es:"Funda",en:"Case",it:"Custodia"},
  albaran:{fr:"Bon de livraison",es:"Albarán",en:"Delivery note",it:"Bolla di consegna"},
  marcadoListo:{fr:"Marqué comme prêt",es:"Marcado como listo",en:"Marked as ready",it:"Segnato come pronto"},
  defectuosos:{fr:"Produits défectueux",es:"Productos defectuosos",en:"Defective products",it:"Prodotti difettosi"},
  defectuososSub:{fr:"Rapport pour fournisseur",es:"Reporte para proveedor",en:"Supplier report",it:"Report per fornitore"},
  reportarDefecto:{fr:"Signaler un défaut",es:"Reportar defecto",en:"Report defect",it:"Segnala difetto"},
  descripcionDefecto:{fr:"Description du défaut",es:"Descripción del defecto",en:"Defect description",it:"Descrizione del difetto"},
  pendienteProveedor:{fr:"En attente fournisseur",es:"Pendiente proveedor",en:"Pending from supplier",it:"In attesa fornitore"},
  pendienteProveedorSub:{fr:"Produits commandés au fournisseur",es:"Productos pedidos al proveedor",en:"Products ordered from supplier",it:"Prodotti ordinati al fornitore"},
  fechaPrevista:{fr:"Date prévue",es:"Fecha prevista",en:"Expected date",it:"Data prevista"},
  misResumen:{fr:"Mon résumé",es:"Mi resumen",en:"My summary",it:"Il mio riepilogo"},
  misTareas:{fr:"Mes tâches",es:"Mis tareas",en:"My tasks",it:"I miei compiti"},
  todosLosEquipos:{fr:"Toute l'équipe",es:"Todo el equipo",en:"All team",it:"Tutto il team"},
  fondFiltrer:{fr:"Filtrer",es:"Filtrar",en:"Filter",it:"Filtra"},
  couleurs:{fr:"couleurs",es:"colores",en:"colors",it:"colori"},
  voirModele:{fr:"Voir le modèle",es:"Ver modelo",en:"View model",it:"Vedi modello"},
  stockDisponible:{fr:"en stock",es:"en stock",en:"in stock",it:"disponibile"},
  envioPartial:{fr:"Envoi partiel",es:"Envío parcial",en:"Partial shipment",it:"Spedizione parziale"},
  enviado:{fr:"Envoyé",es:"Enviado",en:"Shipped",it:"Spedito"},
  pendienteEnvio:{fr:"En attente d'envoi",es:"Pendiente de envío",en:"Pending shipment",it:"In attesa di spedizione"},
  recibido:{fr:"reçu",es:"recibido",en:"received",it:"ricevuto"},
  pendiente:{fr:"en attente",es:"pendiente",en:"pending",it:"in attesa"},
  progreso:{fr:"Progression",es:"Progreso",en:"Progress",it:"Progresso"},
  factura:{fr:"Facture",es:"Factura",en:"Invoice",it:"Fattura"},
  tusMasPedidos:{fr:"Vos modèles les plus commandés",es:"Tus diseños más pedidos",en:"Your most ordered designs",it:"I tuoi design più ordinati"},
  vecesComprado:{fr:"commandé %n fois",es:"pedido %n veces",en:"ordered %n times",it:"ordinato %n volte"},
  recoInteligente:{fr:"Vous pourriez aimer",es:"Te puede interesar",en:"You might like",it:"Potrebbe piacerti"},
  distributeurs:{fr:"Distributeurs",es:"Distribuidores",en:"Distributors",it:"Distributori"},
  distResume:{fr:"Résumé distributeur",es:"Resumen distribuidor",en:"Distributor summary",it:"Riepilogo distributore"},
  ventesTotal:{fr:"Ventes totales",es:"Ventas totales",en:"Total sales",it:"Vendite totali"},
  commGeneree:{fr:"Commission générée",es:"Comisión generada",en:"Commission generated",it:"Comm. generata"},
  commPayee:{fr:"Payée",es:"Pagada",en:"Paid",it:"Comm. pagata"},
  commDue:{fr:"À payer",es:"Pendiente",en:"Due",it:"Comm. dovuta"},
  liquidaciones:{fr:"Liquidations",es:"Liquidaciones",en:"Settlements",it:"Liquidazioni"},
  noLiquidaciones:{fr:"Aucune liquidation enregistrée",es:"Sin liquidaciones registradas",en:"No settlements recorded",it:"Nessuna liquidazione registrata"},
  notesDistrib:{fr:"Notes sur ce distributeur",es:"Notas sobre este distribuidor",en:"Notes about this distributor",it:"Note distributore"},
  confirmarEliminar:{fr:"Confirmer la suppression ?",es:"¿Confirmar eliminación?",en:"Confirm deletion?",it:"Conferma eliminazione?"},
  reduirQty:{fr:"Réduire qté",es:"Reducir uds",en:"Reduce qty",it:"Riduci qtà"},
  tareas:{fr:"Tâches",es:"Tareas",en:"Tasks",it:"Compiti"},
  gestionTareas:{fr:"Gestion des tâches",es:"Gestión de tareas",en:"Task management",it:"Gestione compiti"},
  nouvelleTache:{fr:"+ Tâche",es:"+ Tarea",en:"+ Task",it:"+ Compito"},
  titreTache:{fr:"Titre",es:"Título",en:"Title",it:"Titolo"},
  descTache:{fr:"Description",es:"Descripción",en:"Description",it:"Descrizione"},
  priorite:{fr:"Priorité",es:"Prioridad",en:"Priority",it:"Priorità"},
  haute:{fr:"Haute",es:"Alta",en:"High",it:"Alta"},
  moyenne:{fr:"Moyenne",es:"Media",en:"Medium",it:"Media"},
  basse:{fr:"Basse",es:"Baja",en:"Low",it:"Bassa"},
  area:{fr:"Domaine",es:"Área",en:"Area",it:"Area"},
  commercial:{fr:"Commercial",es:"Comercial",en:"Commercial",it:"Commerciale"},
  finances:{fr:"Finances",es:"Finanzas",en:"Finance",it:"Finanze"},
  marketing:{fr:"Marketing",es:"Marketing",en:"Marketing",it:"Marketing"},
  produits:{fr:"Produits",es:"Productos",en:"Products",it:"Prodotti"},
  clientsArea:{fr:"Clients",es:"Clientes",en:"Clients",it:"Clienti"},
  logistique:{fr:"Logistique",es:"Logística",en:"Logistics",it:"Logistica"},
  defectos:{fr:"Défauts",es:"Defectos",en:"Defects",it:"Difetti"},
  proveedor:{fr:"Fournisseur",es:"Proveedor",en:"Supplier",it:"Fornitore"},
  resolu:{fr:"Résolu",es:"Resuelto",en:"Resolved",it:"Risolto"},
  comercialSub:{fr:"Prospection et suivi clients",es:"Prospección y seguimiento de clientes",en:"Client prospecting and follow-up",it:"Prospezione e follow-up clienti"},
  pipeline:{fr:"Pipeline",es:"Pipeline",en:"Pipeline",it:"Pipeline"},
  leads:{fr:"Prospects",es:"Leads",en:"Leads",it:"Prospect"},
  aRecuperar:{fr:"À récupérer",es:"A recuperar",en:"To recover",it:"Da recuperare"},
  aRecuperarSub:{fr:"Clients sans commande récente",es:"Clientes sin pedido reciente",en:"Clients without recent orders",it:"Clienti senza ordini recenti"},
  nuevoLead:{fr:"Nouveau prospect",es:"Nuevo lead",en:"New lead",it:"Nuovo prospect"},
  contactado:{fr:"Contacté",es:"Contactado",en:"Contacted",it:"Contattato"},
  enNegociacion:{fr:"En négociation",es:"En negociación",en:"In negotiation",it:"In trattativa"},
  ganado:{fr:"Gagné",es:"Ganado",en:"Won",it:"Acquisito"},
  perdido:{fr:"Perdu",es:"Perdido",en:"Lost",it:"Perso"},
  proximaAccion:{fr:"Prochaine action",es:"Próxima acción",en:"Next action",it:"Prossima azione"},
  ultimoContacto:{fr:"Dernier contact",es:"Último contacto",en:"Last contact",it:"Ultimo contatto"},
  seguimiento:{fr:"Suivi commercial",es:"Seguimiento comercial",en:"Commercial follow-up",it:"Follow-up commerciale"},
  sinPedidos:{fr:"Sans commandes",es:"Sin pedidos",en:"No orders",it:"Senza ordini"},
  clienteAntiguo:{fr:"Client ancien",es:"Cliente antiguo",en:"Former client",it:"Ex cliente"},
  oportunidad:{fr:"Opportunité",es:"Oportunidad",en:"Opportunity",it:"Opportunità"},
  almacen:{fr:"Entrepôt",es:"Almacén",en:"Warehouse",it:"Magazzino"},
  almacenSub:{fr:"Inventaire et contrôle qualité",es:"Inventario y control de calidad",en:"Inventory and quality control",it:"Inventario e controllo qualità"},
  logistica:{fr:"Logistique",es:"Logística",en:"Logistics",it:"Logistica"},
  logisticaSub:{fr:"Expéditions et réceptions",es:"Envíos y recepciones",en:"Shipments and receptions",it:"Spedizioni e ricezioni"},
  packagingInventario:{fr:"Stock packaging",es:"Inventario packaging",en:"Packaging inventory",it:"Stock packaging"},
  fundasStock:{fr:"Étuis",es:"Fundas",en:"Cases",it:"Custodie"},
  fundasVerde:{fr:"Étui Vert Pistache",es:"Funda Verde Pistacho",en:"Pistachio Green Case",it:"Custodia Verde Pistacchio"},
  fundasLila:{fr:"Étui Lilas Pastel",es:"Funda Lila Pastel",en:"Pastel Lilac Case",it:"Custodia Lilla Pastello"},
  fundasBlue:{fr:"Étui Baby Blue",es:"Funda Baby Blue",en:"Baby Blue Case",it:"Custodia Baby Blue"},
  fundasCrema:{fr:"Étui Crème",es:"Funda Crema",en:"Cream Case",it:"Custodia Crema"},
  gamuzasStock:{fr:"Chiffons microfibre",es:"Gamuzas",en:"Microfiber cloths",it:"Panni"},
  gamuzasChampagne:{fr:"Microfibre Champagne",es:"Gamuza Champagne",en:"Champagne Cloth",it:"Panno Champagne"},
  gamuzasGris:{fr:"Microfibre Gris Perle",es:"Gamuza Gris Perla",en:"Pearl Grey Cloth",it:"Panno Grigio Perla"},
  cajasEnvio:{fr:"Cartons d'envoi",es:"Cajas de envío",en:"Shipping boxes",it:"Scatole spedizione"},
  cajitasGafa:{fr:"Boîtes lunettes",es:"Cajitas gafa",en:"Glasses boxes",it:"Scatolina occhiale"},
  cintaMinue:{fr:"Ruban adhésif Minuë",es:"Cinta adhesiva Minuë",en:"Minuë adhesive tape",it:"Nastro adesivo Minuë"},
  mercanciaPendiente:{fr:"Marchandise en attente",es:"Mercancía pendiente",en:"Pending goods",it:"Merce in attesa"},
  reporteStock:{fr:"Rapport de stock",es:"Reporte de stock",en:"Stock report",it:"Report stock"},
  enStock:{fr:"En stock",es:"En stock",en:"In stock",it:"In stock"},
  sinStock:{fr:"Rupture",es:"Sin stock",en:"Out of stock",it:"Esaurito"},
  stockAlerta:{fr:"Alerte",es:"Alerta",en:"Alert",it:"Allerta"},
  actualizacion:{fr:"Mise à jour",es:"Actualización",en:"Update",it:"Aggiornamento"},
  anadirNota:{fr:"Ajouter une note",es:"Añadir nota",en:"Add note",it:"Aggiungi nota"},
  cargandoClientes:{fr:"Chargement clients...",es:"Cargando clientes...",en:"Loading clients...",it:"Caricamento clienti..."},
  sinLeads:{fr:"Aucun prospect — créez-en un",es:"Sin leads — crea uno",en:"No leads — create one",it:"Nessun lead — creane uno"},
  sinPedidosProveedor:{fr:"Aucune commande en attente du fournisseur",es:"Sin pedidos pendientes de proveedor",en:"No pending supplier orders",it:"Nessun ordine fornitore in attesa"},
  todosClientesPedidos:{fr:"Tous les clients ont des commandes",es:"Todos los clientes tienen pedidos",en:"All clients have orders",it:"Tutti i clienti hanno ordini"},
  admin:{fr:"Admin",es:"Admin",en:"Admin",it:"Admin"},
  fait:{fr:"Fait",es:"Hecho",en:"Done",it:"Fatto"},
  enCours:{fr:"En cours",es:"En curso",en:"In progress",it:"In corso"},
  aFaire:{fr:"À faire",es:"Pendiente",en:"To do",it:"Da fare"},
  toutesAreas:{fr:"Tout",es:"Todo",en:"All",it:"Tutte"},
  promoClients:{fr:"Clients ciblés",es:"Clientes objetivo",en:"Target clients",it:"Clienti target"},
  tousClients:{fr:"Tous les clients",es:"Todos los clientes",en:"All clients",it:"Tutti i clienti"},
  selectionPrivee:{fr:"Sélection Privée",es:"Selección Privée",en:"Private Selection",it:"Selezione Privata"},
  misFavoritos:{fr:"Mes favoris",es:"Mis favoritos",en:"My favorites",it:"I miei preferiti"},
  favoritos:{fr:"Favoris",es:"Favoritos",en:"Favorites",it:"Preferiti"},
  sinFavoritos:{fr:"Vous n'avez pas encore de favoris. Cliquez sur le cœur dans les produits pour les ajouter.",es:"Aún no tienes favoritos. Pulsa el corazón en los productos para añadirlos.",en:"You don't have favorites yet. Click the heart on products to add them.",it:"Non hai ancora preferiti. Clicca sul cuore nei prodotti per aggiungerli."},
  exploraCatalogo:{fr:"Explorer le catalogue",es:"Explorar catálogo",en:"Browse catalog",it:"Esplora catalogo"},
  añadirTodoCarrito:{fr:"Tout ajouter au panier",es:"Añadir todos al carrito",en:"Add all to cart",it:"Aggiungi tutti al carrello"},
  analytics:{fr:"Analytique",es:"Analítica",en:"Analytics",it:"Analitiche"},
  datosNegocio:{fr:"Données business",es:"Datos negocio",en:"Business data",it:"Dati business"},
  decisiones:{fr:"Décisions",es:"Decisiones",en:"Decisions",it:"Decisioni"},
  confirmacion:{fr:"Confirmation",es:"Confirmación",en:"Confirmation",it:"Conferma"},
  annuler:{fr:"Annuler",es:"Cancelar",en:"Cancel",it:"Annulla"},
  confirmer:{fr:"Confirmer",es:"Confirmar",en:"Confirm",it:"Conferma"},
  confirmVaciarCarrito:{fr:"Vider le panier ? Tous les produits seront supprimés.",es:"¿Vaciar el carrito? Se eliminarán todos los productos.",en:"Empty the cart? All products will be removed.",it:"Svuotare il carrello? Tutti i prodotti saranno rimossi."},
  carritoVaciado:{fr:"Panier vidé",es:"Carrito vaciado",en:"Cart emptied",it:"Carrello svuotato"},
  grpVentas:{fr:"Ventes",es:"Ventas",en:"Sales",it:"Vendite"},
  grpClientes:{fr:"Clients",es:"Clientes",en:"Clients",it:"Clienti"},
  grpOperaciones:{fr:"Opérations",es:"Operaciones",en:"Operations",it:"Operazioni"},
  grpContenido:{fr:"Contenu",es:"Contenido",en:"Content",it:"Contenuti"},
  grpSistema:{fr:"Système",es:"Sistema",en:"System",it:"Sistema"},
  grpPersonal:{fr:"Personnel",es:"Personal",en:"Personal",it:"Personale"},
  sinClientesAun:{fr:"Vous n'avez pas encore de clients. Créez votre première boutique pour commander.",es:"Aún no tienes clientes. Crea tu primera tienda para poder pedir.",en:"You have no clients yet. Create your first store to place an order.",it:"Non hai ancora clienti. Crea il tuo primo negozio per ordinare."},
  crearPrimerCliente:{fr:"Créer ma première boutique",es:"Crear mi primera tienda",en:"Create my first store",it:"Crea il mio primo negozio"},
  clienteCreado:{fr:"Client créé",es:"Cliente creado",en:"Client created",it:"Cliente creato"},
  voirPanier:{fr:"Voir le panier",es:"Ver carrito",en:"View cart",it:"Vedi carrello"},
  descargarAlbaran:{fr:"Télécharger le bon de livraison (PDF)",es:"Descargar albarán (PDF)",en:"Download delivery note (PDF)",it:"Scarica bolla di consegna (PDF)"},
  popupBloqueado:{fr:"Autorisez les fenêtres pop-up pour télécharger",es:"Permite ventanas emergentes para descargar",en:"Allow pop-ups to download",it:"Consenti i popup per scaricare"},
  idiomaPreferido:{fr:"Langue préférée",es:"Idioma preferido",en:"Preferred language",it:"Lingua preferita"},
  bienvenidaLogin:{fr:"Bienvenue.",es:"Bienvenido.",en:"Welcome.",it:"Benvenuto."},
  accedeEspacio:{fr:"Accédez à votre espace wholesale privé",es:"Accede a tu espacio mayorista privado",en:"Access your private wholesale space",it:"Accedi al tuo spazio wholesale privato"},
  noTienesCuenta:{fr:"Pas encore de compte ?",es:"¿Aún no tienes cuenta?",en:"No account yet?",it:"Non hai ancora un account?"},
  uneteBoutiques:{fr:"Rejoignez les boutiques partenaires Minuë · Réponse sous 24h",es:"Únete a las tiendas partner de Minuë · Respuesta en 24h",en:"Join Minuë's partner boutiques · Reply within 24h",it:"Unisciti ai negozi partner Minuë · Risposta entro 24h"},
  emailYaExiste:{fr:"Cet email a déjà un compte ou une demande en cours.",es:"Este email ya tiene una cuenta o una solicitud en curso.",en:"This email already has an account or a pending request.",it:"Questa email ha già un account o una richiesta in corso."},
  acetatoTramoInfo:{fr:"Les %n unités Acetato comptent pour le palier de prix, mais gardent leur prix fixe.",es:"Las %n uds Acetato cuentan para el tramo de precio, pero mantienen su precio fijo.",en:"The %n Acetato units count toward the price tier, but keep their fixed price.",it:"Le %n unità Acetato contano per la fascia di prezzo, ma mantengono il loro prezzo fisso."},
  tarifAcetato:{fr:"Tarif Acetato",es:"Tarifa Acetato",en:"Acetato pricing",it:"Tariffa Acetato"},
  tarifAcetatoSub:{fr:"Prix fixe par unité, quelle que soit la quantité. Les unités comptent pour le palier des autres collections.",es:"Precio fijo por unidad, sea cual sea la cantidad. Sus unidades cuentan para el tramo del resto de colecciones.",en:"Fixed price per unit, regardless of quantity. Units count toward the tier of other collections.",it:"Prezzo fisso per unità, indipendentemente dalla quantità. Le unità contano per la fascia delle altre collezioni."},
  prospectos:{fr:"Prospects",es:"Prospectos",en:"Prospects",it:"Prospect"},
  prospectosSub:{fr:"Contacts à travailler — assignés par Minuë ou ajoutés par vous",es:"Contactos a trabajar — asignados por Minuë o añadidos por ti",en:"Contacts to work — assigned by Minuë or added by you",it:"Contatti da lavorare — assegnati da Minuë o aggiunti da te"},
  etapaNuevo:{fr:"Nouveau",es:"Nuevo",en:"New",it:"Nuovo"},
  etapaContactado:{fr:"Contacté",es:"Contactado",en:"Contacted",it:"Contattato"},
  etapaInteresado:{fr:"Intéressé",es:"Interesado",en:"Interested",it:"Interessato"},
  etapaCliente:{fr:"Client ✓",es:"Cliente ✓",en:"Client ✓",it:"Cliente ✓"},
  etapaDescartado:{fr:"Écarté",es:"Descartado",en:"Discarded",it:"Scartato"},
  notaMinue:{fr:"Note de Minuë",es:"Nota de Minuë",en:"Note from Minuë",it:"Nota di Minuë"},
  misNotas:{fr:"Mes notes",es:"Mis notas",en:"My notes",it:"Le mie note"},
  nuevoProspecto:{fr:"Nouveau prospect",es:"Nuevo prospecto",en:"New prospect",it:"Nuovo prospect"},
  prospectoCreado:{fr:"Prospect créé",es:"Prospecto creado",en:"Prospect created",it:"Prospect creato"},
  sinProspectos:{fr:"Aucun prospect pour le moment.",es:"Sin prospectos por ahora.",en:"No prospects yet.",it:"Nessun prospect per ora."},
  novedadesTendencias:{fr:"Nouveautés & tendances",es:"Novedades y tendencias",en:"News & trends",it:"Novità e tendenze"},
  clienteEliminado:{fr:"Client supprimé",es:"Cliente eliminado",en:"Client deleted",it:"Cliente eliminato"},
  pedidoEliminado:{fr:"Commande supprimée",es:"Pedido eliminado",en:"Order deleted",it:"Ordine eliminato"},
  agotadoLabel:{fr:"ÉPUISÉ",es:"AGOTADO",en:"SOLD OUT",it:"ESAURITO"},
  avisameCuandoVuelva:{fr:"Prévenez-moi au retour",es:"Avísame cuando vuelva",en:"Notify me when back",it:"Avvisami al ritorno"},
  teAvisaremos:{fr:"On vous préviendra",es:"Te avisaremos",en:"We'll notify you",it:"Ti avviseremo"},
  alertaCreada:{fr:"Alerte créée — on vous préviendra dès le retour en stock",es:"Alerta creada — te avisaremos cuando vuelva a estar disponible",en:"Alert created — we'll notify you when it's back in stock",it:"Avviso creato — ti avviseremo quando tornerà disponibile"},
  alertaQuitada:{fr:"Alerte supprimée",es:"Alerta eliminada",en:"Alert removed",it:"Avviso rimosso"},
  haVuelto:{fr:"De retour en stock !",es:"¡Ha vuelto!",en:"Back in stock!",it:"È tornato!"},
  anadidoAlCarrito:{fr:"Ajouté au panier",es:"Añadido al carrito",en:"Added to cart",it:"Aggiunto al carrello"},
  nuevosDesdeVisita:{fr:"Nouveautés depuis votre dernière visite",es:"Nuevos desde tu última visita",en:"New since your last visit",it:"Novità dalla tua ultima visita"},
  tocaReponer:{fr:"C'est le moment de réassortir ?",es:"¿Toca reponer?",en:"Time to restock?",it:"È ora di riassortire?"},
  tocaReponerSub:{fr:"Votre dernière commande date de %d jours (%n unités). Répétez-la en un clic.",es:"Tu último pedido fue hace %d días (%n unidades). Repítelo en un click.",en:"Your last order was %d days ago (%n units). Repeat it in one click.",it:"Il tuo ultimo ordine risale a %d giorni fa (%n unità). Ripetilo con un clic."},
  repetirUltimoPedido:{fr:"Répéter ma dernière commande",es:"Repetir mi último pedido",en:"Repeat my last order",it:"Ripeti il mio ultimo ordine"},
  pedidoCargado:{fr:"Commande chargée dans le panier",es:"Pedido cargado en el carrito",en:"Order loaded into cart",it:"Ordine caricato nel carrello"},
  modelosNoDisponibles:{fr:"Certains modèles ne sont plus disponibles",es:"Algunos modelos ya no están disponibles",en:"Some models are no longer available",it:"Alcuni modelli non sono più disponibili"},
  fotosProducto:{fr:"Photos produit",es:"Fotos de producto",en:"Product photos",it:"Foto prodotto"},
  fotosProductoSub:{fr:"Téléchargez les photos HD de chaque modèle pour votre Instagram, site web ou vitrine. Un clic et c'est à vous.",es:"Descarga las fotos HD de cada modelo para tu Instagram, web o escaparate. Un click y son tuyas.",en:"Download HD photos of each model for your Instagram, website or storefront. One click and they're yours.",it:"Scarica le foto HD di ogni modello per il tuo Instagram, sito o vetrina. Un clic e sono tue."},
  fotoDescargada:{fr:"Photo téléchargée",es:"Foto descargada",en:"Photo downloaded",it:"Foto scaricata"},
  seguirEnvio:{fr:"Suivre mon envoi",es:"Seguir mi envío",en:"Track my shipment",it:"Traccia la mia spedizione"},
  ajouterFav:{fr:"Ajouter aux favoris",es:"Añadir a favoritos",en:"Add to favorites",it:"Aggiungi ai preferiti"},
  retirerFav:{fr:"Retirer des favoris",es:"Quitar de favoritos",en:"Remove from favorites",it:"Rimuovi dai preferiti"},
  datosFacturacion:{fr:"Données de facturation",es:"Datos de facturación",en:"Billing details",it:"Dati di fatturazione"},
  noResults:{fr:"Aucun résultat",es:"Sin resultados",en:"No results",it:"Nessun risultato"},
  plusTard:{fr:"Plus tard",es:"Más tarde",en:"Later",it:"Più tardi"},
  sinDireccionGuardada:{fr:"Aucune adresse enregistrée",es:"Sin dirección guardada",en:"No saved address",it:"Nessun indirizzo salvato"},
  tarjetasTecnicas:{fr:"Fiches techniques",es:"Fichas técnicas",en:"Tech sheets",it:"Schede tecniche"},
  productosMasFavoritos:{fr:"Produits les plus favorisés",es:"Productos más favoritos",en:"Most favorited products",it:"Prodotti più preferiti"},
  productosMasVendidos:{fr:"Produits les plus vendus",es:"Productos más vendidos",en:"Top selling products",it:"Prodotti più venduti"},
  productosMasCarrito:{fr:"Plus ajoutés au panier",es:"Más añadidos al carrito",en:"Most added to cart",it:"Più aggiunti al carrello"},
  porClientes:{fr:"par clients",es:"por clientes",en:"by clients",it:"da clienti"},
  unidadesVendidas:{fr:"unités vendues",es:"unidades vendidas",en:"units sold",it:"unità vendute"},
  selectionSub:{fr:"Éditions spéciales à prix privilégié, disponibilité limitée.",es:"Ediciones especiales a precio privilegiado, disponibilidad limitada.",en:"Special editions at privileged pricing, limited availability.",it:"Edizioni speciali a prezzi privilegiati, disponibilità limitata."},
  forme:{fr:"Forme",es:"Forma",en:"Shape",it:"Forma"},
  couleur:{fr:"Couleur",es:"Color",en:"Color",it:"Colore"},
  toutes:{fr:"Toutes",es:"Todas",en:"All",it:"Tutte"},
  tous:{fr:"Tous",es:"Todos",en:"All",it:"Tutti"},
  ronde:{fr:"Ronde",es:"Redonda",en:"Round",it:"Rotonda"},
  carree:{fr:"Carrée",es:"Cuadrada",en:"Square",it:"Quadrata"},
  catEye:{fr:"Cat-eye",es:"Cat-eye",en:"Cat-eye",it:"Cat-eye"},
  rectangulaire:{fr:"Rectangulaire",es:"Rectangular",en:"Rectangular",it:"Rettangolare"},
  aviateur:{fr:"Aviateur",es:"Aviador",en:"Aviator",it:"Aviatore"},
  oversize:{fr:"Oversize",es:"Oversize",en:"Oversize",it:"Oversize"},
  geometrique:{fr:"Géométrique",es:"Geométrica",en:"Geometric",it:"Geometrica"},
  noir:{fr:"Noir",es:"Negro",en:"Black",it:"Nero"},
  careyCol:{fr:"Carey",es:"Carey",en:"Carey",it:"Carey"},
  marron:{fr:"Marron",es:"Marrón",en:"Brown",it:"Marrone"},
  vert:{fr:"Vert",es:"Verde",en:"Green",it:"Verde"},
  dore:{fr:"Doré",es:"Dorado",en:"Gold",it:"Oro"},
  rose:{fr:"Rose",es:"Rosa",en:"Pink",it:"Rosa"},
  bleu:{fr:"Bleu",es:"Azul",en:"Blue",it:"Blu"},
  rougeVin:{fr:"Rouge/Vin",es:"Rojo/Vino",en:"Red/Wine",it:"Rosso/Vino"},
  orangeCol:{fr:"Orange",es:"Naranja",en:"Orange",it:"Arancione"},
  cremeNude:{fr:"Crème/Nude",es:"Crema/Nude",en:"Cream/Nude",it:"Crema/Nude"},
  gris:{fr:"Gris",es:"Gris",en:"Grey",it:"Grigio"},
  transparentCol:{fr:"Transparent",es:"Transparente",en:"Transparent",it:"Trasparente"},
  multicolore:{fr:"Multicolore",es:"Multicolor",en:"Multicolor",it:"Multicolore"},
};

/* ═══ PRICING TIERS (Essential only) ═══ */
const TIERS = [
  {min:1,max:9,price:26.90,label:"< 10",payK:"paiementUnique",shipK:"dePago",dispK:"expOpt"},
  {min:10,max:19,price:22.90,label:"10-19",payK:"paiementUnique",shipK:"dePago",dispK:"expOpt"},
  {min:20,max:29,price:19.90,label:"20-29",payK:"deuxPaiements30",shipK:"gratuit",dispK:"exp2"},
  {min:30,max:39,price:18.90,label:"30-39",payK:"deuxPaiements30",shipK:"gratuit",dispK:"exp3"},
  {min:40,max:60,price:17.90,label:"40-60",payK:"deuxPaiements1545",shipK:"gratuit",dispK:"exp3"},
];
const ACETATO_PRICE = 27.90;
const getTier = q => TIERS.find(t => q >= t.min && q <= t.max) || TIERS[4];
const getNextTier = q => { const i = TIERS.findIndex(t => q >= t.min && q <= t.max); return i >= 0 && i < TIERS.length - 1 ? TIERS[i+1] : null; };
const getPrice = (q, cp) => cp > 0 ? cp : getTier(q).price;

/* ═══ SEED DATA ═══ */
const PRODUCTS_INIT = [
  /* ── ESSENTIAL (PVC) ── */
  /* BAKER */
  {id:1,model:"BAKER",color:"Tea",sku:"MN-BAKR-TEA",col:"Essential",cat:"Essential",stock:16,fixedPrice:0,tags:["top","rec"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/170.png"},
  {id:2,model:"BAKER",color:"Cloud",sku:"MN-BAKR-CLD",col:"Essential",cat:"Essential",stock:14,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/169.png"},
  {id:3,model:"BAKER",color:"Black",sku:"MN-BAKR-BLK",col:"Essential",cat:"Essential",stock:20,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/167.png"},
  {id:4,model:"BAKER",color:"Mint",sku:"MN-BAKR-MNT",col:"Essential",cat:"Essential",stock:12,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/168.png"},
  /* VITTI */
  {id:5,model:"VITTI",color:"Brown Carey",sku:"MN-VTTI-BCR",col:"Essential",cat:"Essential",stock:18,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/acaxasx.png"},
  {id:6,model:"VITTI",color:"Velvet",sku:"MN-VTTI-VLV",col:"Essential",cat:"Essential",stock:20,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/201.png"},
  {id:7,model:"VITTI",color:"Brown",sku:"MN-VTTI-BRN",col:"Essential",cat:"Essential",stock:15,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/acaxasx.png"},
  {id:8,model:"VITTI",color:"Caramel",sku:"MN-VTTI-CRM",col:"Essential",cat:"Essential",stock:10,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/202.png"},
  /* BERGMAN */
  {id:9,model:"BERGMAN",color:"Brown Carey",sku:"MN-BRGM-BCR",col:"Essential",cat:"Essential",stock:14,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/162.png"},
  {id:10,model:"BERGMAN",color:"Brown",sku:"MN-BRGM-BRN",col:"Essential",cat:"Essential",stock:16,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/159.png"},
  {id:11,model:"BERGMAN",color:"Black",sku:"MN-BRGM-BLK",col:"Essential",cat:"Essential",stock:22,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/BERGMANBLACK.png"},
  {id:12,model:"BERGMAN",color:"Carey",sku:"MN-BRGM-CRY",col:"Essential",cat:"Essential",stock:18,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/162.png"},
  /* TURA */
  {id:13,model:"TURA",color:"Guiza",sku:"MN-TURA-GZA",col:"Essential",cat:"Essential",stock:12,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/63.png"},
  {id:14,model:"TURA",color:"Carey",sku:"MN-TURA-CRY",col:"Essential",cat:"Essential",stock:15,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/65.png"},
  {id:15,model:"TURA",color:"Coffee",sku:"MN-TURA-COF",col:"Essential",cat:"Essential",stock:10,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/67.png"},
  {id:16,model:"TURA",color:"Velvet",sku:"MN-TURA-VLV",col:"Essential",cat:"Essential",stock:18,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/69.png"},
  /* CARDINALE */
  {id:17,model:"CARDINALE",color:"Carey",sku:"MN-CARD-CRY",col:"Essential",cat:"Essential",stock:20,fixedPrice:0,tags:["top"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/6w4rw.png"},
  {id:18,model:"CARDINALE",color:"Apple",sku:"MN-CARD-APL",col:"Essential",cat:"Essential",stock:14,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/gtwed.png"},
  {id:19,model:"CARDINALE",color:"Tea",sku:"MN-CARD-TEA",col:"Essential",cat:"Essential",stock:16,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/164.png"},
  {id:20,model:"CARDINALE",color:"Guiza",sku:"MN-CARD-GZA",col:"Essential",cat:"Essential",stock:12,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/6w4rw.png"},
  /* GARDNER */
  {id:21,model:"GARDNER",color:"Black",sku:"MN-GRDN-BLK",col:"Essential",cat:"Essential",stock:22,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/60.png"},
  {id:22,model:"GARDNER",color:"Amber Dor\u00e9",sku:"MN-GRDN-ADR",col:"Essential",cat:"Essential",stock:15,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/60.png"},
  {id:23,model:"GARDNER",color:"Carey",sku:"MN-GRDN-CRY",col:"Essential",cat:"Essential",stock:18,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/60.png"},
  /* HART */
  {id:24,model:"HART",color:"Sunset",sku:"MN-HART-SNS",col:"Essential",cat:"Essential",stock:14,fixedPrice:0,tags:["new"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/24651be0773ae9139225c10bff875975.png"},
  {id:25,model:"HART",color:"Black",sku:"MN-HART-BLK",col:"Essential",cat:"Essential",stock:20,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/20.png"},
  {id:26,model:"HART",color:"Carey",sku:"MN-HART-CRY",col:"Essential",cat:"Essential",stock:16,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/20.png"},
  {id:27,model:"HART",color:"Honey",sku:"MN-HART-HNY",col:"Essential",cat:"Essential",stock:12,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/Captura_de_pantalla_2025-05-26_a_las_12.54.08.png"},
  /* DENEUVE */
  {id:28,model:"DENEUVE",color:"Tea",sku:"MN-DNVE-TEA",col:"Essential",cat:"Essential",stock:18,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/4.png"},
  {id:29,model:"DENEUVE",color:"Apple",sku:"MN-DNVE-APL",col:"Essential",cat:"Essential",stock:14,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/3.png"},
  {id:50,model:"DENEUVE",color:"Carey",sku:"MN-DNVE-CRY",col:"Essential",cat:"Essential",stock:16,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/5.png"},
  /* TOTTER */
  {id:51,model:"TOTTER",color:"Leaf",sku:"MN-TTTR-LEF",col:"Essential",cat:"Essential",stock:12,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_5627.jpg"},
  {id:52,model:"TOTTER",color:"Black",sku:"MN-TTTR-BLK",col:"Essential",cat:"Essential",stock:20,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_5628_f2009249-e482-469c-bfe6-1aa130f6b96e.jpg"},
  {id:53,model:"TOTTER",color:"Carey",sku:"MN-TTTR-CRY",col:"Essential",cat:"Essential",stock:15,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_5629.jpg"},
  /* RAINER */
  {id:54,model:"RAINER",color:"Caramel",sku:"MN-RNRR-CRM",col:"Essential",cat:"Essential",stock:10,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/9.png"},
  {id:55,model:"RAINER",color:"Mandarine",sku:"MN-RNRR-MND",col:"Essential",cat:"Essential",stock:14,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/8.png"},
  {id:56,model:"RAINER",color:"Carey",sku:"MN-RNRR-CRY",col:"Essential",cat:"Essential",stock:16,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/10.png"},
  /* ARIELLE */
  {id:57,model:"ARIELLE",color:"Velvet",sku:"MN-AREL-VLV",col:"Essential",cat:"Essential",stock:12,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/55.png"},
  {id:58,model:"ARIELLE",color:"Carey",sku:"MN-AREL-CRY",col:"Essential",cat:"Essential",stock:18,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/54.png"},
  {id:59,model:"ARIELLE",color:"Dusty",sku:"MN-AREL-DSY",col:"Essential",cat:"Essential",stock:10,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/53.png"},
  {id:60,model:"ARIELLE",color:"Pale Sandstone",sku:"MN-AREL-PLS",col:"Essential",cat:"Essential",stock:8,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/56.png"},
  /* DOVER */
  {id:61,model:"DOVER",color:"Hunter Blend",sku:"MN-DOVR-HBL",col:"Essential",cat:"Essential",stock:10,fixedPrice:0,tags:["rec"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/47.png"},
  {id:62,model:"DOVER",color:"Tea",sku:"MN-DOVR-TEA",col:"Essential",cat:"Essential",stock:14,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/48.png"},
  {id:63,model:"DOVER",color:"Shadow",sku:"MN-DOVR-SHD",col:"Essential",cat:"Essential",stock:12,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/49.png"},
  /* HAZEL */
  {id:64,model:"HAZEL",color:"Noir",sku:"MN-HAZL-NOR",col:"Essential",cat:"Essential",stock:18,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/52.png"},
  {id:65,model:"HAZEL",color:"Carey",sku:"MN-HAZL-CRY",col:"Essential",cat:"Essential",stock:16,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/51.png"},
  {id:66,model:"HAZEL",color:"Petal",sku:"MN-HAZL-PTL",col:"Essential",cat:"Essential",stock:10,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/50.png"},
  /* COLETTE */
  {id:67,model:"COLETTE",color:"Cocoa",sku:"MN-COLT-COC",col:"Essential",cat:"Essential",stock:14,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/44.png"},
  {id:68,model:"COLETTE",color:"Jungle",sku:"MN-COLT-JNG",col:"Essential",cat:"Essential",stock:12,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/118.png"},
  {id:69,model:"COLETTE",color:"Burnt",sku:"MN-COLT-BRN",col:"Essential",cat:"Essential",stock:16,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/46.png"},
  /* HEDY */
  {id:70,model:"HEDY",color:"Guiza",sku:"MN-HEDY-GZA",col:"Essential",cat:"Essential",stock:15,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/37.png"},
  {id:71,model:"HEDY",color:"Matcha",sku:"MN-HEDY-MTC",col:"Essential",cat:"Essential",stock:18,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/38.png"},
  {id:72,model:"HEDY",color:"Jara",sku:"MN-HEDY-JRA",col:"Essential",cat:"Essential",stock:14,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/39.png"},
  /* BOLDEN */
  {id:73,model:"BOLDEN",color:"Ebony",sku:"MN-BLDN-EBN",col:"Essential",cat:"Essential",stock:20,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/193.png"},
  {id:74,model:"BOLDEN",color:"Bruma",sku:"MN-BLDN-BRM",col:"Essential",cat:"Essential",stock:12,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/194.png"},
  {id:75,model:"BOLDEN",color:"Oliva",sku:"MN-BLDN-OLV",col:"Essential",cat:"Essential",stock:14,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/MINUE_12.png"},
  {id:175,model:"BOLDEN",color:"Wine",sku:"MN-BLDN-WNE",col:"Essential",cat:"Essential",stock:12,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/43.png"},
  {id:76,model:"BOLDEN",color:"Nude",sku:"MN-BLDN-NDE",col:"Essential",cat:"Essential",stock:10,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/MINUE_11.png"},
  /* NOVA */
  {id:77,model:"NOVA",color:"Black",sku:"MN-NOVA-BLK",col:"Essential",cat:"Essential",stock:22,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/193.png"},
  {id:78,model:"NOVA",color:"Jade",sku:"MN-NOVA-JDE",col:"Essential",cat:"Essential",stock:16,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/193.png"},
  {id:79,model:"NOVA",color:"Ruby",sku:"MN-NOVA-RBY",col:"Essential",cat:"Essential",stock:12,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/193.png"},

  /* ── ACETATO ── */
  /* SIENNA */
  {id:30,model:"SIENNA",color:"Sepia",sku:"MN-SIEN-SPA",col:"Acetato",cat:"Acetato",stock:8,fixedPrice:ACETATO_PRICE,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/29.png"},
  {id:31,model:"SIENNA",color:"Bold",sku:"MN-SIEN-BLD",col:"Acetato",cat:"Acetato",stock:10,fixedPrice:ACETATO_PRICE,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/33_3c040278-f06c-433f-af83-8c28b46300bb.png"},
  /* ASTOR */
  {id:32,model:"ASTOR",color:"Green",sku:"MN-ASTR-GRN",col:"Acetato",cat:"Acetato",stock:12,fixedPrice:ACETATO_PRICE,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/31.png"},
  {id:33,model:"ASTOR",color:"Bronze",sku:"MN-ASTR-BRZ",col:"Acetato",cat:"Acetato",stock:10,fixedPrice:ACETATO_PRICE,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/27.png"},
  /* ARDEN */
  {id:34,model:"ARDEN",color:"Cocoa",sku:"MN-ARDN-COC",col:"Acetato",cat:"Acetato",stock:8,fixedPrice:ACETATO_PRICE,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/98.png"},
  {id:35,model:"ARDEN",color:"Champagne",sku:"MN-ARDN-CHP",col:"Acetato",cat:"Acetato",stock:12,fixedPrice:ACETATO_PRICE,tags:["top","new"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/120.png"},
  {id:36,model:"ARDEN",color:"Carey",sku:"MN-ARDN-CRY",col:"Acetato",cat:"Acetato",stock:10,fixedPrice:ACETATO_PRICE,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/121.png"},
  /* BARDOT */
  {id:37,model:"BARDOT",color:"Carey",sku:"MN-BRDT-CRY",col:"Acetato",cat:"Acetato",stock:14,fixedPrice:ACETATO_PRICE,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/33.png"},
  /* JUNO */
  {id:38,model:"JUNO",color:"Shade",sku:"MN-JUNO-SHD",col:"Acetato",cat:"Acetato",stock:10,fixedPrice:ACETATO_PRICE,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/28.png"},
  /* NOVAK */
  {id:39,model:"NOVAK",color:"Carey",sku:"MN-NOVK-CRY",col:"Acetato",cat:"Acetato",stock:12,fixedPrice:ACETATO_PRICE,tags:["new","rec"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/91.png"},
  {id:40,model:"NOVAK",color:"Mocha",sku:"MN-NOVK-MCH",col:"Acetato",cat:"Acetato",stock:8,fixedPrice:ACETATO_PRICE,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/92.png"},
  /* IVY */
  {id:41,model:"IVY",color:"Felline",sku:"MN-IVY-FLN",col:"Acetato",cat:"Acetato",stock:10,fixedPrice:ACETATO_PRICE,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/113.png"},
  /* LEIHGT */
  {id:42,model:"LEIHGT",color:"Chalk",sku:"MN-LHGT-CHK",col:"Acetato",cat:"Acetato",stock:6,fixedPrice:ACETATO_PRICE,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/112.png"},
  /* HAYEK */
  {id:43,model:"HAYEK",color:"Carey",sku:"MN-HAYK-CRY",col:"Acetato",cat:"Acetato",stock:12,fixedPrice:ACETATO_PRICE,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/85.png"},
  {id:44,model:"HAYEK",color:"Olive",sku:"MN-HAYK-OLV",col:"Acetato",cat:"Acetato",stock:10,fixedPrice:ACETATO_PRICE,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/86.png"},
  {id:45,model:"JUNO",color:"Sienna",sku:"MN-JUNO-SNA",col:"Acetato",cat:"Acetato",stock:10,fixedPrice:ACETATO_PRICE,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/28.png"},
  /* BLYTH */
  {id:46,model:"BLYTH",color:"Greenwave",sku:"MN-BLTH-GRW",col:"Essential",cat:"Essential",stock:15,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/11.png"},
  {id:47,model:"BLYTH",color:"Carey",sku:"MN-BLTH-CRY",col:"Essential",cat:"Essential",stock:15,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/12.png"},
  /* COOPER II */
  {id:48,model:"COOPER II",color:"Caramel",sku:"MN-COP2-CRM",col:"Essential",cat:"Essential",stock:12,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_5615.jpg"},
  {id:49,model:"COOPER II",color:"Buttercup",sku:"MN-COP2-BTC",col:"Essential",cat:"Essential",stock:12,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_5622.jpg"},
  {id:50,model:"COOPER II",color:"Havana",sku:"MN-COP2-HVN",col:"Essential",cat:"Essential",stock:12,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_5618.jpg"},
  {id:51,model:"COOPER II",color:"Grass",sku:"MN-COP2-GRS",col:"Essential",cat:"Essential",stock:12,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_5620.jpg"},
  {id:52,model:"COOPER II",color:"Tiger",sku:"MN-COP2-TGR",col:"Essential",cat:"Essential",stock:12,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_5617.jpg"},
  {id:53,model:"COOPER II",color:"Sierra",sku:"MN-COP2-SRA",col:"Essential",cat:"Essential",stock:12,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_5616.jpg"},
  {id:178,model:"COOPER II",color:"Moonlight",sku:"MN-COP2-MLT",col:"Essential",cat:"Essential",stock:12,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_5619.jpg"},
  {id:179,model:"CHASTAIN",color:"Rouge Light",sku:"MN-CHST-RLT",col:"Essential",cat:"Essential",stock:10,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/sa.png"},
  {id:180,model:"CHASTAIN",color:"Noir Violet",sku:"MN-CHST-NVL",col:"Essential",cat:"Essential",stock:10,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/sadascas.png"},
  {id:181,model:"CHASTAIN",color:"Carey",sku:"MN-CHST-CRY",col:"Essential",cat:"Essential",stock:10,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/jjiasda.png"},
  {id:182,model:"CHASTAIN",color:"Olive",sku:"MN-CHST-OLV",col:"Essential",cat:"Essential",stock:10,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/saxaa.png"},
  {id:183,model:"BACALL",color:"Carey",sku:"MN-BCLL-CRY",col:"Essential",cat:"Essential",stock:10,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_5600.jpg"},
  {id:184,model:"SEBERG",color:"Amber",sku:"MN-SBRG-AMB",col:"Essential",cat:"Essential",stock:10,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/15.png"},
  {id:185,model:"HART",color:"Havana",sku:"MN-HART-HVN",col:"Essential",cat:"Essential",stock:10,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/20.png"},
  {id:186,model:"LAWRENCE",color:"Bay",sku:"MN-LWRC-BAY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/IMG_4505.jpg"},
  {id:187,model:"LOREN",color:"Black",sku:"MN-LORN-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/IMG_8114.jpg"},
  {id:188,model:"MACLAINE",color:"Tea",sku:"MN-MCLN-TEA",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/IMG_4503.jpg"},
  /* ── ICONS ── */
  /* GUGU */
  {id:100,model:"GUGU",color:"Gold Green",sku:"MN-GUGU-GGR",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/GUGUGOLDGREENMINUEWEB.png"},
  /* MOORE */
  {id:101,model:"MOORE",color:"Kaffa",sku:"MN-MOOR-KFA",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/MOORECAREY.png"},
  {id:102,model:"MOORE",color:"Black",sku:"MN-MOOR-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/MOOREBLACK.png"},
  /* CLEO */
  {id:103,model:"CLEO",color:"Tea",sku:"MN-CLEO-TEA",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_2571_3f836e1a-078b-4f97-8b6e-0e6d0dbc30d7.jpg"},
  {id:104,model:"CLEO",color:"Black",sku:"MN-CLEO-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_2568_0cdea3e3-91be-451b-97a0-301f495895da.jpg"},
  /* GRANT */
  {id:105,model:"GRANT",color:"Black",sku:"MN-GRNT-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_5614.jpg"},
  {id:106,model:"GRANT",color:"Carey",sku:"MN-GRNT-CRY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_5612.jpg"},
  {id:107,model:"GRANT",color:"Caramel",sku:"MN-GRNT-CRM",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_5613.jpg"},
  /* BERRY */
  {id:108,model:"BERRY",color:"Navy",sku:"MN-BRRY-NVY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_0256.jpg"},
  {id:109,model:"BERRY",color:"Carbon",sku:"MN-BRRY-CRB",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_0241.jpg"},
  {id:110,model:"BERRY",color:"Carey Brown",sku:"MN-BRRY-CBR",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_3770.jpg"},
  {id:111,model:"BERRY",color:"Tea",sku:"MN-BRRY-TEA",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_0263.jpg"},
  /* STONE */
  {id:112,model:"STONE",color:"Black",sku:"MN-STON-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_0231.jpg"},
  {id:113,model:"STONE",color:"Tea",sku:"MN-STON-TEA",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_0217.jpg"},
  /* FOSTER */
  {id:114,model:"FOSTER",color:"Gold-Black",sku:"MN-FSTR-GBK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_0248.jpg"},
  {id:115,model:"FOSTER",color:"Carbon",sku:"MN-FSTR-CRB",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_0250.jpg"},
  {id:116,model:"FOSTER",color:"Gold-Brown",sku:"MN-FSTR-GBR",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_0246.jpg"},
  /* ROBERTS */
  {id:117,model:"ROBERTS",color:"Carrot",sku:"MN-RBRT-CRT",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_2547.jpg"},
  {id:118,model:"ROBERTS",color:"Peanut",sku:"MN-RBRT-PNT",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_2546.jpg"},
  {id:119,model:"ROBERTS",color:"Jasper",sku:"MN-RBRT-JSP",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_2549.jpg"},
  {id:120,model:"ROBERTS",color:"Black",sku:"MN-RBRT-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_3768.jpg"},
  {id:121,model:"ROBERTS",color:"Green Carey",sku:"MN-RBRT-GCR",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_3774.jpg"},
  {id:122,model:"ROBERTS",color:"Carey",sku:"MN-RBRT-CRY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_2548.jpg"},
  /* THURMAN */
  {id:123,model:"THURMAN",color:"Black",sku:"MN-THRM-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_2553.jpg"},
  {id:124,model:"THURMAN",color:"Carey",sku:"MN-THRM-CRY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_2556.jpg"},
  {id:125,model:"THURMAN",color:"Ember",sku:"MN-THRM-EMB",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_5592.jpg"},
  {id:126,model:"THURMAN",color:"Caramel",sku:"MN-THRM-CRM",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_5625.jpg"},
  {id:127,model:"THURMAN",color:"Cloud",sku:"MN-THRM-CLD",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_3764.jpg"},
  /* MACLAINE */
  {id:128,model:"MACLAINE",color:"Tea",sku:"MN-MCLN-TEA",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/IMG_4503.jpg"},
  {id:129,model:"MACLAINE",color:"Black",sku:"MN-MCLN-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/IMG_4504.jpg"},
  /* LAWRENCE */
  {id:130,model:"LAWRENCE",color:"Guiza",sku:"MN-LWRC-GZA",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/image_b5a853c2-8868-432d-b7a6-df3510f4be8c.webp"},
  {id:131,model:"LAWRENCE",color:"Caramel",sku:"MN-LWRC-CRM",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/IMG_4508.jpg"},
  {id:132,model:"LAWRENCE",color:"Carey",sku:"MN-LWRC-CRY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_0211.jpg"},
  {id:133,model:"LAWRENCE",color:"Bay",sku:"MN-LWRC-BAY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/IMG_4505.jpg"},
  {id:134,model:"LAWRENCE",color:"Velvet",sku:"MN-LWRC-VLV",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_5843.jpg"},
  {id:135,model:"LAWRENCE",color:"Black",sku:"MN-LWRC-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/IMG_4505.jpg"},
  /* MIRREN */
  {id:136,model:"MIRREN",color:"Black",sku:"MN-MRRN-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/IMG_4511.jpg"},
  {id:137,model:"MIRREN",color:"Carey",sku:"MN-MRRN-CRY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_0212.jpg"},
  {id:138,model:"MIRREN",color:"Tea",sku:"MN-MRRN-TEA",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/IMG_4510.jpg"},
  /* LANE */
  {id:139,model:"LANE",color:"Black",sku:"MN-LANE-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_5628.jpg"},
  {id:140,model:"LANE",color:"Lightblue",sku:"MN-LANE-LBL",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_3766.jpg"},
  {id:141,model:"LANE",color:"Opal",sku:"MN-LANE-OPL",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_3776.jpg"},
  {id:142,model:"LANE",color:"Tea",sku:"MN-LANE-TEA",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_3771.jpg"},
  {id:143,model:"LANE",color:"Ambar",sku:"MN-LANE-AMB",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_3765.jpg"},
  {id:144,model:"LANE",color:"Carey",sku:"MN-LANE-CRY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_3767_d9fd096e-b787-435c-9c15-18dd34ea86ce.jpg"},
  {id:145,model:"LANE",color:"Grass",sku:"MN-LANE-GRS",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_3769.jpg"},
  /* HARLOW */
  {id:146,model:"HARLOW",color:"Gold-Green",sku:"MN-HRLW-GGR",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/Myproject-1_4.png"},
  {id:147,model:"HARLOW",color:"Gold-Brown",sku:"MN-HRLW-GBR",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_0251.jpg"},
  {id:148,model:"HARLOW",color:"Gold-Black",sku:"MN-HRLW-GBK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/Myproject-1.png"},
  /* MAKEY */
  {id:149,model:"MAKEY",color:"Carey",sku:"MN-MAKY-CRY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/MAKEYCAREYWEB.png"},
  {id:150,model:"MAKEY",color:"Black Cherry",sku:"MN-MAKY-BCH",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/M3RB.png"},
  {id:151,model:"MAKEY",color:"Black",sku:"MN-MAKY-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/MAKEYBLACKWEB.png"},
  {id:152,model:"MAKEY",color:"Snow",sku:"MN-MAKY-SNW",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/MBLNEGW.png"},
  /* LOREN */
  {id:153,model:"LOREN",color:"Toffee",sku:"MN-LORN-TFE",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/IMG_4650.jpg"},
  {id:154,model:"LOREN",color:"Cream",sku:"MN-LORN-CRM",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_5838.jpg"},
  {id:155,model:"LOREN",color:"Black",sku:"MN-LORN-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/IMG_8114.jpg"},
  {id:156,model:"LOREN",color:"Carey",sku:"MN-LORN-CRY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/IMG_4647.jpg"},
  /* CARROL */
  {id:157,model:"CARROL",color:"Rowan",sku:"MN-CRRL-RWN",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_0258.jpg"},
  {id:158,model:"CARROL",color:"Cedar",sku:"MN-CRRL-CDR",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_0254.jpg"},
  /* ARETHA */
  {id:159,model:"ARETHA",color:"Rosse",sku:"MN-ARTH-RSS",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/IMG_8147.jpg"},
  {id:160,model:"ARETHA",color:"Carey",sku:"MN-ARTH-CRY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/IMG_8156.jpg"},
  {id:161,model:"ARETHA",color:"Black",sku:"MN-ARTH-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/IMG_8160.jpg"},
  /* KARINA */
  {id:162,model:"KARINA",color:"Copo",sku:"MN-KRNA-CPO",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_0235.jpg"},
  {id:163,model:"KARINA",color:"Jade",sku:"MN-KRNA-JDE",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/Minueoptician210222-010.jpg"},
  {id:164,model:"KARINA",color:"Black",sku:"MN-KRNA-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/IMG_4507.jpg"},
  {id:165,model:"KARINA",color:"Ruby",sku:"MN-KRNA-RBY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/Minueoptician210222-011.jpg"},
  /* ZIYI */
  {id:166,model:"ZIYI",color:"Mandarine",sku:"MN-ZIYI-MND",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_5842.jpg"},
  {id:167,model:"ZIYI",color:"Rosse",sku:"MN-ZIYI-RSS",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_0220.jpg"},
  {id:168,model:"ZIYI",color:"Jasper",sku:"MN-ZIYI-JSP",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_5844.jpg"},
  {id:169,model:"ZIYI",color:"Agate",sku:"MN-ZIYI-AGT",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_5839.jpg"},
  {id:170,model:"ZIYI",color:"Amber",sku:"MN-ZIYI-AMB",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_5840.jpg"},
  /* LAMARR */
  {id:171,model:"LAMARR",color:"Carbon Mate",sku:"MN-LMRR-CMT",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/IMG_4646.jpg"},
  {id:172,model:"LAMARR",color:"Louvre",sku:"MN-LMRR-LVR",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/IMG_4639.jpg"},
  {id:173,model:"LAMARR",color:"Carey",sku:"MN-LMRR-CRY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/products/IMG_4649.jpg"},
  {id:174,model:"LAMARR",color:"Dark",sku:"MN-LMRR-DRK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_3772.jpg"},
  /* KERR */
  {id:176,model:"KERR",color:"Black",sku:"MN-KERR-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_5635.jpg"},
  {id:177,model:"KERR",color:"Carey",sku:"MN-KERR-CRY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"],imageUrl:"https://cdn.shopify.com/s/files/1/0052/2797/0629/files/IMG_5634.jpg"}
];

const ORDERS_INIT = [];

const CLIENTS_INIT = [];

const TASKS_INIT = [];

const FAQ_INIT = [
  {id:1,q:{fr:"Quel est le minimum de commande ?",es:"¿Cuál es el pedido mínimo?",en:"What is the minimum order?",it:"What is the minimum order?"},a:{fr:"Il n'y a pas de minimum par modèle. Le prix unitaire dépend du volume total de votre commande (voir Tarifs).",es:"No hay mínimo por modelo. El precio unitario depende del volumen total del pedido (ver Tarifas).",en:"No minimum per model. Unit price depends on your total order volume (see Pricing).",it:"No minimum per model. Unit price depends on your total order volume (see Pricing)."},on:true},
  {id:2,q:{fr:"Comment fonctionne le pronto pago ?",es:"¿Cómo funciona el pronto pago?",en:"How does early payment work?",it:"How does early payment work?"},a:{fr:"Si vous payez dans les 7 jours suivant la facture, vous bénéficiez d'une remise de 3% sur le total. Cette option est activée par votre gestionnaire.",es:"Si pagas en los 7 días siguientes a la factura, obtienes un 3% de descuento. Esta opción la activa tu gestor.",en:"Pay within 7 days of invoice for a 3% discount. Your account manager enables this option.",it:"Pay within 7 days of invoice for a 3% discount. Your account manager enables this option."},on:true},
  {id:3,q:{fr:"Quels sont les délais de livraison ?",es:"¿Cuáles son los plazos de envío?",en:"What are delivery times?",it:"What are delivery times?"},a:{fr:"Envoi sous 48-72h après confirmation. Livraison gratuite à partir de 20 unités.",es:"Envío en 48-72h tras confirmación. Envío gratuito a partir de 20 unidades.",en:"Ships within 48-72h after confirmation. Free shipping from 20 units.",it:"Ships within 48-72h after confirmation. Free shipping from 20 units."},on:true},
  {id:4,q:{fr:"La collection Acetato a-t-elle les mêmes tarifs ?",es:"¿La colección Acetato tiene las mismas tarifas?",en:"Does Acetato have the same pricing?",it:"Does Acetato have the same pricing?"},a:{fr:"Non. L'Acetato a un prix fixe de 29,90 €/unité, indépendant du volume. Seule la collection Essential suit les tarifs dégressifs.",es:"No. El Acetato tiene un precio fijo de 29,90 €/unidad, independiente del volumen. Solo la colección Essential sigue las tarifas por volumen.",en:"No. Acetato has a fixed price of €29.90/unit regardless of volume. Only Essential follows volume tiers.",it:"No. Acetato has a fixed price of €29.90/unit regardless of volume. Only Essential follows volume tiers."},on:true},
  {id:5,q:{fr:"Comment obtenir les photos produit ?",es:"¿Cómo obtener las fotos del producto?",en:"How to get product photos?",it:"How to get product photos?"},a:{fr:"Rendez-vous dans la section Ressources pour télécharger les photos HD, logos et textes commerciaux.",es:"Ve a la sección Recursos para descargar fotos HD, logos y textos comerciales.",en:"Visit the Resources section to download HD photos, logos and commercial texts.",it:"Visit the Resources section to download HD photos, logos and commercial texts."},on:true},
];

const NEWS_INIT = [];

const PROMOS_INIT = [];

const INSIGHTS_INIT = [
  {id:1,icon:"📊",title:{fr:"Marge sectorielle élevée",es:"Margen de categoría alto",en:"High category margin",it:"Margine di categoria elevato"},text:{fr:"Les lunettes de soleil ont une marge moyenne de 60-70% en boutique multimarque (Euromonitor 2024).",es:"Las gafas de sol tienen un margen medio del 60-70% en boutique multimarca (Euromonitor 2024).",en:"Sunglasses have an average 60-70% margin in multi-brand boutiques (Euromonitor 2024).",it:"Gli occhiali da sole hanno un margine medio del 60-70% in boutique multimarca (Euromonitor 2024)."},on:true},
  {id:2,icon:"☀️",title:{fr:"Saison qui démarre",es:"Temporada que arranca",en:"Season starting now",it:"Stagione che inizia"},text:{fr:"La saison des lunettes de soleil démarre en mars. 70% des ventes se concentrent de mars à août.",es:"La temporada de gafas de sol arranca en marzo. El 70% de las ventas se concentra de marzo a agosto.",en:"Sunglasses season starts in March. 70% of sales happen March to August.",it:"La stagione degli occhiali da sole inizia a marzo. Il 70% delle vendite avviene da marzo ad agosto."},on:true},
  {id:3,icon:"💎",title:{fr:"Ticket moyen plus élevé",es:"Ticket medio más alto",en:"Higher average ticket",it:"Ticket medio più alto"},text:{fr:"Un client qui achète des lunettes de soleil dépense 35% de plus dans le panier complet (Statista 2024).",es:"Un cliente que compra gafas de sol gasta un 35% más en el ticket completo (Statista 2024).",en:"A customer buying sunglasses spends 35% more on total basket (Statista 2024).",it:"Un cliente che acquista occhiali da sole spende il 35% in più sul carrello totale (Statista 2024)."},on:false},
];

const USERS_INIT = [
  {email:"hola@minueopticians.com",pw:"minue2026",role:"admin",name:"Alejandro",co:"Minuë Opticians",lang:"es"},
  {email:"showroom@agentsud.fr",pw:"agent2026",role:"distributor",name:"Marc",co:"Agent Sud Showroom",commRate:15,lang:"fr"},
  {email:"agnes@lebruitdesvagues.fr",pw:"vagues2026",role:"client",name:"Agnès",co:"Le Bruit des Vagues",lang:"fr"},
  {email:"claire@rivoli.fr",pw:"rivoli2026",role:"client",name:"Claire",co:"Optique Rivoli",lang:"fr"},
  {email:"lucas@cslyon.fr",pw:"lyon2026",role:"client",name:"Lucas",co:"Concept Store Lyon",lang:"fr"},
  {email:"anna@brillen.de",pw:"brillen2026",role:"client",name:"Anna",co:"Brillen Hamburg",lang:"en"},
];

const FLAGS = {fr:"FR",es:"ES",en:"EN",it:"IT"};

/* ═══ SHARED UI ═══ */
const Badge = ({l, c}) => (
  <span style={{fontSize:10,padding:"3px 10px",borderRadius:20,fontFamily:BD,color:c,background:c+"14",fontWeight:600,whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:5,border:"1px solid "+c+"22"}}>
    <span style={{width:5,height:5,borderRadius:3,background:c,flexShrink:0}} />{l}
  </span>
);
const Btn = ({children, onClick, disabled, small, ghost, style}) => (
  <button onClick={onClick} disabled={disabled} style={{padding:small?"7px 14px":"11px 22px",background:disabled?C.gr2:ghost?"transparent":C.dk,color:ghost?C.dk:C.bg,border:ghost?"1px solid "+C.ln:"none",fontSize:small?11:12,cursor:disabled?"default":"pointer",fontFamily:BD,fontWeight:500,borderRadius:3,...(style||{})}}>{children}</button>
);

const Sec = ({title, sub, right, children}) => (
  <div className="viewfade" style={{padding:"20px min(24px, 4vw)"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:sub?6:18,flexWrap:"wrap",gap:8}}>
      <h1 style={{fontSize:"min(26px, 5.5vw)",fontWeight:500,letterSpacing:0.5,margin:0,fontFamily:DP,color:C.dk,lineHeight:1.2}}>{title}</h1>
      {right}
    </div>
    {sub && <p style={{color:C.gr,fontSize:12,fontFamily:BD,margin:"0 0 18px",lineHeight:1.5}}>{sub}</p>}
    {children}
  </div>
);

/* ═══ MAIN APP ═══ */
export default function App() {
  const [darkMode] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [dismissedNotifs, setDismissedNotifs] = useState(() => {
    try {
      const stored = typeof window !== "undefined" && localStorage.getItem("minue_dismissed_notifs");
      if (stored) {
        const parsed = JSON.parse(stored);
        const today = new Date().toDateString();
        // Reset if from a different day
        if (parsed.date !== today) return { date: today, ids: [] };
        return parsed;
      }
    } catch(e) {}
    return { date: new Date().toDateString(), ids: [] };
  });
  const dismissNotif = (id) => {
    setDismissedNotifs(p => {
      const today = new Date().toDateString();
      const newDismissed = p.date === today ? { date: today, ids: [...p.ids, id] } : { date: today, ids: [id] };
      try { localStorage.setItem("minue_dismissed_notifs", JSON.stringify(newDismissed)); } catch(e) {}
      return newDismissed;
    });
  };
  const dismissAllNotifs = (ids) => {
    setDismissedNotifs(p => {
      const today = new Date().toDateString();
      const baseIds = p.date === today ? p.ids : [];
      const newDismissed = { date: today, ids: [...new Set([...baseIds, ...ids])] };
      try { localStorage.setItem("minue_dismissed_notifs", JSON.stringify(newDismissed)); } catch(e) {}
      return newDismissed;
    });
  };
  C = darkMode ? CD : CL;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lang, _setLang] = useState("fr");
  const setLang = (l) => { _setLang(l); try { localStorage.setItem("minue_lang", l); const s = localStorage.getItem("minue_session"); if (s) { const sess = JSON.parse(s); sess.user.lang = l; localStorage.setItem("minue_session", JSON.stringify(sess)); } } catch(e) { console.log('DB error:', e); } };
  const [view, _setView] = useState("c-cat");
  const setView = (v) => { _setView(v); try { localStorage.setItem("minue_view", v); } catch(e) { console.log('DB error:', e); } };
  const [hydrated, setHydrated] = useState(false);
  // Hydrate from localStorage AFTER mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      // Language: saved manual choice > browser language > EN fallback
      const savedLang = localStorage.getItem("minue_lang");
      if (savedLang && ["fr","es","en","it"].includes(savedLang)) {
        _setLang(savedLang);
      } else {
        const navLang = ((navigator.language || navigator.userLanguage || "en").slice(0,2)).toLowerCase();
        _setLang(["fr","es","en","it"].includes(navLang) ? navLang : "en");
      }
      const s = localStorage.getItem("minue_session");
      if (s) {
        const sess = JSON.parse(s);
        if (Date.now() - sess.ts > 86400000) {
          localStorage.removeItem("minue_session");
          localStorage.removeItem("minue_view");
          setLoading(false);
        } else {
          setUser(sess.user);
          _setLang(sess.user?.lang || "fr");
        }
      } else {
        const bl = typeof navigator !== "undefined" && navigator.language?.substring(0,2);
        _setLang(bl === "es" ? "es" : bl === "en" ? "en" : bl === "it" ? "it" : "fr");
        setLoading(false);
      }
      const v = localStorage.getItem("minue_view");
      if (v) _setView(v);
    } catch(e) { setLoading(false); }
    setHydrated(true);
  }, []);
  const [cart, setCart] = useState({});
  const [cartHydrated, setCartHydrated] = useState(false);
  // Load cart from localStorage AFTER user is hydrated. Single-fire per user.
  useEffect(() => {
    if (!hydrated || !user?.email) { setCartHydrated(false); return; }
    let loaded = false;
    try {
      const saved = localStorage.getItem("minue_cart_"+user.email);
      if (saved) {
        const parsed = JSON.parse(saved);
        const ageDays = (Date.now() - (parsed?.savedAt||0)) / (1000*60*60*24);
        if (ageDays < 7 && parsed && parsed.cart && typeof parsed.cart === "object" && !Array.isArray(parsed.cart)) {
          // Sanitize: only keep entries that are positive integers
          const clean = {};
          Object.entries(parsed.cart).forEach(([k,v]) => {
            const qty = parseInt(v);
            if (k && Number.isFinite(qty) && qty > 0) clean[k] = qty;
          });
          if (Object.keys(clean).length > 0) {
            setCart(clean);
            loaded = true;
          }
        } else if (ageDays >= 7) {
          localStorage.removeItem("minue_cart_"+user.email);
        }
      }
    } catch(e) {
      try { localStorage.removeItem("minue_cart_"+user.email); } catch(_) {}
    }
    // Mark hydrated AFTER setCart (one tick later via setTimeout 0)
    setTimeout(() => setCartHydrated(true), 0);
  }, [hydrated, user?.email]);
  // Save cart to localStorage. Only after cartHydrated to avoid wiping saved data on first mount.
  useEffect(() => {
    if (!hydrated || !cartHydrated || !user?.email) return;
    try {
      if (cart && typeof cart === "object" && Object.keys(cart).length > 0) {
        localStorage.setItem("minue_cart_"+user.email, JSON.stringify({cart, savedAt: Date.now()}));
      } else {
        localStorage.removeItem("minue_cart_"+user.email);
      }
    } catch(e) {}
  }, [cart, cartHydrated, hydrated, user?.email]);
  const [cartCl, setCartCl] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [registerMode, setRegisterMode] = useState(false);
  const [regData, setRegData] = useState({name:"",co:"",email:"",city:"",country:"",phone:"",web:"",message:""});
  const [referralCode, setReferralCode] = useState("");
  const [referralDist, setReferralDist] = useState(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [storeGuideOpen, setStoreGuideOpen] = useState(false);
  const [regSent, setRegSent] = useState(false);
  const [orders, setOrders] = useState(ORDERS_INIT);
  const [clients, setClients] = useState(CLIENTS_INIT);
  const [products, setProducts] = useState(PRODUCTS_INIT);
  const [users, setUsers] = useState(USERS_INIT);

  // Parse ?ref= from URL on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      if (ref) {
        setReferralCode(ref);
        setRegisterMode(true);
      }
    }
  }, []);

  // Match referral to distributor once users loaded
  useEffect(() => {
    if (referralCode && users.length > 0) {
      const dist = users.find(u => u.role === "distributor" && (u.referralCode === referralCode || (u.co||"").toLowerCase().replace(/[^a-z0-9]/g,"") === referralCode.toLowerCase().replace(/[^a-z0-9]/g,"")));
      if (dist) setReferralDist(dist);
    }
  }, [referralCode, users]);
  const [promos, setPromos] = useState(PROMOS_INIT);
  const [productCosts, setProductCosts] = useState({}); // {productId: {supplier, freight, customs, packaging}}
  const [channelConfig, setChannelConfig] = useState({
    direct: {whoPaysShipping:"client", avgShippingEU:0, avgShippingIntl:0, commission:0},
    faire: {commissionNew:17, commissionRecurring:10, whoPaysShipping:"minue", avgShippingEU:0, avgShippingIntl:0},
    distributor: {commission:15, whoPaysShipping:"minue", avgShippingEU:0, avgShippingIntl:0}
  });
  const [fixedCosts, setFixedCosts] = useState([]); // [{id, name, category, amount, frequency}]
  const [aiChat, setAiChat] = useState([]); // [{role, content}]
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiFloatOpen, setAiFloatOpen] = useState(false);
  const [floatChat, setFloatChat] = useState([]);
  const [floatInput, setFloatInput] = useState("");
  const [floatLoading, setFloatLoading] = useState(false);
  const [floatError, setFloatError] = useState("");
  const [prospects, setProspects] = useState([]); // mini-CRM distribuidores
  const [toasts, setToasts] = useState([]); // [{id, msg, type}]
  const toast = (msg, type="success") => { const id = Date.now()+Math.random(); setToasts(p => [...p, {id, msg, type}]); setTimeout(() => setToasts(p => p.filter(x => x.id !== id)), 3200); };
  const [confirmBox, setConfirmBox] = useState(null); // {msg, onYes}
  const askConfirm = (msg, onYes) => setConfirmBox({msg, onYes});
  const [productAlerts, setProductAlerts] = useState([]); // [{id, client_email, product_id}]
  const dbAddAlert = async (productId) => { if (!dbReady) return; try { const {data} = await supabase.from("product_alerts").insert({client_email:user.email, client_name:user.co||user.name, product_id:productId}).select().single(); if (data) setProductAlerts(p => [...p, data]); } catch(e) { console.log("alert err", e); } };
  const dbRemoveAlert = async (alertId) => { if (!dbReady) return; try { await supabase.from("product_alerts").delete().eq("id",alertId); setProductAlerts(p => p.filter(a => a.id !== alertId)); } catch(e) {} };
  const [news, setNews] = useState(NEWS_INIT);
  const [insights, setInsights] = useState(INSIGHTS_INIT);
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [msgFilter, setMsgFilter] = useState("all");
  const [msgReplyText, setMsgReplyText] = useState("");
  const [accountData, setAccountData] = useState({});
  const [accountSaved, setAccountSaved] = useState(false);
  const [faqs, setFaqs] = useState(FAQ_INIT);
  const [tasks, setTasks] = useState(TASKS_INIT);
  const [timeclock, setTimeclock] = useState([]);
  const [clockStatus, setClockStatus] = useState(null);
  const [geoError, setGeoError] = useState("");
  const OFFICE_LAT = 37.39926;
  const OFFICE_LNG = -5.98668;
  const MAX_DISTANCE = 20;
  const [taskFilter, setTaskFilter] = useState("all");
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpExpanded, setHelpExpanded] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [clientFilter, setClientFilter] = useState("all");
  const [clientChannelFilter, setClientChannelFilter] = useState("all");
  const [clientSortBy, setClientSortBy] = useState("recent");
  const [clientViewMode, setClientViewMode] = useState("cards");
  const [clientCountryFilter, setClientCountryFilter] = useState("all");
  const [selectedDistChannel, setSelectedDistChannel] = useState(null);
  const [ordStatusFilter, setOrdStatusFilter] = useState("all");
  const [ordPayFilter, setOrdPayFilter] = useState("all");
  const [stockSearch, setStockSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [stockShowAll, setStockShowAll] = useState(false);
  const [expandedModels, setExpandedModels] = useState({});
  const [cartNotes, setCartNotes] = useState("");
  const [favs, setFavs] = useState([]);
  const dbToggleFav = async (productId) => { if (!dbReady || !user) return; try { const isFav = favs.includes(productId); if (isFav) { await supabase.from("user_favorites").delete().eq("user_email", user.email).eq("product_id", productId); } else { await supabase.from("user_favorites").insert({user_email: user.email, product_id: productId}); } } catch(e) { console.log("Fav error:", e); } };
  const dbAddDefective = async (d) => { if (!dbReady) return; try { const {data} = await supabase.from("defective_products").insert({model:d.model,color:d.color,sku:d.sku,quantity:d.quantity||1,description:d.description||"",status:"pending",created_by:user?.name||""}).select().single(); if (data) setDefectives(p => [data, ...p]); } catch(e) { console.log("Defective error:", e); } };
  const dbUpdateDefective = async (d) => { if (!dbReady) return; try { await supabase.from("defective_products").update({quantity:d.quantity,description:d.description,status:d.status}).eq("id",d.id); setDefectives(p => p.map(x => x.id === d.id ? {...x,...d} : x)); } catch(e) { console.log("Defective error:", e); } };
  const dbUpdatePackInv = async (itemType, qty, note) => { if (!dbReady) return; try { await supabase.from("packaging_inventory").update({quantity:qty,updated_at:new Date().toISOString(),updated_by:user?.name||""}).eq("item_type",itemType); await supabase.from("packaging_log").insert({item_type:itemType,change:qty-packStock[itemType],note:note||"",created_by:user?.name||""}); setPackStock(p => ({...p,[itemType]:qty})); } catch(e) { console.log("Pack inv error:", e); } };
  const [favFilter, setFavFilter] = useState(false);
  const [privateNotes, setPrivateNotes] = useState({});
  const [packItems, setPackItems] = useState([
    {id:1,type:"Étui",name:{fr:"Étui rigide Minuë",es:"Funda rígida Minuë",en:"Minuë hard case",it:"Custodia rigida Minuë"},desc:{fr:"Étui noir avec logo doré, inclus avec chaque paire",es:"Funda negra con logo dorado, incluida con cada par",en:"Black case with gold logo, included with every pair",it:"Custodia nera con logo dorato, inclusa con ogni paio"},imageUrl:"https://cdn.shopify.com/s/files/1/0783/5765/0865/files/funda_minue.jpg",on:true},
    {id:2,type:"Étui",name:{fr:"Étui souple voyage",es:"Funda blanda viaje",en:"Soft travel case",it:"Custodia morbida da viaggio"},desc:{fr:"Pochette microfibre avec cordon",es:"Bolsa microfibra con cordón",en:"Microfibre pouch with drawstring",it:"Custodia microfibra con coulisse"},imageUrl:"",on:true},
    {id:3,type:"Display",name:{fr:"Présentoir comptoir 6 pièces",es:"Expositor mostrador 6 uds",en:"Counter display 6 pcs",it:"Espositore banco 6 pz"},desc:{fr:"Présentoir en bois naturel pour 6 paires, logo gravé",es:"Expositor madera natural para 6 pares, logo grabado",en:"Natural wood display for 6 pairs, engraved logo",it:"Espositore in legno naturale per 6 paia, logo inciso"},imageUrl:"",on:true},
    {id:4,type:"Display",name:{fr:"Présentoir mural 12 pièces",es:"Expositor pared 12 uds",en:"Wall display 12 pcs",it:"Espositore a parete 12 pz"},desc:{fr:"Support mural élégant en métal noir",es:"Soporte pared elegante metal negro",en:"Elegant black metal wall mount",it:"Supporto a parete elegante in metallo nero"},imageUrl:"",on:true},
    {id:5,type:"Merchandising",name:{fr:"Miroir de comptoir Minuë",es:"Espejo mostrador Minuë",en:"Minuë counter mirror",it:"Specchio da banco Minuë"},desc:{fr:"Miroir rond avec socle en laiton, logo gravé",es:"Espejo redondo con base latón, logo grabado",en:"Round mirror with brass base, engraved logo",it:"Specchio rotondo con base in ottone, logo inciso"},imageUrl:"",on:true},
    {id:6,type:"Merchandising",name:{fr:"Chiffon microfibre Minuë",es:"Paño microfibra Minuë",en:"Minuë microfibre cloth",it:"Panno microfibra Minuë"},desc:{fr:"Chiffon nettoyant avec logo, inclus avec chaque paire",es:"Paño limpiador con logo, incluido con cada par",en:"Cleaning cloth with logo, included with every pair",it:"Panno pulente con logo, incluso con ogni paio"},imageUrl:"",on:true}
  ]);
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState("");
  const [colFilter, setColFilter] = useState("all");
  const [expandedTier, setExpandedTier] = useState(-1);
  const [prepChecks, setPrepChecks] = useState({});
  const [expandedPrep, setExpandedPrep] = useState(null);
  const [ordSubTab, setOrdSubTab] = useState("list");
  const [ordChannelFilter, setOrdChannelFilter] = useState("all");
  const [moreOpen, setMoreOpen] = useState(false);
  const [packStock, setPackStock] = useState({fundas:0,gamuzas:0,cajasEnvio:0,cajitasGafa:0,tarjetasTecnicas:0,expositores:0,fundaCrema:0,fundaPistacho:0,fundaBabyBlue:0,fundaYellowAmalfi:0,fundaNaranja:0});
  const [recommendations, setRecommendations] = useState({});
  const [fundaPref, setFundaPref] = useState([]);
  const [shippingAddr, setShippingAddr] = useState("saved");
  const [newShipAddr, setNewShipAddr] = useState({street:"",city:"",zip:"",country:""});
  const [preferredDate, setPreferredDate] = useState("");
  const [cartPayMethod, setCartPayMethod] = useState("");
  const [orderHistory, setOrderHistory] = useState({});

  const logOrderChange = async (orderId, action, details) => {
    if (!user) return;
    const entry = {id:Date.now(), orderId, action, details, user:user.name, userEmail:user.email, role:user.role, timestamp:new Date().toISOString()};
    setOrderHistory(p => ({...p, [orderId]: [...(p[orderId]||[]), entry]}));
    if (dbReady) { try { await supabase.from("order_history").insert({order_id:String(orderId), action, details, user_name:user.name, user_email:user.email, user_role:user.role}); } catch(e){} }
  };
  const [savedCarts, setSavedCarts] = useState([]);
  const [defectives, setDefectives] = useState([]);
  const [shapeFilter, setShapeFilter] = useState("all");
  const [colorFilter, setColorFilter] = useState("all");
  const [filterPanel, setFilterPanel] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [userFilter, setUserFilter] = useState("all");
  const [cardQtys, setCardQtys] = useState({});
  const [ed, setEd] = useState({});

  /* ═══ SUPABASE DATA LAYER ═══ */
  const dbReady = !!supabase;
  const dbToProduct = r => ({id:r.id,model:r.model,color:r.color,sku:r.sku,col:r.collection,cat:r.category||r.collection,stock:r.stock,fixedPrice:Number(r.fixed_price)||0,tags:r.tags||[],imageUrl:r.image_url,shape:r.shape||"",colorFamily:r.color_family||"",active:r.active!==false});
  const dbToUser = r => ({id:r.id,email:r.email,pw:r.password_hash||"",role:r.role,name:r.name,co:r.company||"",lang:r.lang||"fr",commRate:r.comm_rate||0,active:r.active===true,phone:r.phone||"",city:r.city||"",country:r.country||"",notes:r.notes||""});
  const dbToClient = r => ({id:r.id,userId:r.user_id,name:r.name,contact:r.contact,city:r.city,country:r.country||"FR",channel:r.channel||"Direct",customPrice:Number(r.custom_price)||0,priceEssential:Number(r.price_essential)||0,priceIcons:Number(r.price_icons)||0,priceAcetato:Number(r.price_acetato)||0,earlyPay:!!r.early_pay,status:r.status||"prospect",notes:r.notes||"",orders:0,total:0,companyName:r.company_name||"",taxId:r.tax_id||"",address:r.address||"",postalCode:r.postal_code||"",phone:r.phone||"",companyEmail:r.company_email||"",bankHolder:r.bank_holder||"",iban:r.iban||"",bic:r.bic||"",shippingAddress:r.shipping_address||"",shippingCity:r.shipping_city||"",shippingPostal:r.shipping_postal||"",shippingCountry:r.shipping_country||""});
  const dbToOrder = (r, lines) => ({id:r.order_number,dbId:r.id,client:r.client_name,dist:r.distributor||"Direct",date:r.created_at?new Date(r.created_at).toLocaleDateString("fr-FR"):"-",status:r.status,pay:r.payment,shippingCost:Number(r.shipping_cost)||0,carrier:r.carrier||"",track:r.track_number||"",trackUrl:r.track_url||"",notes:r.notes_internal||"",clientNotes:r.notes_client||"",total:Number(r.total)||0,items:r.items_count||0,comm:Number(r.commission)||0,lines:lines||[],payMethod:r.payment_method||"",paymentLink:r.payment_link||"",payDueDate:r.payment_due_date||"",payReminderDays:r.payment_reminder_days||7,paySplit1Amount:Number(r.pay_split1_amount)||0,paySplit1Date:r.pay_split1_date||"",paySplit1Done:r.pay_split1_done||false,paySplit2Amount:Number(r.pay_split2_amount)||0,paySplit2Date:r.pay_split2_date||"",paySplit2Done:r.pay_split2_done||false});
  const dbToPromo = r => ({id:r.id,name:r.name,type:r.type,disc:r.discount,cond:{fr:r.condition_fr||"",es:r.condition_es||"",en:r.condition_en||"",it:r.condition_it||""},visible:r.visible_to||[],on:r.active!==false,targetClients:r.target_clients||[]});
  const dbToNews = r => ({id:r.id,title:{fr:r.title_fr||"",es:r.title_es||"",en:r.title_en||"",it:r.title_it||r.title_fr||""},content:{fr:r.content_fr||"",es:r.content_es||"",en:r.content_en||"",it:r.content_it||r.content_fr||""},url:r.url||"",pinned:!!r.pinned,on:r.active!==false,date:r.created_at?new Date(r.created_at).toLocaleDateString("fr-FR"):"-"});
  const dbToFaq = r => ({id:r.id,q:{fr:r.question_fr||"",es:r.question_es||"",en:r.question_en||""},a:{fr:r.answer_fr||"",es:r.answer_es||"",en:r.answer_en||""},on:r.active!==false});

  useEffect(() => {
    if (!dbReady) return;
    const load = async () => {
      try {
        const {data:prods} = await supabase.from("products").select("*").eq("active",true);
        if (prods && prods.length > 0) {
          const localProducts = products;
          setProducts(prods.map(r => {
            const dbProd = dbToProduct(r);
            if (!dbProd.imageUrl) {
              const local = localProducts.find(lp => lp.sku === dbProd.sku || (lp.model === dbProd.model && lp.color === dbProd.color));
              if (local && local.imageUrl) dbProd.imageUrl = local.imageUrl;
            }
            return dbProd;
          }));
        }
        const {data:usrs} = await supabase.from("users").select("*");
        if (usrs && usrs.length > 0) setUsers(usrs.map(dbToUser));
        const {data:cls} = await supabase.from("clients").select("*");
        if (cls) { setClients(cls.map(dbToClient)); if (user) { const myClient = cls.find(c => c.user_id === user.id || (c.name && user.co && c.name.toLowerCase() === user.co.toLowerCase()) || (c.name && user.name && c.name.toLowerCase() === user.name.toLowerCase()) || (c.company_email && user.email && c.company_email.toLowerCase() === user.email.toLowerCase())); if (myClient) setAccountData({companyName:myClient.company_name||"",taxId:myClient.tax_id||"",address:myClient.address||"",postalCode:myClient.postal_code||"",city:myClient.city||"",country:myClient.country||"",phone:myClient.phone||"",companyEmail:myClient.company_email||"",bankHolder:myClient.bank_holder||"",iban:myClient.iban||"",bic:myClient.bic||"",shippingAddress:myClient.shipping_address||"",shippingCity:myClient.shipping_city||"",shippingPostal:myClient.shipping_postal||"",shippingCountry:myClient.shipping_country||""}); } }
        const {data:ords} = await supabase.from("orders").select("*").order("created_at",{ascending:false});
        if (ords) {
          const {data:allLines} = await supabase.from("order_lines").select("*");
          const linesByOrder = {};
          (allLines||[]).forEach(l => { if(!linesByOrder[l.order_id]) linesByOrder[l.order_id]=[]; linesByOrder[l.order_id].push({model:l.model,color:l.color,sku:l.sku,qty:l.quantity,price:Number(l.unit_price),col:l.collection,qtyReceived:l.qty_received||0}); });
          // DB is the single source of truth — no merge with hardcoded/local orders
          setOrders(ords.map(o => dbToOrder(o, linesByOrder[o.id]||[])));
        }
        const {data:prms} = await supabase.from("promos").select("*");
        if (prms) setPromos(prms.map(dbToPromo));
        try { const {data:prosp} = await supabase.from("prospects").select("*").order("created_at",{ascending:false}); if (prosp) setProspects(prosp.map(dbToProspect)); } catch(e) { console.log("prospects load:", e); }
        // Product alerts (waitlist)
        try {
          if (user && (user.role === "admin" || user.role === "team")) { const {data:als} = await supabase.from("product_alerts").select("*"); if (als) setProductAlerts(als); }
          else if (user) { const {data:als} = await supabase.from("product_alerts").select("*").eq("client_email", user.email); if (als) setProductAlerts(als); }
        } catch(e) {}
        // Business config
        try {
          const {data:pcosts} = await supabase.from("product_costs").select("*");
          if (pcosts) { const cm = {}; pcosts.forEach(r => { cm[r.product_id] = {supplier:Number(r.supplier_cost)||0, freight:Number(r.freight_cost)||0, customs:Number(r.customs_cost)||0, packaging:Number(r.packaging_cost)||0}; }); setProductCosts(cm); }
          const {data:bcfg} = await supabase.from("business_config").select("*").eq("key","channel_config").maybeSingle();
          if (bcfg && bcfg.value) { try { setChannelConfig(typeof bcfg.value === "string" ? JSON.parse(bcfg.value) : bcfg.value); } catch(e){} }
          const {data:fcosts} = await supabase.from("fixed_costs").select("*").order("created_at",{ascending:true});
          if (fcosts) setFixedCosts(fcosts.map(r => ({id:r.id, name:r.name, category:r.category||"fijos", amount:Number(r.amount)||0, frequency:r.frequency||"monthly"})));
        } catch(e) { console.log("Business config load:", e); }
        const {data:nws} = await supabase.from("news").select("*").order("created_at",{ascending:false});
        if (nws) setNews(nws.map(dbToNews));
        const {data:fqs} = await supabase.from("faqs").select("*");
        if (fqs) setFaqs(fqs.map(dbToFaq));
        const {data:tsks} = await supabase.from("tasks").select("*").order("created_at",{ascending:false});
        if (tsks) setTasks(tsks.map(t => ({id:t.id,title:t.title,desc:t.description||"",priority:t.priority||"moyenne",area:t.area||"commercial",status:t.status||"aFaire",dueDate:t.due_date||"",assignee:t.assignee||"",date:t.created_at?new Date(t.created_at).toLocaleDateString("fr-FR"):"-"})));
        if (user && usrs) { const fresh = usrs.map(dbToUser).find(u => u.email.toLowerCase() === user.email.toLowerCase()); if (fresh && fresh.active) { setUser(fresh); try { localStorage.setItem("minue_session", JSON.stringify({user:fresh,ts:Date.now()})); } catch(e) {} } else if (fresh && !fresh.active) { setUser(null); try { localStorage.removeItem("minue_session"); } catch(e) {} } }
        if (user) { const {data:fvs} = await supabase.from("user_favorites").select("product_id").eq("user_email",user.email); if (fvs) setFavs(fvs.map(f => f.product_id)); }
        const {data:pks} = await supabase.from("packaging").select("*").order("sort_order",{ascending:true});
        if (pks && pks.length > 0) setPackItems(pks.map(r => ({id:r.id,type:r.type,name:{fr:r.name_fr||"",es:r.name_es||"",en:r.name_en||""},desc:{fr:r.desc_fr||"",es:r.desc_es||"",en:r.desc_en||""},imageUrl:r.image_url||"",on:r.active!==false})));
        if (user) { const {data:pns} = await supabase.from("private_notes").select("*").eq("author_email",user.email); if (pns) { const notesMap = {}; pns.forEach(n => { notesMap[n.client_id] = n.content; }); setPrivateNotes(notesMap); } }
        const {data:defs} = await supabase.from("defective_products").select("*").order("created_at",{ascending:false});
        if (defs) setDefectives(defs);
        const {data:pinv} = await supabase.from("packaging_inventory").select("*");
        if (pinv && pinv.length > 0) { const ps = {}; pinv.forEach(p => { ps[p.item_type] = p.quantity; }); setPackStock(prev => ({...prev,...ps})); }
        const {data:recs} = await supabase.from("client_recommendations").select("*");
        if (recs) { const r = {}; recs.forEach(rc => { if (!r[rc.client_email]) r[rc.client_email] = []; r[rc.client_email].push(rc.product_id); }); setRecommendations(r); }
        // Load conversations & messages
        const {data:convs} = await supabase.from("conversations").select("*").order("updated_at",{ascending:false});
        if (convs && convs.length > 0) {
          const {data:msgs} = await supabase.from("messages").select("*").order("created_at",{ascending:true});
          const msgsByConv = {};
          (msgs||[]).forEach(m => { if(!msgsByConv[m.conversation_id]) msgsByConv[m.conversation_id] = []; msgsByConv[m.conversation_id].push({id:m.id,from:m.sender_email,fromName:m.sender_name,fromRole:m.sender_role,text:m.content,date:m.created_at,read:m.read_at!==null}); });
          setConversations(convs.map(c => ({id:c.id,clientEmail:c.client_email,clientName:c.client_name,clientCompany:c.client_company,subject:c.subject,topic:c.topic,orderRef:c.order_ref,status:c.status||"open",createdAt:c.created_at,updatedAt:c.updated_at,messages:msgsByConv[c.id]||[]})));
        }
        // Load order history
        try {
          const {data:hist} = await supabase.from("order_history").select("*").order("created_at",{ascending:false});
          if (hist) {
            const h = {};
            hist.forEach(r => { if (!h[r.order_id]) h[r.order_id] = []; h[r.order_id].push({id:r.id,orderId:r.order_id,action:r.action,details:r.details,user:r.user_name,userEmail:r.user_email,role:r.user_role,timestamp:r.created_at}); });
            setOrderHistory(h);
          }
        } catch(e) {}
        const {data:tcs} = await supabase.from("timeclock").select("*").order("timestamp",{ascending:false});
        if (tcs) { setTimeclock(tcs); if (user) { const last = tcs.find(d => d.user_email === user.email); setClockStatus(last?.type === "in" ? "in" : "out"); } }
      } catch(e) { console.log("DB load fallback:", e); }
      setLoading(false);
    };
    load();
  }, [dbReady, user?.email]);

  const getNextOrderNumber = async () => { if (!dbReady) return "#MN-" + String(orders.length + 1).padStart(4, "0"); try { const {data} = await supabase.from("orders").select("order_number").order("created_at",{ascending:false}).limit(1); if (data && data.length > 0) { const num = parseInt(data[0].order_number.replace(/\D/g, "")) || 0; return "#MN-" + String(num + 1).padStart(4, "0"); } return "#MN-0001"; } catch(e) { return "#MN-" + String(orders.length + 1).padStart(4, "0"); } };

  const dbSaveOrder = async (order, lines) => {
    if (!dbReady) return;
    try {
      const {data} = await supabase.from("orders").insert({order_number:order.id,client_name:order.client,distributor:order.dist,status:order.status,payment:order.pay,shipping_cost:order.shippingCost||0,carrier:order.carrier||"",track_number:order.track||"",track_url:order.trackUrl||"",notes_internal:order.notes||"",notes_client:order.clientNotes||"",total:order.total,items_count:order.items,commission:order.comm}).select().single();
      if (data && lines) { await supabase.from("order_lines").insert(lines.map(l => ({order_id:data.id,model:l.model,color:l.color,sku:l.sku,quantity:l.qty,unit_price:l.price,collection:l.col||"Essential"}))); }
    } catch(e) { console.log("DB save order:", e); }
  };

  const dbUpdateOrder = async (order) => {
    if (!dbReady || !order.dbId) return;
    try {
      await supabase.from("orders").update({status:order.status,payment:order.pay,track_number:order.track,carrier:order.carrier,track_url:order.trackUrl,notes_internal:order.notes,notes_client:order.clientNotes,total:order.total,items_count:order.items,shipping_cost:order.shippingCost,commission:order.comm,payment_method:order.payMethod||null,payment_link:order.paymentLink||null,payment_due_date:order.payDueDate||null,payment_reminder_days:order.payReminderDays||null,pay_split1_amount:order.paySplit1Amount||null,pay_split1_date:order.paySplit1Date||null,pay_split1_done:order.paySplit1Done||false,pay_split2_amount:order.paySplit2Amount||null,pay_split2_date:order.paySplit2Date||null,pay_split2_done:order.paySplit2Done||false}).eq("id",order.dbId);
      if (order.lines) { await supabase.from("order_lines").delete().eq("order_id",order.dbId); await supabase.from("order_lines").insert(order.lines.map(l => ({order_id:order.dbId,model:l.model,color:l.color,sku:l.sku,quantity:l.qty,unit_price:l.price,collection:l.col||"Essential"}))); }
    } catch(e) { console.log("DB update order:", e); }
  };

  const dbUpdateProduct = async (prod) => { if (!dbReady) return; try { await supabase.from("products").update({stock:prod.stock,tags:prod.tags||[],shape:prod.shape||"",color_family:prod.colorFamily||"",active:prod.active!==false}).eq("id",prod.id); } catch(e) { console.log('DB error:', e); } };
  const dbDeleteClient = async (id) => { if (!dbReady) return; try { await supabase.from("clients").delete().eq("id",id); } catch(e) { console.log('DB delete client:', e); } };
  const dbDeleteOrder = async (order) => { if (!dbReady || !order?.dbId) return; try { await supabase.from("order_lines").delete().eq("order_id",order.dbId); await supabase.from("orders").delete().eq("id",order.dbId); } catch(e) { console.log('DB delete order:', e); } };
  const dbToProspect = r => ({id:r.id, distributor:r.distributor, name:r.name, city:r.city||"", country:r.country||"", email:r.email||"", phone:r.phone||"", web:r.web||"", instagram:r.instagram||"", noteAdmin:r.note_admin||"", noteDist:r.note_dist||"", stage:r.stage||"nuevo", createdAt:r.created_at});
  const dbSaveProspect = async (p) => { if (!dbReady) return null; try { const {data} = await supabase.from("prospects").insert({distributor:p.distributor, name:p.name, city:p.city||"", country:p.country||"", email:p.email||"", phone:p.phone||"", web:p.web||"", instagram:p.instagram||"", note_admin:p.noteAdmin||"", note_dist:p.noteDist||"", stage:p.stage||"nuevo"}).select().single(); return data ? dbToProspect(data) : null; } catch(e) { console.log('DB prospect:', e); return null; } };
  const dbUpdateProspect = async (p) => { if (!dbReady) return; try { await supabase.from("prospects").update({name:p.name, city:p.city||"", country:p.country||"", email:p.email||"", phone:p.phone||"", web:p.web||"", instagram:p.instagram||"", note_admin:p.noteAdmin||"", note_dist:p.noteDist||"", stage:p.stage||"nuevo", updated_at:new Date().toISOString()}).eq("id",p.id); } catch(e) { console.log('DB prospect upd:', e); } };
  const dbDeleteProspect = async (id) => { if (!dbReady) return; try { await supabase.from("prospects").delete().eq("id",id); } catch(e) { console.log('DB prospect del:', e); } };
  const dbSaveProductCost = async (productId, costs) => { if (!dbReady) return; try { await supabase.from("product_costs").upsert({product_id:productId, supplier_cost:costs.supplier||0, freight_cost:costs.freight||0, customs_cost:costs.customs||0, packaging_cost:costs.packaging||0, updated_at:new Date().toISOString()}, {onConflict:"product_id"}); } catch(e) { console.log('DB error:', e); } };
  const dbSaveChannelConfig = async (cfg) => { if (!dbReady) return; try { await supabase.from("business_config").upsert({key:"channel_config", value:cfg, updated_at:new Date().toISOString()}, {onConflict:"key"}); } catch(e) { console.log('DB error:', e); } };
  const dbSaveFixedCost = async (fc) => { if (!dbReady) return null; try { const {data} = await supabase.from("fixed_costs").insert({name:fc.name, category:fc.category, amount:fc.amount, frequency:fc.frequency}).select().single(); return data?.id; } catch(e) { console.log('DB error:', e); return null; } };
  const dbDeleteFixedCost = async (id) => { if (!dbReady) return; try { await supabase.from("fixed_costs").delete().eq("id",id); } catch(e) { console.log('DB error:', e); } };

  // Build a compact data snapshot for the AI (no PII beyond business names)
  const buildAISnapshot = () => {
    const now = Date.now();
    const parseDate = (d) => { const parts = (d||"").split("/"); return parts.length===3 ? new Date(parts[2]+"-"+parts[1].padStart(2,"0")+"-"+parts[0].padStart(2,"0")).getTime() : 0; };
    const totalCost = (pid) => { const c = productCosts[pid]; if (!c) return 0; return (c.supplier||0)+(c.freight||0)+(c.customs||0)+(c.packaging||0); };
    // Product velocity
    const vel = {};
    orders.forEach(o => (o.lines||[]).forEach(l => { const k = l.model+" "+l.color; vel[k] = (vel[k]||0)+(l.qty||0); }));
    // Last 90 days orders summary
    const recent = orders.filter(o => { const t = parseDate(o.date); return t && (now-t) < 90*86400000; });
    const channelMix = {direct:0, faire:0, distributor:0};
    recent.forEach(o => { const d=(o.dist||"").toLowerCase(); const k=d==="faire"?"faire":(d==="direct"||d==="directo"||!d)?"direct":"distributor"; channelMix[k]+=o.items||0; });
    // Client summary
    const clientStats = {};
    orders.forEach(o => { if(!clientStats[o.client]) clientStats[o.client]={orders:0,total:0,lastTs:0,channel:""}; clientStats[o.client].orders++; clientStats[o.client].total+=o.total||0; const ts=parseDate(o.date); if(ts>clientStats[o.client].lastTs) clientStats[o.client].lastTs=ts; });
    const clientSummary = clients.slice(0,60).map(c => { const s=clientStats[c.name]||{orders:0,total:0,lastTs:0}; return {nombre:c.name, ciudad:c.city||"", pais:c.country||"", canal:c.channel||"", status:c.status||"", pedidos:s.orders, totalFacturado:Math.round(s.total), diasSinPedir:s.lastTs?Math.floor((now-s.lastTs)/86400000):null}; });
    // Product summary with cost/margin
    const productSummary = products.filter(p => p.active!==false).slice(0,80).map(p => { const cost=totalCost(p.id); const sell=p.col==="Acetato"?(p.fixedPrice||0):22.90; const margin=sell>0&&cost>0?Math.round((sell-cost)/sell*100):null; return {modelo:p.model, color:p.color, coleccion:p.col, stock:p.stock, vendidoTotal:vel[p.model+" "+p.color]||0, costeUnidad:cost||null, precioVenta:sell, margenPct:margin}; });

    return {
      resumen: {
        totalClientes: clients.length,
        totalProductos: products.filter(p=>p.active!==false).length,
        pedidosUltimos90d: recent.length,
        unidadesUltimos90d: recent.reduce((s,o)=>s+(o.items||0),0),
        facturacionUltimos90d: Math.round(recent.reduce((s,o)=>s+(o.total||0),0)),
        mixCanal90d: channelMix,
        productosConCosteConfigurado: products.filter(p=>totalCost(p.id)>0).length,
        costesFijosMensuales: Math.round(fixedCosts.reduce((s,fc)=>s+(fc.frequency==="yearly"?fc.amount/12:fc.frequency==="quarterly"?fc.amount/3:fc.amount),0)),
        defectosReportados: defectives.reduce((s,d)=>s+(d.quantity||0),0)
      },
      configCanales: channelConfig,
      clientes: clientSummary,
      productos: productSummary
    };
  };

  const askAI = async (question) => {
    if (!question.trim() || aiLoading) return;
    setAiError("");
    const newHistory = [...aiChat, {role:"user", content:question}];
    setAiChat(newHistory);
    setAiInput("");
    setAiLoading(true);
    try {
      const snapshot = buildAISnapshot();
      const resp = await fetch("/api/decisions-ai", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ question, dataSnapshot:snapshot, history:aiChat })
      });
      const data = await resp.json();
      if (data.error) { setAiError(data.error); setAiChat(h => h.slice(0,-1)); }
      else setAiChat(h => [...h, {role:"assistant", content:data.answer}]);
    } catch(e) {
      setAiError("No se pudo conectar con el servicio de IA. ¿Está configurada la API key en Vercel?");
      setAiChat(h => h.slice(0,-1));
    }
    setAiLoading(false);
  };

  // Floating assistant — admin gets full business AI, team gets restricted platform help
  const askFloat = async (question) => {
    if (!question.trim() || floatLoading) return;
    setFloatError("");
    setFloatChat(h => [...h, {role:"user", content:question}]);
    setFloatInput("");
    setFloatLoading(true);
    try {
      const isAdmin = role === "admin";
      const endpoint = isAdmin ? "/api/decisions-ai" : "/api/employee-help";
      const payload = isAdmin
        ? { question, dataSnapshot: buildAISnapshot(), history: floatChat }
        : { question, history: floatChat };
      const resp = await fetch(endpoint, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
      const data = await resp.json();
      if (data.error) { setFloatError(data.error); setFloatChat(h => h.slice(0,-1)); }
      else setFloatChat(h => [...h, {role:"assistant", content:data.answer}]);
    } catch(e) {
      setFloatError("No se pudo conectar con la IA. ¿Está configurada la API key?");
      setFloatChat(h => h.slice(0,-1));
    }
    setFloatLoading(false);
  };
  const dbSaveUser = async (u) => { if (!dbReady) return; try { const hpw = await hashPw(u.pw, u.email); await supabase.from("users").insert({email:u.email,password_hash:hpw,role:u.role,name:u.name,company:u.co,lang:u.lang,comm_rate:u.commRate||0,active:u.active!==false,phone:u.phone||null,city:u.city||null,country:u.country||null,notes:u.notes||null}); } catch(e) { console.log('DB error:', e); } };
  const dbUpdateUser = async (u) => { if (!dbReady) return; try { await supabase.from("users").update({name:u.name,company:u.co,password_hash:u.pw,lang:u.lang||"fr",comm_rate:u.commRate,active:u.active!==false,phone:u.phone||null,city:u.city||null,country:u.country||null,notes:u.notes||null}).eq("email",u.origEmail||u.email); } catch(e) { console.log('DB error:', e); } };
  const dbSaveClient = async (c) => { if (!dbReady) return null; try { const {data} = await supabase.from("clients").insert({name:c.name,contact:c.contact||null,city:c.city||null,country:c.country||"FR",channel:c.channel||"Direct",status:c.status||"prospect",company_email:c.companyEmail||null,phone:c.phone||null,notes:c.notes||null}).select().single(); return data?.id || null; } catch(e) { console.log('DB error:', e); return null; } };
  const dbUpdateClient = async (c) => {
    if (!dbReady) return;
    const fields = {name:c.name,contact:c.contact,city:c.city,country:c.country,phone:c.phone||null,company_email:c.companyEmail||null,company_name:c.companyName||null,tax_id:c.taxId||null,address:c.address||null,postal_code:c.postalCode||null,bank_holder:c.bankHolder||null,iban:c.iban||null,bic:c.bic||null,shipping_address:c.shippingAddress||null,shipping_city:c.shippingCity||null,shipping_postal:c.shippingPostal||null,shipping_country:c.shippingCountry||null,custom_price:c.customPrice||0,price_essential:c.priceEssential||0,price_icons:c.priceIcons||0,price_acetato:c.priceAcetato||0,early_pay:!!c.earlyPay,status:c.status,notes:c.notes,channel:c.channel};
    try {
      // Try update with the id we have
      const {data, error} = await supabase.from("clients").update(fields).eq("id", c.id).select();
      if (error) { console.log("Update client error:", error); return; }
      if (data && data.length > 0) return; // OK, updated
      // Update affected 0 rows → id is stale. Find real id by name/email and retry.
      const {data:found} = await supabase.from("clients").select("id").or("name.ilike."+JSON.stringify(c.name||"")+",company_email.ilike."+JSON.stringify(c.companyEmail||"___no_match___")).limit(1);
      if (found && found.length > 0) {
        const realId = found[0].id;
        await supabase.from("clients").update(fields).eq("id", realId);
        // Update local state with the real id
        setClients(p => p.map(x => x.id === c.id ? {...x, id: realId} : x));
        console.log("Client id recovered:", c.id, "→", realId);
      } else {
        // Not found by name/email either → insert it
        const {data:ins} = await supabase.from("clients").insert(fields).select().single();
        if (ins?.id) { setClients(p => p.map(x => x.id === c.id ? {...x, id: ins.id} : x)); console.log("Client inserted on update-fallback:", ins.id); }
      }
    } catch(e) { console.log('DB error:', e); }
  };
  const dbSavePromo = async (p) => { if (!dbReady) return null; try { const {data,error} = await supabase.from("promos").insert({name:p.name,type:p.type,discount:p.disc,condition_fr:p.cond?.fr||"",condition_es:p.cond?.es||"",condition_en:p.cond?.en||"",condition_it:p.cond?.it||"",visible_to:p.visible||[],active:p.on!==false,target_clients:p.targetClients||[]}).select().single(); if (error) { console.log('Promo insert error:', error); return null; } return data?.id; } catch(e) { console.log('DB error:', e); return null; } };
  const dbUpdatePromo = async (p) => { if (!dbReady) return; try { await supabase.from("promos").update({name:p.name,type:p.type,discount:p.disc,condition_fr:p.cond?.fr||"",condition_es:p.cond?.es||"",condition_en:p.cond?.en||"",condition_it:p.cond?.it||"",visible_to:p.visible||[],active:p.on!==false,target_clients:p.targetClients||[]}).eq("id",p.id); } catch(e) { console.log('DB error:', e); } };
  const dbSaveNews = async (n) => { if (!dbReady) return null; try { const {data} = await supabase.from("news").insert({title_fr:n.title?.fr,title_es:n.title?.es,title_en:n.title?.en,title_it:n.title?.it,content_fr:n.content?.fr,content_es:n.content?.es,content_en:n.content?.en,content_it:n.content?.it,url:n.url||"",pinned:!!n.pinned,active:true}).select().single(); return data?.id || null; } catch(e) { console.log('DB error:', e); return null; } };
  const dbUpdateNews = async (n) => { if (!dbReady) return; try { await supabase.from("news").update({title_fr:n.title?.fr,title_es:n.title?.es,title_en:n.title?.en,title_it:n.title?.it,content_fr:n.content?.fr,content_es:n.content?.es,content_en:n.content?.en,content_it:n.content?.it,url:n.url||"",pinned:!!n.pinned,active:n.on!==false}).eq("id",n.id); } catch(e) { console.log('DB error:', e); } };
  const dbSaveFaq = async (f) => { if (!dbReady) return; try { await supabase.from("faqs").insert({question_fr:f.q?.fr,question_es:f.q?.es,question_en:f.q?.en,answer_fr:f.a?.fr,answer_es:f.a?.es,answer_en:f.a?.en,active:true}); } catch(e) { console.log('DB error:', e); } };
  const dbUpdateFaq = async (f) => { if (!dbReady) return; try { await supabase.from("faqs").update({question_fr:f.q?.fr,question_es:f.q?.es,question_en:f.q?.en,answer_fr:f.a?.fr,answer_es:f.a?.es,answer_en:f.a?.en,active:f.on!==false}).eq("id",f.id); } catch(e) { console.log('DB error:', e); } };
  const dbSavePackaging = async (pk) => { if (!dbReady) return; try { const {data} = await supabase.from("packaging").insert({type:pk.type,name_fr:pk.name?.fr,name_es:pk.name?.es,name_en:pk.name?.en,desc_fr:pk.desc?.fr,desc_es:pk.desc?.es,desc_en:pk.desc?.en,image_url:pk.imageUrl||"",active:true}).select().single(); return data; } catch(e) { console.log("DB error:", e); } };
  const dbUpdatePackaging = async (pk) => { if (!dbReady) return; try { await supabase.from("packaging").update({type:pk.type,name_fr:pk.name?.fr,name_es:pk.name?.es,name_en:pk.name?.en,desc_fr:pk.desc?.fr,desc_es:pk.desc?.es,desc_en:pk.desc?.en,image_url:pk.imageUrl||"",active:pk.on!==false}).eq("id",pk.id); } catch(e) { console.log("DB error:", e); } };
  const dbDeletePackaging = async (id) => { if (!dbReady) return; try { await supabase.from("packaging").delete().eq("id",id); } catch(e) { console.log("DB error:", e); } };
  const dbSavePrivateNote = async (authorEmail, clientId, content) => { if (!dbReady) return; try { await supabase.from("private_notes").upsert({author_email:authorEmail,client_id:clientId,content:content},{onConflict:"author_email,client_id"}); } catch(e) { console.log("DB error:", e); } };
  const dbSaveTask = async (t) => { if (!dbReady) return; try { await supabase.from("tasks").insert({title:t.title,description:t.desc||"",priority:t.priority||"moyenne",area:t.area||"commercial",status:t.status||"aFaire",due_date:t.dueDate||null,assignee:t.assignee||null}); } catch(e) { console.log("DB error:", e); } };
  const dbUpdateTask = async (t) => { if (!dbReady || !t.id) return; try { await supabase.from("tasks").update({title:t.title,description:t.desc||"",priority:t.priority,area:t.area,status:t.status,due_date:t.dueDate||null,assignee:t.assignee||null}).eq("id",t.id); } catch(e) { console.log("DB error:", e); } };
  const dbDeleteTask = async (id) => { if (!dbReady) return; try { await supabase.from("tasks").delete().eq("id",id); } catch(e) { console.log("DB error:", e); } };
  const dbSaveAccountData = async (data) => { if (!dbReady || !user) return; try { await supabase.from("clients").update({company_name:data.companyName,tax_id:data.taxId,address:data.address,postal_code:data.postalCode,phone:data.phone,company_email:data.companyEmail,bank_holder:data.bankHolder,iban:data.iban,bic:data.bic,shipping_address:data.shippingAddress||null,shipping_city:data.shippingCity||null,shipping_postal:data.shippingPostal||null,shipping_country:data.shippingCountry||null}).eq("user_id",user.id); } catch(e) { console.log('DB error:', e); } };

  /* ═══ TIMECLOCK & RECOMMENDATIONS ═══ */
  const dbAddRecommendation = async (clientEmail, productId) => { setRecommendations(p => ({...p, [clientEmail]:[...(p[clientEmail]||[]), productId]})); if(dbReady) { try { await supabase.from("client_recommendations").insert({client_email:clientEmail,product_id:productId,created_by:user?.email||""}); } catch(e) { console.log("Rec err:", e); } } };
  const dbRemoveRecommendation = async (clientEmail, productId) => { setRecommendations(p => ({...p, [clientEmail]:(p[clientEmail]||[]).filter(id => id !== productId)})); if(dbReady) { try { await supabase.from("client_recommendations").delete().eq("client_email",clientEmail).eq("product_id",productId); } catch(e) {} } };
  const getDistance = (lat1, lon1, lat2, lon2) => { const R=6371000;const dLat=(lat2-lat1)*Math.PI/180;const dLon=(lon2-lon1)*Math.PI/180;const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)); };
  const dbSaveTimeclock = async (entry) => { if (!dbReady) return; try { await supabase.from("timeclock").insert({user_email:entry.email,type:entry.type,latitude:entry.lat,longitude:entry.lng,distance_m:entry.distance,timestamp:new Date().toISOString()}); } catch(e) { console.log("DB timeclock:", e); } };
  const loadTimeclock = async () => { if (!dbReady) return; try { const {data} = await supabase.from("timeclock").select("*").order("timestamp",{ascending:false}); if (data) { setTimeclock(data); const last = data.find(d => d.user_email === user?.email); setClockStatus(last?.type === "in" ? "in" : "out"); } } catch(e) { console.log("TC load:", e); } };
  const doTimeclock = (type) => { setGeoError(""); if (!navigator.geolocation) { setGeoError(t("ubicacionNoDisponible")); return; } navigator.geolocation.getCurrentPosition(pos => { const dist = getDistance(pos.coords.latitude, pos.coords.longitude, OFFICE_LAT, OFFICE_LNG); if (dist > MAX_DISTANCE) { setGeoError(t("fueraDeRango") + " (" + Math.round(dist) + "m)"); return; } const entry = {email:user.email,type,lat:pos.coords.latitude,lng:pos.coords.longitude,distance:Math.round(dist)}; dbSaveTimeclock(entry); setTimeclock(p => [{...entry,timestamp:new Date().toISOString(),user_email:user.email},...p]); setClockStatus(type); setGeoError(""); }, err => { setGeoError(t("ubicacionNoDisponible") + " ("+err.message+")"); }, {enableHighAccuracy:true,timeout:10000}); };
  const getHours = (records, email, startDate, endDate) => { const recs = records.filter(r => r.user_email === email && new Date(r.timestamp) >= startDate && new Date(r.timestamp) <= endDate).sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp)); let total = 0; for (let i = 0; i < recs.length - 1; i += 2) { if (recs[i].type === "in" && recs[i+1]?.type === "out") { total += (new Date(recs[i+1].timestamp) - new Date(recs[i].timestamp)) / 3600000; } } return total; };

  /* i18n helper */
  const t = k => (T[k] && T[k][lang]) || (T[k] && T[k].fr) || k;

  /* Status labels (reactive to lang) */
  const SL = {confirmed:t("confirme"),shipped:t("expedie"),partial:t("partiel"),delivered:t("livre"),pending:t("enAttente"),preparing:t("enPrepa")};
  const SC = {confirmed:C.bl,shipped:C.yl,partial:C.yl,delivered:C.gn,pending:C.gr,preparing:C.dk};
  const PL = {pending:t("enAttente"),invoiced:t("facture"),paid:t("paye")};
  const PC = {pending:C.yl,invoiced:C.bl,paid:C.gn};

  /* Cart calculations — Essential uses tiers, Acetato uses fixedPrice */
  const cartEntries = Object.entries(cart).filter(([id,q]) => q > 0 && products.find(x => String(x.id) === String(id)));
  const cartCount = cartEntries.reduce((s,[,q]) => s + q, 0);
  const essentialEntries = cartEntries.filter(([id]) => { const p = products.find(x => String(x.id) === String(id)); return p && p.col !== "Acetato"; });
  const acetatoEntries = cartEntries.filter(([id]) => { const p = products.find(x => String(x.id) === String(id)); return p && p.col === "Acetato"; });
  const iconsEntries = cartEntries.filter(([id]) => { const p = products.find(x => String(x.id) === String(id)); return p && p.col === "Icons"; });
  const essentialOnlyEntries = cartEntries.filter(([id]) => { const p = products.find(x => String(x.id) === String(id)); return p && p.col === "Essential"; });
  const essentialCount = essentialEntries.reduce((s,[,q]) => s + q, 0);
  const acetatoCount = acetatoEntries.reduce((s,[,q]) => s + q, 0);
  const iconsCount = iconsEntries.reduce((s,[,q]) => s + q, 0);
  const essentialOnlyCount = essentialOnlyEntries.reduce((s,[,q]) => s + q, 0);
  const activeClientName = user && user.role === "client" ? user.co : cartCl;
  const activeClient = clients.find(c => {
    if (!activeClientName) return false;
    if (c.name === activeClientName) return true;
    if (c.name && activeClientName && c.name.toLowerCase().trim() === activeClientName.toLowerCase().trim()) return true;
    if (user && user.role === "client" && c.companyEmail && c.companyEmail.toLowerCase() === user.email.toLowerCase()) return true;
    if (user && user.role === "client" && c.contact && user.name && c.contact.toLowerCase().trim() === user.name.toLowerCase().trim()) return true;
    return false;
  }) || (user && user.role === "client" ? {name:user.co||user.name, contact:user.name, companyEmail:user.email, customPrice:0, priceEssential:0, priceIcons:0, priceAcetato:0, earlyPay:false, status:"prospect", orders:0, total:0, _synthetic:true} : null);
  const customPrice = activeClient ? activeClient.customPrice || 0 : 0;
  const priceEssential = activeClient ? (Number(activeClient.priceEssential)||0) : 0;
  const priceIcons = activeClient ? (Number(activeClient.priceIcons)||0) : 0;
  const priceAcetato = activeClient ? (Number(activeClient.priceAcetato)||0) : 0;
  const earlyPay = activeClient ? activeClient.earlyPay : false;
  // TIER: ALL cart units (incl. Acetato) count toward the volume tier
  const tierQty = cartCount;
  // Essential pricing: legacy customPrice OR priceEssential OR volume tier (tier from TOTAL units)
  const essentialUnitPrice = customPrice > 0 ? customPrice : (priceEssential > 0 ? priceEssential : getPrice(tierQty || 1, 0));
  // Icons pricing: legacy customPrice OR priceIcons OR volume tier (same tier)
  const iconsUnitPrice = customPrice > 0 ? customPrice : (priceIcons > 0 ? priceIcons : getPrice(tierQty || 1, 0));
  const essentialTotal = essentialOnlyCount * essentialUnitPrice + iconsCount * iconsUnitPrice;
  const acetatoTotal = acetatoEntries.reduce((s,[id,q]) => { const p = products.find(x => String(x.id) === String(id)); const priceForAcetato = customPrice > 0 ? customPrice : (priceAcetato > 0 ? priceAcetato : (p ? p.fixedPrice : ACETATO_PRICE)); return s + priceForAcetato * q; }, 0);
  const cartTotal = essentialTotal + acetatoTotal;
  const earlyPaySaving = earlyPay ? cartTotal * 0.03 : 0;
  const finalTotal = cartTotal - earlyPaySaving;
  const currentTier = getTier(tierQty || 1);
  const nextTier = getNextTier(tierQty || 1);

  /* Distributor clients */
  const distCo = user ? (user.co||"") : "";
  const isMyChannel = (ch) => { if (!ch || !distCo) return false; const a = ch.toLowerCase().trim(); const b = distCo.toLowerCase().trim(); const bClean = b.replace(/ showroom$/i,"").replace(/ diffusion$/i,"").trim(); const aClean = a.replace(/ showroom$/i,"").replace(/ diffusion$/i,"").trim(); return a === b || aClean === bClean || b.includes(aClean) || a.includes(bClean); };
  const distClients = clients.filter(c => isMyChannel(c.channel));
  const distLabel = distCo.replace(/ Showroom$/i,"").trim() || "Direct";

  /* Distributor dashboard KPIs (pre-calculated, no IIFE needed) */
  const distOrders = orders.filter(o => isMyChannel(o.dist));
  const distSales = distOrders.reduce((s, o) => s + o.total, 0);
  const distComm = distOrders.reduce((s, o) => s + o.comm, 0);
  const distPaid = distOrders.filter(o => o.pay === "paid").reduce((s, o) => s + o.comm, 0);
  const distInvoiced = distOrders.filter(o => o.pay === "invoiced").reduce((s, o) => s + o.comm, 0);

  /* newOrd modal calculations */
  const edLines = ed.lines || [];
  const edQty = edLines.reduce((s, l) => s + l.qty, 0);
  const edCp = (modal === "newOrd" && clients.find(c => c.name === ed.client)) ? clients.find(c => c.name === ed.client).customPrice || 0 : 0;
  const edUp = getPrice(edQty || 1, edCp);
  const edTotal = edQty * edUp;

  /* Cart actions */
  const addToCart = (id, qty) => setCart(p => ({...p, [id]: (p[id] || 0) + (qty || 2)}));
  const setCardQty = (id, q) => setCardQtys(p => ({...p, [id]: Math.max(1, q)}));
  const getCardQty = (id) => cardQtys[id] || 2;
  const updateQty = (id, q) => {
    if (q <= 0) { setCart(p => { const n = {...p}; delete n[id]; return n; }); }
    else { setCart(p => ({...p, [id]: q})); }
  };

  /* Place order */
  const doOrder = () => {
    const lines = cartEntries.map(([id, q]) => {
      const p = products.find(x => String(x.id) === String(id));
      if (!p) return null;
      const price = p.col === "Acetato" ? p.fixedPrice : essentialUnitPrice;
      return {model: p.model, color: p.color, sku: p.sku, qty: q, price, col: p.col};
    }).filter(Boolean);
    const fundaNames = {fundaCrema:"Crema",fundaPistacho:"Pistacho",fundaBabyBlue:"Baby Blue",fundaYellowAmalfi:"Amalfi",fundaNaranja:"Naranja"};
    const fundaArr = Array.isArray(fundaPref) ? fundaPref : (fundaPref ? [fundaPref] : []);
    const fundaNote = fundaArr.length > 0 ? "Fundas: "+fundaArr.map(f => fundaNames[f]||f).join(", ") : "";
    const dateNote = preferredDate ? "Fecha preferente: "+new Date(preferredDate).toLocaleDateString("es-ES") : "";
    const addrNote = shippingAddr === "new" && newShipAddr.street ? "Dirección nueva: "+newShipAddr.street+", "+newShipAddr.zip+" "+newShipAddr.city+(newShipAddr.country?", "+newShipAddr.country:"") : "";
    const fullNotes = [cartNotes, fundaNote, dateNote, addrNote].filter(Boolean).join(" · ");
    const newOrder = {
      id: "#MN-" + String(orders.length + 1).padStart(4, "0"),
      client: activeClientName || "—",
      dist: user.role === "distributor" ? distLabel : "Direct",
      date: new Date().toLocaleDateString("fr-FR"),
      items: cartCount, total: finalTotal,
      comm: user.role === "distributor" ? finalTotal * 0.15 : 0,
      status: "confirmed", pay: "pending", shippingCost: cartCount >= 20 ? 0 : 0, track: "", carrier: "", trackUrl: "", notes: "", clientNotes: fullNotes, fundaPref, lines, preferredDate, payMethod: cartPayMethod||""
    };
    setOrders(p => [newOrder, ...p]);
    dbSaveOrder(newOrder, lines);
    logOrderChange(newOrder.id, "Pedido creado", "Cliente: "+newOrder.client+" · "+cartCount+" uds · "+fmt(finalTotal)+" €");
    setCart({}); setCartCl(""); setCartNotes(""); setFundaPref([]); setPreferredDate(""); setCartPayMethod(""); setShippingAddr("saved"); setNewShipAddr({street:"",city:"",zip:"",country:""}); setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setView(user.role === "distributor" ? "d-ord" : "c-ord"); }, 1500);
  };

  /* ═══ LOGIN SCREEN ═══ */
  const doLogin = async () => {
    const hashed = await hashPw(loginPw, loginEmail); const found = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase().trim() && (u.pw === hashed || (u.pw.length !== 64 && u.pw === loginPw)));
    if (!found || found.active === false) { setLoginErr(t("errLogin")); return; }
    setLoginErr("");
    if (found.pw.length !== 64 && dbReady) { supabase.from("users").update({password_hash: hashed}).eq("email", found.email); found.pw = hashed; }
    setUser(found); try { localStorage.setItem("minue_session", JSON.stringify({user:found,ts:Date.now()})); } catch(e) { console.log('DB error:', e); }
    setLang(found.lang || "fr");
    setView(found.role === "admin" ? "a-stats" : found.role === "team" ? "e-dash" : found.role === "distributor" ? "d-dash" : "c-home");
  };

  const doRegister = async () => {
    if (!regData.name || !regData.email || !regData.co) { setLoginErr(t("errLogin")); return; }
    if (users.find(u => u.email.toLowerCase() === regData.email.toLowerCase())) { setLoginErr(t("emailYaExiste")); return; }
    const tempPw = "pending_" + Date.now();
    const channel = referralDist ? (referralDist.co||"Direct") : "Direct";
    const refNote = referralDist ? "\nReferido por: "+referralDist.co+" ("+referralDist.email+")" : "";
    const nu = {email:regData.email, pw:tempPw, role:"client", name:regData.name, co:regData.co, lang, commRate:0, active:false, phone:regData.phone, city:regData.city, country:regData.country, notes:"Solicitud de acceso\nWeb/IG: "+(regData.web||"—")+"\n"+(regData.message||"")+refNote, channel};
    setUsers(p => [...p, nu]); dbSaveUser(nu);
    // Auto-create client entry linked to distributor
    const newClient = {id:Date.now(), name:regData.co, contact:regData.name, city:regData.city||"", country:regData.country||"FR", channel, customPrice:0, priceEssential:0, priceIcons:0, priceAcetato:0, earlyPay:false, status:"prospect", notes:refNote, orders:0, total:0, phone:regData.phone||"", companyEmail:regData.email};
    setClients(p => [...p, newClient]);
    if (dbReady) { try { const {data} = await supabase.from("clients").insert({name:newClient.name, contact:newClient.contact, city:newClient.city, country:newClient.country, channel:newClient.channel, status:"prospect", phone:newClient.phone, company_email:newClient.companyEmail, notes:newClient.notes}).select().single(); if (data?.id) setClients(p => p.map(c => c.id === newClient.id ? {...c, id: data.id} : c)); } catch(e){ console.log("DB error:", e); } }
    setLoginErr("");
    setRegSent(true);
  };

  if (!hydrated || (!user && loading)) { return (<div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:CL.dk}}><img src={LOGO} alt="Minue" style={{width:60,height:60,objectFit:"contain",borderRadius:8,marginBottom:12,opacity:0.8}} /><div style={{fontSize:11,fontFamily:BD,color:"#f8efe660",letterSpacing:2}}>LOADING</div></div>); }
  if (!user) {
    const inputStyle = {width:"100%",padding:"14px 0",border:"none",borderBottom:"1px solid #f8efe625",background:"transparent",fontFamily:BD,fontSize:13,color:"#f8efe6",boxSizing:"border-box",outline:"none",transition:"border-color 0.3s",letterSpacing:0.3};
    const inputStyleLight = {width:"100%",padding:"14px 0",border:"none",borderBottom:"1px solid "+CL.dk+"18",background:"transparent",fontFamily:BD,fontSize:13,color:CL.dk,boxSizing:"border-box",outline:"none",transition:"border-color 0.3s",letterSpacing:0.3};
    const labelStyle = {fontSize:9,color:"#f8efe650",fontFamily:BD,marginBottom:4,fontWeight:500,letterSpacing:2,textTransform:"uppercase"};
    const labelStyleLight = {fontSize:9,color:CL.dk+"50",fontFamily:BD,marginBottom:4,fontWeight:500,letterSpacing:2,textTransform:"uppercase"};
    return (
      <div style={{minHeight:"100vh",background:CL.dk,position:"relative",overflow:"hidden"}}>
        <style>{`
          .loginhero { display: none; }
          @media (min-width: 940px) {
            .loginhero { display: flex !important; }
            .loginshift { margin-left: 46vw; }
          }
        `}</style>
        {/* LEFT BRAND PANEL — desktop */}
        <div className="loginhero" style={{position:"fixed",top:0,left:0,bottom:0,width:"46vw",flexDirection:"column",justifyContent:"flex-end",overflow:"hidden",background:"linear-gradient(160deg,#0f2420 0%,"+CL.dk+" 55%,#1d4435 100%)",zIndex:2}}>
          <img src="https://cdn.shopify.com/s/files/1/0052/2797/0629/files/39_44c32943-2007-46af-8be9-108b17eb72b4.png?v=1781006140" alt="" onError={e => { e.target.style.display = "none"; }} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} />
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(15,30,26,0.92) 0%, rgba(15,30,26,0.35) 45%, rgba(15,30,26,0.15) 100%)"}} />
          <div style={{position:"absolute",top:"-12%",right:"-12%",width:"40vw",height:"40vw",maxWidth:480,maxHeight:480,borderRadius:"50%",background:"radial-gradient(circle, rgba(184,134,11,0.14) 0%, transparent 65%)"}} />
          <div style={{position:"relative",padding:"0 8% 8%"}}>
            <div style={{fontSize:11,fontFamily:BD,letterSpacing:4,color:"#c4956a",fontWeight:700,marginBottom:14}}>MINUË · B2B</div>
            <div style={{fontSize:"min(44px, 3.4vw)",fontFamily:DP,fontWeight:300,fontStyle:"italic",color:"#f8efe6",lineHeight:1.15,marginBottom:18}}>{lang==="es"?"Diseños convertidos en miradas.":lang==="en"?"Designs turned into gazes.":lang==="it"?"Design trasformati in sguardi.":"Des designs convertis en regards."}</div>
            <div style={{fontSize:13,fontFamily:BD,color:"#f8efe6aa",lineHeight:1.7,maxWidth:380}}>{lang==="es"?"Catálogo SS26, tarifas por volumen y seguimiento de pedidos. Tu espacio mayorista, abierto 24/7.":lang==="en"?"SS26 catalogue, volume pricing and order tracking. Your wholesale space, open 24/7.":lang==="it"?"Catalogo SS26, prezzi a volume e tracciamento ordini. Il tuo spazio wholesale, aperto 24/7.":"Catalogue SS26, tarifs dégressifs et suivi de commande. Votre espace wholesale, ouvert 24h/24."}</div>
            <div style={{display:"flex",gap:18,marginTop:24,flexWrap:"wrap"}}>
              {(lang==="es"?["Catálogo completo","Pedido en 2 min","Tarifas en vivo"]:lang==="en"?["Full catalogue","Order in 2 min","Live pricing"]:lang==="it"?["Catalogo completo","Ordine in 2 min","Prezzi live"]:["Catalogue complet","Commande en 2 min","Tarifs en direct"]).map((b,i) => <span key={i} style={{fontSize:11,fontFamily:BD,color:"#f8efe6",fontWeight:600,display:"flex",alignItems:"center",gap:6}}><span style={{color:"#c4956a"}}>✦</span>{b}</span>)}
            </div>
          </div>
        </div>
        {/* DECORATIVE LINES + GLOWS */}
        <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,pointerEvents:"none",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:"20%",width:1,height:"100%",background:"linear-gradient(to bottom, transparent, #f8efe608, transparent)"}} />
          <div style={{position:"absolute",top:0,left:"80%",width:1,height:"100%",background:"linear-gradient(to bottom, transparent, #f8efe608, transparent)"}} />
          <div style={{position:"absolute",top:"30%",left:0,width:"100%",height:1,background:"linear-gradient(to right, transparent, #f8efe606, transparent)"}} />
          <div style={{position:"absolute",top:"-15%",right:"-10%",width:"55vw",height:"55vw",maxWidth:560,maxHeight:560,borderRadius:"50%",background:"radial-gradient(circle, rgba(184,134,11,0.10) 0%, transparent 65%)"}} />
          <div style={{position:"absolute",bottom:"-20%",left:"-12%",width:"60vw",height:"60vw",maxWidth:620,maxHeight:620,borderRadius:"50%",background:"radial-gradient(circle, rgba(248,239,230,0.05) 0%, transparent 60%)"}} />
        </div>

        {regSent ? (
          /* SUCCESS STATE */
          <div className="loginshift" style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 20px",position:"relative",zIndex:1}}>
            <div style={{width:1,height:60,background:"#f8efe615",marginBottom:24}} />
            <div style={{fontSize:"min(28px, 7vw)",fontFamily:DP,color:"#f8efe6",fontWeight:300,fontStyle:"italic",marginBottom:16,textAlign:"center"}}>{t("demandeEnvoyee").split("!")[0]}</div>
            <div style={{width:30,height:1,background:"#f8efe618",marginBottom:16}} />
            <div style={{fontSize:12,fontFamily:BD,color:"#f8efe645",lineHeight:1.8,maxWidth:280,textAlign:"center",marginBottom:36,letterSpacing:0.3}}>{t("demandeEnvoyee").split("!")[1]}</div>
            <button onClick={() => { setRegSent(false); setRegisterMode(false); }} style={{fontSize:10,fontFamily:BD,color:"#f8efe6",background:"transparent",border:"1px solid #f8efe625",cursor:"pointer",padding:"12px 36px",borderRadius:2,letterSpacing:3,textTransform:"uppercase",transition:"all 0.3s"}} onMouseEnter={e => {e.target.style.background="#f8efe610";e.target.style.borderColor="#f8efe640"}} onMouseLeave={e => {e.target.style.background="transparent";e.target.style.borderColor="#f8efe625"}}>{t("retourLogin")}</button>
          </div>
        ) : !registerMode ? (
          /* LOGIN */
          <div className="loginshift" style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px min(40px, 6vw)",position:"relative",zIndex:1}}>
            <div style={{textAlign:"center",marginBottom:40}}>
              <img src={LOGO} alt="Minuë" style={{width:"min(84px, 21vw)",height:"min(84px, 21vw)",objectFit:"contain",borderRadius:10,marginBottom:20,marginTop:10,opacity:0.95}} />
              <div style={{fontSize:"min(40px, 9vw)",fontFamily:DP,color:"#f8efe6",fontWeight:300,fontStyle:"italic",lineHeight:1.15,marginBottom:10}}>{t("bienvenidaLogin")}</div>
              <div style={{fontSize:"min(13px, 3.6vw)",fontFamily:BD,color:"#f8efe670",lineHeight:1.7,letterSpacing:0.3,maxWidth:300,margin:"0 auto"}}>{t("accedeEspacio")}</div>
            </div>
            <div style={{width:"min(360px, 85vw)"}}>
              <div style={{marginBottom:24}}>
                <div style={labelStyle}>{t("email")}</div>
                <input type="email" value={loginEmail} onChange={e => { setLoginEmail(e.target.value); setLoginErr(""); }} onKeyDown={e => e.key === "Enter" && doLogin()} placeholder="you@store.com" style={inputStyle} onFocus={e => e.target.style.borderBottomColor="#f8efe660"} onBlur={e => e.target.style.borderBottomColor="#f8efe625"} />
              </div>
              <div style={{marginBottom:36}}>
                <div style={labelStyle}>{t("motDePasse")}</div>
                <input type="password" value={loginPw} onChange={e => { setLoginPw(e.target.value); setLoginErr(""); }} onKeyDown={e => e.key === "Enter" && doLogin()} placeholder="••••••••" style={{...inputStyle,borderBottomColor:loginErr?"#e74c3c60":"#f8efe625"}} onFocus={e => e.target.style.borderBottomColor="#f8efe660"} onBlur={e => {if(!loginErr) e.target.style.borderBottomColor="#f8efe625"}} />
                {loginErr && <div style={{fontSize:11,color:"#e74c3c",fontFamily:BD,marginTop:10,letterSpacing:0.3}}>{loginErr}</div>}
              </div>
              <button onClick={doLogin} style={{width:"100%",padding:"16px 0",background:"#f8efe6",color:CL.dk,border:"none",borderRadius:4,fontSize:12,fontFamily:BD,fontWeight:500,cursor:"pointer",letterSpacing:2,textTransform:"uppercase",transition:"all 0.3s"}} onMouseEnter={e => e.target.style.opacity="0.9"} onMouseLeave={e => e.target.style.opacity="1"}>{t("connexion")}</button>
              <div style={{marginTop:32,background:"linear-gradient(135deg, rgba(196,149,106,0.10), rgba(196,149,106,0.04))",border:"1px solid rgba(196,149,106,0.35)",borderRadius:14,padding:"20px 22px",textAlign:"center"}}>
                <div style={{fontSize:14,fontFamily:DP,fontStyle:"italic",color:"#f8efe6",marginBottom:4}}>{t("noTienesCuenta")}</div>
                <div style={{fontSize:10.5,fontFamily:BD,color:"#f8efe670",lineHeight:1.6,marginBottom:14}}>{t("uneteBoutiques")}</div>
                <button onClick={() => { setRegisterMode(true); setLoginErr(""); }} style={{width:"100%",padding:"13px 0",background:"linear-gradient(135deg,#c4956a,#d4a030)",color:CL.dk,border:"none",borderRadius:24,fontSize:12,fontFamily:BD,fontWeight:700,cursor:"pointer",letterSpacing:1,transition:"all 0.25s",boxShadow:"0 4px 16px rgba(196,149,106,0.25)"}} onMouseEnter={e => e.target.style.transform="translateY(-1px)"} onMouseLeave={e => e.target.style.transform="none"}>{t("solliciterAcces")} →</button>
              </div>
            </div>
            <div style={{display:"flex",gap:8,marginTop:40}}>
              {["fr","es","en","it"].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{width:36,height:36,borderRadius:18,background:lang===l?"#f8efe615":"transparent",color:"#f8efe6",border:lang===l?"1px solid #f8efe630":"1px solid transparent",cursor:"pointer",fontSize:14,fontFamily:BD,transition:"all 0.3s"}}>{FLAGS[l]}</button>
              ))}
            </div>
          </div>
        ) : (
          /* REGISTER */
          <div className="loginshift" style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px min(30px, 5vw)",position:"relative",zIndex:1}}>
            <div style={{width:"100%",maxWidth:520,background:CL.bg,borderRadius:16,padding:"min(50px, 8vw) min(40px, 6vw)",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
              {referralDist && <div style={{background:"linear-gradient(135deg,"+CL.gn+"15,"+CL.gn+"08)",border:"1px solid "+CL.gn+"40",borderRadius:8,padding:"12px 16px",marginBottom:24,display:"flex",alignItems:"center",gap:12}}>
                <div style={{fontSize:22}}>🤝</div>
                <div>
                  <div style={{fontSize:10,fontFamily:BD,color:CL.gn,letterSpacing:1,fontWeight:700,marginBottom:2}}>{t("invitadoPor").toUpperCase()}</div>
                  <div style={{fontSize:13,fontFamily:BD,color:CL.dk,fontWeight:600}}>{referralDist.co}</div>
                </div>
              </div>}
              <div style={{textAlign:"center",marginBottom:36}}>
                <div style={{fontSize:"min(26px, 6vw)",fontFamily:DP,color:CL.dk,fontWeight:300,fontStyle:"italic"}}>Enter Minuë world</div>
                <div style={{width:30,height:1,background:CL.dk+"18",margin:"14px auto"}} />
                <div style={{fontSize:12,fontFamily:BD,color:CL.dk+"50",lineHeight:1.6}}>{t("solicitudSub")}</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 20px"}}>
                <div style={{marginBottom:20}}>
                  <div style={labelStyleLight}>{t("contact")} *</div>
                  <input value={regData.name} onChange={e => setRegData(p => ({...p, name:e.target.value}))} placeholder="Marie Dupont" style={inputStyleLight} onFocus={e => e.target.style.borderBottomColor=CL.dk+"50"} onBlur={e => e.target.style.borderBottomColor=CL.dk+"18"} />
                </div>
                <div style={{marginBottom:20}}>
                  <div style={labelStyleLight}>{t("entreprise")} *</div>
                  <input value={regData.co} onChange={e => setRegData(p => ({...p, co:e.target.value}))} placeholder="Optique Paris" style={inputStyleLight} onFocus={e => e.target.style.borderBottomColor=CL.dk+"50"} onBlur={e => e.target.style.borderBottomColor=CL.dk+"18"} />
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 20px"}}>
                <div style={{marginBottom:20}}>
                  <div style={labelStyleLight}>{t("email")} *</div>
                  <input type="email" value={regData.email} onChange={e => setRegData(p => ({...p, email:e.target.value}))} placeholder="contact@store.com" style={inputStyleLight} onFocus={e => e.target.style.borderBottomColor=CL.dk+"50"} onBlur={e => e.target.style.borderBottomColor=CL.dk+"18"} />
                </div>
                <div style={{marginBottom:20}}>
                  <div style={labelStyleLight}>{t("telephone")}</div>
                  <input value={regData.phone} onChange={e => setRegData(p => ({...p, phone:e.target.value}))} placeholder="+33 6 12 34 56 78" style={inputStyleLight} onFocus={e => e.target.style.borderBottomColor=CL.dk+"50"} onBlur={e => e.target.style.borderBottomColor=CL.dk+"18"} />
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 14px"}}>
                <div style={{marginBottom:20}}>
                  <div style={labelStyleLight}>{t("ville")}</div>
                  <input value={regData.city} onChange={e => setRegData(p => ({...p, city:e.target.value}))} placeholder="Paris" style={inputStyleLight} onFocus={e => e.target.style.borderBottomColor=CL.dk+"50"} onBlur={e => e.target.style.borderBottomColor=CL.dk+"18"} />
                </div>
                <div style={{marginBottom:20}}>
                  <div style={labelStyleLight}>{t("pays")}</div>
                  <input value={regData.country} onChange={e => setRegData(p => ({...p, country:e.target.value}))} placeholder="FR" style={inputStyleLight} onFocus={e => e.target.style.borderBottomColor=CL.dk+"50"} onBlur={e => e.target.style.borderBottomColor=CL.dk+"18"} />
                </div>
                <div style={{marginBottom:20}}>
                  <div style={labelStyleLight}>{t("webInstagram")}</div>
                  <input value={regData.web} onChange={e => setRegData(p => ({...p, web:e.target.value}))} placeholder="@store or url" style={inputStyleLight} onFocus={e => e.target.style.borderBottomColor=CL.dk+"50"} onBlur={e => e.target.style.borderBottomColor=CL.dk+"18"} />
                </div>
              </div>
              <div style={{marginBottom:20}}>
                <div style={labelStyleLight}>{t("idiomaPreferido")} *</div>
                <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
                  {[["fr","🇫🇷 Français"],["es","🇪🇸 Español"],["en","🇬🇧 English"],["it","🇮🇹 Italiano"]].map(([v,l]) =>
                    <button key={v} type="button" onClick={() => setLang(v)} style={{padding:"9px 16px",background:lang===v?CL.dk:"transparent",color:lang===v?"#f8efe6":CL.dk+"90",border:"1.5px solid "+(lang===v?CL.dk:CL.dk+"25"),cursor:"pointer",fontSize:11,fontFamily:BD,fontWeight:600,borderRadius:20,transition:"all 0.2s"}}>{l}</button>
                  )}
                </div>
              </div>
              <div style={{marginBottom:24}}>
                <div style={labelStyleLight}>{t("messageSolicitud")}</div>
                <textarea value={regData.message} onChange={e => setRegData(p => ({...p, message:e.target.value}))} rows={3} placeholder={lang==="fr"?"Type de boutique, marques distribuées, etc.":lang==="es"?"Tipo de tienda, marcas que distribuyes, etc.":lang==="it"?"Tipo di negozio, marchi che distribuisci, ecc.":"Store type, brands you carry, etc."} style={{...inputStyleLight,border:"none",borderBottom:"1px solid "+CL.dk+"18",resize:"vertical",fontFamily:BD,padding:"10px 0"}} onFocus={e => e.target.style.borderBottomColor=CL.dk+"50"} onBlur={e => e.target.style.borderBottomColor=CL.dk+"18"} />
              </div>
              {loginErr && <div style={{fontSize:11,color:"#e74c3c",fontFamily:BD,marginBottom:14,padding:"10px 14px",background:"#e74c3c08",borderRadius:6}}>{loginErr}</div>}
              <button onClick={doRegister} style={{width:"100%",padding:"16px 0",background:CL.dk,color:"#f8efe6",border:"none",borderRadius:4,fontSize:12,fontFamily:BD,fontWeight:500,cursor:"pointer",letterSpacing:2,textTransform:"uppercase",transition:"opacity 0.3s"}} onMouseEnter={e => e.target.style.opacity="0.85"} onMouseLeave={e => e.target.style.opacity="1"}>{t("envoyerDemande")}</button>
              <div style={{textAlign:"center",marginTop:20}}>
                <button onClick={() => { setRegisterMode(false); setLoginErr(""); }} style={{fontSize:11,fontFamily:BD,color:CL.dk+"50",background:"none",border:"none",cursor:"pointer",letterSpacing:1,transition:"color 0.3s"}} onMouseEnter={e => e.target.style.color=CL.dk} onMouseLeave={e => e.target.style.color=CL.dk+"50"}>← {t("retourLogin")}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ═══ ROLE & NAV CONFIG ═══ */
  const role = user.role;
  const navItems = role === "client"
    ? [["c-home","accueil"],["c-cat","catalogue"],["c-cart","panier"],["c-fav","favoritos"],["c-selection","selectionPrivee"],["c-ord","commandes"],["c-msg","mensajes"],["c-tarifs","tarifs"],["c-promo","promos"],["c-news","nouveautes"],["c-pack","packaging"],["c-res","ressources"],["c-help","faq"],["c-account","monCompte"]]
    : role === "distributor"
    ? [["d-dash","dashboard"],["d-cat","catalogue"],["d-cart","panier"],["d-fav","favoritos"],["d-tarifs","tarifs"],["d-selection","selectionPrivee"],["d-ord","commandes"],["d-cl","clients"],["d-prospectos","prospectos"],["d-msg","mensajes"],["d-promo","promos"],["d-news","nouveautes"],["d-pack","packaging"],["d-help","faq"],["d-account","monCompte"]]
    : role === "team"
    ? [["e-dash","dashboard"],["a-ord","commandes"],["a-msg","mensajes"],["e-comercial","commercial"],["a-cl","clients"],["a-dist","distributeurs"],["a-stock","stock"],["e-almacen","almacen"],["e-logistica","logistica"],["a-tasks","tareas"],["a-promo","promos"],["a-news","nouveautes"],["a-pack","packaging"],["a-faq","faq"],["e-fichaje","fichaje"],["e-account","monCompte"]]
    : [["a-stats","stats"],["a-decisiones","decisiones"],["a-analytics","analytics"],["a-ord","commandes"],["a-msg","mensajes"],["a-comercial","commercial"],["a-cl","clients"],["a-dist","distributeurs"],["a-prospectos","prospectos"],["a-recom","recomendaciones"],["a-stock","stock"],["a-almacen","almacen"],["a-logistica","logistica"],["a-inv","factures"],["a-promo","promos"],["a-news","nouveautes"],["a-pack","packaging"],["a-tasks","tareas"],["a-negocio","datosNegocio"],["a-users","utilisateurs"],["a-empleados","empleados"],["a-faq","faq"]];

  /* ═══ RENDERABLE SECTIONS ═══ */
  const navIcons = {dashboard:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",accueil:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",catalogue:"M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",panier:"M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",commandes:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",clients:"M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8",distributeurs:"M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",stock:"M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",commercial:"M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",almacen:"M3 3h18v18H3zM12 8v8M8 12h8",logistica:"M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",stats:"M18 20V10M12 20V4M6 20v-6",tareas:"M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",promos:"M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01",nouveautes:"M19 4H5a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V6a2 2 0 00-2-2z",packaging:"M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z",faq:"M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 16v.01M12 8a2.5 2.5 0 012.5 2.5c0 1.5-2.5 2-2.5 3.5",monCompte:"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8",factures:"M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",utilisateurs:"M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",selectionPrivee:"M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z",ressources:"M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z",tarifs:"M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",fichaje:"M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2",empleados:"M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2",recomendaciones:"M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",favoritos:"M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z",analytics:"M3 3v18h18M7 14l4-4 4 4 5-5",mensajes:"M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",datosNegocio:"M3 3v18h18M18.7 8l-5.1 5.2-2.8-2.7L7 14M21 3v6h-6",decisiones:"M9.66 4.5h4.68l3.32 3.32v4.68l-3.32 3.32H9.66L6.34 12.5V7.82zM12 8v4M12 15v.5",prospectos:"M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 11l-3 3-2-2"};
  const bottomItems = role === "client"
    ? [["c-home","accueil"],["c-cat","catalogue"],["c-cart","panier"],["c-ord","commandes"]]
    : role === "distributor"
    ? [["d-dash","dashboard"],["d-cat","catalogue"],["d-ord","commandes"],["d-cl","clients"]]
    : role === "team"
    ? [["e-dash","dashboard"],["a-ord","commandes"],["e-comercial","commercial"],["e-almacen","almacen"]]
    : [["a-stats","stats"],["a-ord","commandes"],["a-comercial","commercial"],["a-cl","clients"]];
  const moreItems = navItems.filter(([v]) => !bottomItems.find(([bv]) => bv === v));
  const NavIcon = ({d, size=20, color="currentColor"}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;

  const renderNav = () => {
    const rc = role==="admin"?"#e8a87c":role==="team"?"#a8c8e8":role==="distributor"?"#87ceeb":"#c4956a";
    return (<>
    <style>{`
      input:not([type=checkbox]):not([type=radio]), select, textarea { border-radius: 8px !important; transition: border-color .2s ease, box-shadow .2s ease, background .2s ease; }
      input:focus, select:focus, textarea:focus { outline: none !important; border-color: rgba(24,51,47,0.45) !important; box-shadow: 0 0 0 3px rgba(24,51,47,0.07); }
      button { transition: transform .14s ease, box-shadow .2s ease, opacity .2s ease, background .2s ease, color .2s ease; }
      button:active { transform: scale(0.97); }
      .mcard { transition: transform .18s ease, box-shadow .18s ease; }
      @media (hover:hover) { .mcard:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(24,51,47,0.12); } }
      @keyframes viewIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
      .viewfade { animation: viewIn .2s ease; }
      ::selection { background: rgba(184,134,11,0.22); }
      * { -webkit-tap-highlight-color: transparent; }
    `}</style>
    {/* TOP BAR — slim */}
    <nav style={{background:darkMode?"#141c1a":CL.dk,position:"sticky",top:0,zIndex:100}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px min(16px, 3vw)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={() => setView(navItems[0][0])}>
          <img src={LOGO} alt="Minuë" style={{height:"min(63px, 17vw)",borderRadius:4}} />
          <span style={{fontSize:8,padding:"2px 7px",fontFamily:BD,color:rc,background:"rgba(248,239,230,0.08)",fontWeight:600,borderRadius:8,textTransform:"uppercase",letterSpacing:0.3}}>{t(role==="distributor"?"distributeur":role==="team"?"employe":role)}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
          {["fr","es","en","it"].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{width:22,height:22,borderRadius:11,background:lang===l?"rgba(248,239,230,0.15)":"transparent",border:"none",cursor:"pointer",fontSize:9,color:lang===l?C.bg:"rgba(248,239,230,0.3)",fontFamily:BD,fontWeight:600}}>{l.toUpperCase()}</button>
          ))}
          <div style={{width:1,height:12,background:"rgba(248,239,230,0.1)",margin:"0 2px"}} />
          {(() => {
            const myOrders = role === "client" ? orders.filter(o => (o.client === user.co || o.client === user.name) && o.dist !== "Faire") : role === "distributor" ? orders.filter(o => isMyChannel(o.dist)) : [];
            const allNotifs = role === "admin" || role === "team"
              ? [
                ...conversations.filter(c => c.status === "open" && c.messages.some(m => (m.fromRole !== "admin" && m.fromRole !== "team") && !m.read)).slice(0,5).map(c => ({id:"msg-"+c.id,type:"task",text:"💬 "+c.clientCompany+" — "+c.subject,go:"a-msg",time:c.updatedAt,conv:c.id})),
                ...orders.filter(o => o.status === "confirmed" && !o.payMethod).slice(0,5).map(o => ({id:"pay-"+o.id,type:"order",text:"🆕 "+o.id+" · "+o.client+" · "+fmt(o.total)+"€ — "+t("notifConfigPago"),go:"a-ord",time:o.date,ord:o.id})),
                ...orders.filter(o => o.pay === "overdue").slice(0,3).map(o => ({id:"overdue-"+o.id,type:"task",text:t("notifPagoVencido")+" "+o.id+" ("+o.client+")",go:"a-ord",time:o.date,ord:o.id})),
                ...orders.filter(o => o.pay === "paid" && o.status !== "delivered").slice(0,3).map(o => ({id:"paid-"+o.id,type:"order",text:t("notifCobrado")+" "+o.id+" · "+o.client,go:"a-ord",time:o.date,ord:o.id})),
                ...users.filter(u => u.active === false && u.role !== "admin").map(u => ({id:"access-"+u.email,type:"access",text:"🔑 "+u.name+" — "+t("notifSolicitaAcceso"),go:"a-users"})),
                ...tasks.filter(tk => tk.priority === "haute" && tk.status !== "fait").map(tk => ({id:"task-"+tk.id,type:"task",text:"⚠ "+tk.title,go:"a-tasks"})),
                ...products.filter(p => p.stock === 0).slice(0,3).map(p => ({id:"stock0-"+p.id,type:"stock",text:t("notifAgotado")+" "+p.model+" "+p.color,go:"a-stock"})),
                ...products.filter(p => p.stock > 0 && p.stock < 5).slice(0,3).map(p => ({id:"stocklow-"+p.id,type:"stock",text:t("notifStockBajo")+" "+p.model+" "+p.color+" ("+p.stock+")",go:"a-stock"}))
              ]
              : role === "distributor"
              ? [
                ...myOrders.filter(o => o.status === "shipped").slice(0,5).map(o => ({id:"ship-"+o.id,type:"order",text:t("notifDistEnviado").replace("%id",o.id)+" "+o.client,go:"d-ord",ord:o.id})),
                ...myOrders.filter(o => o.status === "delivered" && o.pay !== "paid").slice(0,3).map(o => ({id:"distpay-"+o.id,type:"task",text:t("notifPendienteCobro")+" "+o.id+" ("+o.client+")",go:"d-ord",ord:o.id})),
                // Direct orders from my clients (without me)
                ...orders.filter(o => o.dist === "Direct" && distClients.some(c => c.name === o.client)).slice(0,5).map(o => ({id:"direct-"+o.id,type:"task",text:"⚠️ "+o.client+" pidió directo a Minuë ("+o.id+")",go:"d-ord",ord:o.id}))
              ]
              : [
                ...conversations.filter(c => (c.clientEmail === user.email || c.clientCompany === user.co) && c.messages.some(m => m.from !== user.email && !m.read)).slice(0,3).map(c => ({id:"msg-"+c.id,type:"task",text:"💬 "+t("equipoMinue")+": "+c.subject,go:"c-msg",time:c.updatedAt,conv:c.id})),
                ...myOrders.filter(o => o.payMethod && o.pay !== "paid").slice(0,3).map(o => ({id:"pay-"+o.id,type:"task",text:t("notifPagoPendiente")+" "+o.id+" — "+fmt(o.total)+"€",go:"c-ord",ord:o.id})),
                ...myOrders.filter(o => o.status === "shipped").slice(0,3).map(o => ({id:"ship-"+o.id,type:"order",text:t("notifEnviado").replace("%id",o.id),go:"c-ord",ord:o.id})),
                ...myOrders.filter(o => o.status === "preparing").slice(0,3).map(o => ({id:"prep-"+o.id,type:"order",text:t("notifEnPrepa").replace("%id",o.id),go:"c-ord",ord:o.id})),
                ...myOrders.filter(o => o.status === "delivered").slice(0,2).map(o => ({id:"deliv-"+o.id,type:"order",text:t("notifEntregado").replace("%id",o.id),go:"c-ord",ord:o.id})),
                ...(recommendations[user.email]||[]).slice(0,2).map(id => { const p = products.find(x => x.id === id); return p ? {id:"rec-"+id,type:"promo",text:t("notifRecoParaTi")+" "+p.model+" "+p.color,go:"c-cat"} : null; }).filter(Boolean),
                ...promos.filter(p => p.on && (p.visible||[]).includes("client") && (!p.targetClients || p.targetClients.length === 0 || p.targetClients.includes(user.co))).slice(0,2).map(p => ({id:"promo-"+p.id,type:"promo",text:"🎁 "+(p.name||t("notifPromoActiva")),go:"c-promo"}))
              ];
            const notifs = allNotifs.filter(n => !dismissedNotifs.ids.includes(n.id));
            const count = notifs.length;
            return <>
              <button onClick={() => setNotifOpen(!notifOpen)} style={{width:26,height:26,borderRadius:13,background:count>0?"rgba(248,239,230,0.15)":"rgba(248,239,230,0.08)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative"}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(248,239,230,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                {count > 0 && <span style={{position:"absolute",top:-2,right:-4,minWidth:16,height:16,padding:"0 4px",borderRadius:8,background:"#e74c3c",fontSize:9,fontWeight:700,fontFamily:BD,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>{count>9?"9+":count}</span>}
              </button>
              {notifOpen && <div style={{position:"fixed",top:48,right:12,width:"min(380px, 90vw)",maxHeight:"75vh",background:C.wh,borderRadius:10,border:"1px solid "+C.ln,boxShadow:"0 8px 30px rgba(24,51,47,0.18)",zIndex:200,overflow:"hidden"}} onClick={e => e.stopPropagation()}>
                <div style={{padding:"14px 18px",borderBottom:"1px solid "+C.ln,display:"flex",justifyContent:"space-between",alignItems:"center",background:C.bg}}>
                  <div>
                    <div style={{fontSize:14,fontFamily:DP,color:C.dk,fontWeight:600}}>{t("notifTituloPanel")}</div>
                    <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:2}}>{count} {count===1?t("notifPendiente"):t("notifPendientes")}</div>
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    {count > 0 && <button onClick={() => { dismissAllNotifs(notifs.map(n => n.id)); }} style={{padding:"4px 10px",background:"transparent",color:C.gr,border:"1px solid "+C.ln,borderRadius:4,fontSize:10,fontFamily:BD,cursor:"pointer"}}>✓ Marcar todo</button>}
                    <button onClick={() => setNotifOpen(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:C.gr,padding:4}}>✕</button>
                  </div>
                </div>
                <div style={{overflowY:"auto",maxHeight:"calc(75vh - 65px)"}}>
                  {notifs.length === 0 && <div style={{padding:40,textAlign:"center",fontSize:13,fontFamily:BD,color:C.gr2}}>{t("notifTodoAlDia")}</div>}
                  {notifs.map((n,i) => (
                    <div key={n.id} style={{padding:"12px 18px",borderBottom:i<notifs.length-1?"1px solid "+C.bg2:"none",fontSize:12,fontFamily:BD,color:C.dk,display:"flex",alignItems:"flex-start",gap:10,lineHeight:1.5}}>
                      <span style={{width:8,height:8,borderRadius:4,background:n.type==="access"?"#f39c12":n.type==="task"?C.rd:n.type==="stock"?C.yl:n.type==="promo"?"#8e44ad":C.gn,flexShrink:0,marginTop:4}} />
                      <span style={{flex:1,cursor:"pointer"}} onClick={() => { dismissNotif(n.id); setNotifOpen(false); setView(n.go); if (n.conv) { setActiveConv(n.conv); } if (n.ord) { const o = orders.find(x => x.id === n.ord); if (o) { if (role === "admin" || role === "team") { setModal("editOrd"); setEd({...o, idx: orders.indexOf(o)}); } else { setModal("viewOrd"); setEd({...o, idx: orders.indexOf(o)}); } } } }}>{n.text}</span>
                      <button onClick={(e) => { e.stopPropagation(); dismissNotif(n.id); }} title="Marcar como leído" style={{background:"transparent",border:"none",cursor:"pointer",fontSize:14,color:C.gr2,padding:0,lineHeight:1}}>✓</button>
                    </div>
                  ))}
                </div>
              </div>}
            </>;
          })()}
          {role === "client" && activeClient && activeClient.status === "vip" && <span style={{fontSize:8,fontFamily:BD,fontWeight:800,color:"#d4a030",background:"linear-gradient(135deg,#d4a03020,#c4903a20)",padding:"2px 7px",borderRadius:4,letterSpacing:1.5,border:"1px solid #d4a03040"}}>VIP</span>}
          <div onClick={() => setProfileOpen(!profileOpen)} style={{width:26,height:26,borderRadius:13,background:rc+"25",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,fontFamily:BD,color:rc,flexShrink:0,cursor:"pointer"}}>{user.name[0]}</div>
          <button onClick={() => { setUser(null); setCart({}); setLoginEmail(""); setLoginPw(""); try { localStorage.removeItem("minue_session"); localStorage.removeItem("minue_view"); } catch(e) {} }} style={{background:"none",border:"none",cursor:"pointer",padding:2,display:"flex",alignItems:"center",flexShrink:0}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(248,239,230,0.35)" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </div>
    </nav>

    {/* BOTTOM BAR — Instagram style */}
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:150,background:darkMode?"rgba(20,28,26,0.85)":"rgba(24,51,47,0.88)",backdropFilter:"blur(18px) saturate(150%)",WebkitBackdropFilter:"blur(18px) saturate(150%)",borderTop:"1px solid rgba(248,239,230,0.10)",paddingBottom:"env(safe-area-inset-bottom, 0px)"}}>
      <div style={{display:"flex",justifyContent:"space-around",alignItems:"center",padding:"6px 0 8px"}}>
        {bottomItems.map(([v, k]) => {
          const on = view === v;
          const isCart = k === "panier" && cartCount > 0;
          const iconPath = navIcons[k] || navIcons.commandes;
          return (
            <button key={v} onClick={() => { setView(v); setMoreOpen(false); }} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"4px 8px",position:"relative",minWidth:0}}>
              <div style={{position:"relative"}}>
                <NavIcon d={iconPath} size={22} color={on?"#f8efe6":"rgba(248,239,230,0.35)"} />
                {isCart && <span style={{position:"absolute",top:-4,right:-8,background:"#e74c3c",color:"#fff",fontSize:8,fontWeight:700,padding:"1px 4px",borderRadius:6,fontFamily:BD}}>{cartCount}</span>}
              </div>
              <span style={{fontSize:9,fontFamily:BD,fontWeight:on?600:400,color:on?"#f8efe6":"rgba(248,239,230,0.35)",letterSpacing:0.3}}>{t(k)}</span>
              {on && <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:20,height:2,background:rc,borderRadius:1}} />}
            </button>
          );
        })}
        {/* MORE button */}
        <button onClick={() => setMoreOpen(!moreOpen)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"4px 8px",position:"relative"}}>
          <div style={{display:"flex",flexDirection:"column",gap:3,alignItems:"center",height:22,justifyContent:"center"}}>
            <div style={{width:4,height:4,borderRadius:2,background:moreOpen?"#f8efe6":"rgba(248,239,230,0.35)"}} />
            <div style={{width:4,height:4,borderRadius:2,background:moreOpen?"#f8efe6":"rgba(248,239,230,0.35)"}} />
            <div style={{width:4,height:4,borderRadius:2,background:moreOpen?"#f8efe6":"rgba(248,239,230,0.35)"}} />
          </div>
          <span style={{fontSize:9,fontFamily:BD,fontWeight:moreOpen?600:400,color:moreOpen?"#f8efe6":"rgba(248,239,230,0.35)",letterSpacing:0.3}}>+</span>
        </button>
      </div>
    </div>

    {/* MORE DRAWER */}
    {moreOpen && <div style={{position:"fixed",bottom:62,left:0,right:0,zIndex:140,background:darkMode?"#1a2422":"rgba(24,51,47,0.97)",borderTop:"1px solid rgba(248,239,230,0.08)",maxHeight:"60vh",overflowY:"auto",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)"}}>
      {(() => {
        const renderTile = ([v, k]) => {
          const on = view === v;
          const iconPath = navIcons[k] || navIcons.commandes;
          const isCart = k === "panier" && cartCount > 0;
          return (
            <button key={v} onClick={() => { setView(v); setMoreOpen(false); }} style={{background:on?"rgba(248,239,230,0.08)":"transparent",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"12px 4px",borderRadius:8}}>
              <div style={{position:"relative"}}>
                <NavIcon d={iconPath} size={20} color={on?"#f8efe6":"rgba(248,239,230,0.4)"} />
                {isCart && <span style={{position:"absolute",top:-4,right:-8,background:"#e74c3c",color:"#fff",fontSize:8,fontWeight:700,padding:"1px 4px",borderRadius:6,fontFamily:BD}}>{cartCount}</span>}
              </div>
              <span style={{fontSize:9,fontFamily:BD,fontWeight:on?600:400,color:on?"#f8efe6":"rgba(248,239,230,0.4)",textAlign:"center",lineHeight:1.2}}>{t(k)}</span>
            </button>
          );
        };
        // Grouped layout for admin/team — flat grid for client/distributor
        const groups = role === "admin" ? [
          ["💼 "+(t("grpVentas")||"Ventas"), ["a-stats","a-decisiones","a-analytics","a-ord","a-inv"]],
          ["👥 "+(t("grpClientes")||"Clientes"), ["a-cl","a-dist","a-prospectos","a-comercial","a-msg","a-recom"]],
          ["📦 "+(t("grpOperaciones")||"Operaciones"), ["a-stock","a-almacen","a-logistica","a-pack","a-tasks","a-empleados"]],
          ["📣 "+(t("grpContenido")||"Contenido"), ["a-promo","a-news","a-faq"]],
          ["⚙️ "+(t("grpSistema")||"Sistema"), ["a-negocio","a-users"]]
        ] : role === "team" ? [
          ["📦 "+(t("grpOperaciones")||"Operaciones"), ["e-dash","a-ord","e-almacen","e-logistica","a-stock"]],
          ["👥 "+(t("grpClientes")||"Clientes"), ["a-cl","a-dist","e-comercial","a-msg"]],
          ["📣 "+(t("grpContenido")||"Contenido"), ["a-promo","a-news","a-pack","a-faq"]],
          ["⏱ "+(t("grpPersonal")||"Personal"), ["a-tasks","e-fichaje","e-account"]]
        ] : null;
        if (!groups) {
          return <div style={{padding:"16px 12px 20px",display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:4}}>{moreItems.map(renderTile)}</div>;
        }
        const moreSet = new Set(moreItems.map(([v]) => v));
        return <div style={{padding:"12px 12px 20px"}}>
          {groups.map(([label, views]) => {
            const items = views.filter(v => moreSet.has(v)).map(v => navItems.find(([nv]) => nv === v)).filter(Boolean);
            if (items.length === 0) return null;
            return <div key={label} style={{marginBottom:6}}>
              <div style={{fontSize:9,fontFamily:BD,fontWeight:700,color:"rgba(248,239,230,0.45)",letterSpacing:1.5,textTransform:"uppercase",padding:"8px 6px 4px"}}>{label}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:4}}>{items.map(renderTile)}</div>
            </div>;
          })}
        </div>;
      })()}
    </div>}
    </>);
  };


  const renderTierBar = () => {
    if (essentialCount === 0 || customPrice > 0 || priceEssential > 0 || priceIcons > 0) return null;
    const pct = nextTier ? Math.min(100, ((tierQty - currentTier.min) / (nextTier.min - currentTier.min)) * 100) : 100;
    const unitsToNext = nextTier ? nextTier.min - tierQty : 0;
    const saving = nextTier ? (essentialUnitPrice - nextTier.price) * essentialCount : 0;
    return (
      <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,padding:"14px 16px",marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <span style={{fontFamily:BD,fontSize:12,color:C.dk,fontWeight:600}}>{t("tarifActuel")} Essential: {fmt(essentialUnitPrice)} €/ud ({currentTier.label})</span>
          {nextTier && <span style={{fontFamily:BD,fontSize:11,color:C.gn,fontWeight:500}}>{t("prochain")}: {fmt(nextTier.price)} €</span>}
        </div>
        <div style={{height:6,background:C.bg2,borderRadius:3,overflow:"hidden",marginBottom:6}}>
          <div style={{height:6,background:nextTier?C.yl:C.gn,borderRadius:3,width:pct+"%",transition:"width 0.4s"}} />
        </div>
        {acetatoCount > 0 && <div style={{fontSize:10,fontFamily:BD,color:"#7a5c3a",background:"#e8d5c040",border:"1px solid #e8d5c0",borderRadius:6,padding:"6px 10px",marginBottom:6,lineHeight:1.5}}>ℹ️ {t("acetatoTramoInfo").replace("%n", acetatoCount)}</div>}
        {nextTier
          ? <span style={{fontFamily:BD,fontSize:11,color:C.yl}}>+{unitsToNext} uds = {fmt(nextTier.price)} €/ud ({t("economisez")} {fmt(saving)} €)</span>
          : <span style={{fontFamily:BD,fontSize:11,color:C.gn}}>{t("meilleurTarif")}</span>
        }
      </div>
    );
  };

  const colorDot = {Black:"#1a1a1a",Carey:"#8B6914","Brown Carey":"#7B5B2A",Brown:"#6B3A2A",Tea:"#c4956a",Cloud:"#d4cfc8",Mint:"#7ec8a0",Cocoa:"#5c3a28",Champagne:"#e8d5b8",Green:"#3d6b4f",Bronze:"#8b6914",Shade:"#5a5a6a",Sienna:"#a0522d",Olive:"#6b7a3a",Felline:"#8a7a5a",Chalk:"#e8e0d0",Mocha:"#7a5c40",Sepia:"#704214",Bold:"#2a2a3a",Apple:"#5c8a3a",Guiza:"#9a7a4a",Velvet:"#5a2a4a",Coffee:"#4a3020","Amber Doré":"#c5a55a",Burnt:"#8a3a1a",Jungle:"#2a5a3a",Noir:"#1a1a1a",Petal:"#d4839a","Hunter Blend":"#4a5a3a",Shadow:"#4a4a5a",Dusty:"#c4a090","Pale Sandstone":"#d4c4a8",Dusy:"#c4a090",Honey:"#d4a040",Sunset:"#d47a3a",Caramel:"#a0742a",Mandarine:"#d4763a",Bruma:"#a0a0b0",Ebony:"#2a2a2a",Nude:"#d4b8a0",Oliva:"#6b7a3a",Wine:"#722f37",Jara:"#8a3a4a",Matcha:"#7a9a5a",Leaf:"#4a7a3a",Greenwave:"#3a8a6a",Buttercup:"#d4a830",Havana:"#6b4a2a",Grass:"#4a8a3a",Tiger:"#b87a30",Sierra:"#a06030","Gold Green":"#8aa050",Kaffa:"#5a3a2a",Navy:"#2a3a6a",Carbon:"#3a3a3a","Carey Brown":"#7a5a3a","Gold-Black":"#2a2a2a","Gold-Brown":"#8a6a30","Gold-Green":"#6a8a30",Carrot:"#d47030",Peanut:"#c4a060",Jasper:"#8a4a3a","Green Carey":"#5a7a3a",Ember:"#b04a2a","Black Cherry":"#4a1a2a",Snow:"#e8e8e8",Toffee:"#8a5a2a",Cream:"#f0e0c8",Rowan:"#8a3a2a",Cedar:"#6a3a1a",Rosse:"#c04a5a",Copo:"#e0e8f0",Jade:"#3a8a6a",Ruby:"#9a2a3a",Agate:"#8a7a6a",Amber:"#c4903a","Carbon Mate":"#3a3a3a",Louvre:"#8a8a8a",Dark:"#2a2a2a",Bay:"#6a8a5a",Lightblue:"#7aacca",Opal:"#b0c0d0",Ambar:"#c4903a"};

  const renderModelCard = (modelName, variants) => {
    const first = variants.find(v => v.imageUrl) || variants[0];
    const isAcetato = first.col === "Acetato";
    const displayPrice = isAcetato ? first.fixedPrice : (customPrice > 0 ? customPrice : essentialCount > 0 ? essentialUnitPrice : 26.90);
    const totalStock = variants.reduce((s,v) => s + v.stock, 0);
    const inCartCount = variants.reduce((s,v) => s + (cart[v.id]||0), 0);
    const tags = [...new Set(variants.flatMap(v => v.tags||[]))];
    const tagConf = {top:{l:t("topVenta"),c:"#c4956a"},new:{l:t("nuevo"),c:"#8e44ad"},rec:{l:t("recomendado"),c:"#722f37"},icons:{l:"Icons",c:"#b8860b"},privee:{l:"Privée",c:"#18332f"}};
    const hasFav = variants.some(v => favs.includes(v.id));
    return (
      <div key={modelName} className="mcard" style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:12,overflow:"hidden",cursor:"pointer"}} onClick={() => { setModal("viewModel"); setEd({model:modelName, variants}); }}>
        <div style={{height:"min(192px, 45vw)",background:C.wh,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,position:"relative",color:C.ln,fontFamily:DP,letterSpacing:2,overflow:"hidden"}}>
          {first.imageUrl ? <img src={first.imageUrl} alt={modelName} style={{width:"100%",height:"100%",objectFit:"contain",transform:"scale("+imgScale(modelName)+")",transformOrigin:"center"}} /> : "MINUË"}
          <span style={{position:"absolute",top:8,left:8,fontSize:9,color:isAcetato?"#7a5c3a":first.col==="Icons"?"#b8860b":C.gr,fontFamily:BD,background:isAcetato?"#e8d5c0":first.col==="Icons"?"#f5ecd8":"rgba(255,255,255,0.85)",padding:"2px 7px",borderRadius:3,fontWeight:500}}>{first.col}</span>
          {tags.length > 0 && <div style={{position:"absolute",bottom:8,left:8,display:"flex",gap:3}}>
            {tags.filter(tg => tg !== "icons").map(tg => tagConf[tg] ? <span key={tg} style={{fontSize:8,fontFamily:BD,fontWeight:700,color:"#fff",background:tagConf[tg].c,padding:"2px 6px",borderRadius:3,textTransform:"uppercase",letterSpacing:0.3}}>{tagConf[tg].l}</span> : null)}
          </div>}
          {inCartCount > 0 && <span style={{position:"absolute",bottom:8,right:8,fontSize:9,fontFamily:BD,color:C.bg,background:C.gn,padding:"2px 8px",borderRadius:3}}>x{inCartCount}</span>}
          {hasFav && <span style={{position:"absolute",top:8,right:38,fontSize:12}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#6b4c3b" stroke="#6b4c3b" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </span>}
          <span style={{position:"absolute",top:8,right:8,fontSize:9,fontFamily:BD,color:totalStock<10?"#fff":C.dk,background:totalStock<10?C.rd:totalStock<20?C.yl+"30":"rgba(255,255,255,0.85)",padding:"3px 7px",borderRadius:10,fontWeight:600}}>{totalStock}</span>
        </div>
        <div style={{padding:"12px 14px",background:"#faf6f1"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
            <span style={{fontSize:15,fontWeight:600,fontFamily:DP,color:C.dk}}>{modelName}</span>
            <span style={{fontSize:13,fontWeight:600,fontFamily:BD,color:C.dk}}>{fmt(displayPrice)} €</span>
          </div>
          <div style={{display:"flex",gap:4,marginTop:8,alignItems:"center",flexWrap:"wrap"}}>
            {variants.slice(0,7).map(v => <div key={v.id} title={v.color} style={{width:16,height:16,borderRadius:8,background:colorDot[v.color]||"#aaa",border:"2px solid "+(cart[v.id]>0?C.gn:v.stock<5?C.rd+"50":"#e0d8d0"),flexShrink:0}} />)}
            {variants.length > 7 && <span style={{fontSize:9,fontFamily:BD,color:C.gr}}>+{variants.length-7}</span>}
          </div>
          <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:6}}>{variants.length} {t("couleurs")}</div>
        </div>
      </div>
    );
  };

  const renderCard = (p) => {
    const inCart = cart[p.id] > 0;
    const isAcetato = p.col === "Acetato";
    const displayPrice = isAcetato ? p.fixedPrice : (customPrice > 0 ? customPrice : essentialCount > 0 ? essentialUnitPrice : 26.90);
    const cq = getCardQty(p.id);
    const tags = p.tags || [];
    const tagConf = {top:{l:t("topVenta"),c:"#c4956a"},new:{l:t("nuevo"),c:"#8e44ad"},rec:{l:t("recomendado"),c:"#722f37"},icons:{l:"Icons",c:"#b8860b"},privee:{l:"Privée",c:"#18332f"}};
    return (
      <div key={p.id} className="mcard" style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:14,overflow:"hidden",boxShadow:"0 2px 12px rgba(24,51,47,0.05)"}}>
        <div style={{height:"min(208px, 48vw)",background:C.wh,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,position:"relative",color:C.ln,fontFamily:DP,letterSpacing:2,overflow:"hidden"}}>
          {p.imageUrl ? <img src={p.imageUrl} alt={p.model+" "+p.color} style={{width:"100%",height:"100%",objectFit:"contain",transform:"scale("+imgScale(p.model)+")",transformOrigin:"center"}} /> : "MINUË"}
          {p.stock === 0 && (role === "client" || role === "distributor") && <div style={{position:"absolute",inset:0,background:"rgba(255,255,255,0.55)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:10,fontFamily:BD,fontWeight:800,color:C.dk,background:"rgba(255,255,255,0.95)",padding:"5px 14px",borderRadius:20,letterSpacing:1.5,border:"1px solid "+C.ln}}>{t("agotadoLabel")}</span></div>}
          <span style={{position:"absolute",top:8,left:8,fontSize:9,color:isAcetato?"#7a5c3a":C.gr,fontFamily:BD,background:isAcetato?"#e8d5c0":"rgba(255,255,255,0.85)",padding:"2px 7px",borderRadius:3,fontWeight:500}}>{p.col}</span>
          <span style={{position:"absolute",top:8,right:8,fontSize:9,fontFamily:BD,color:"#fff",background:p.stock<5?C.rd:p.stock<10?C.yl:C.gn,width:26,height:26,borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{p.stock}</span>
          {tags.length > 0 && <div style={{position:"absolute",bottom:8,left:8,display:"flex",gap:3}}>
            {tags.map(tg => tagConf[tg] ? <span key={tg} style={{fontSize:8,fontFamily:BD,fontWeight:700,color:"#fff",background:tagConf[tg].c,padding:"2px 6px",borderRadius:3,textTransform:"uppercase",letterSpacing:0.3}}>{tagConf[tg].l}</span> : null)}
          </div>}
          {inCart && <span style={{position:"absolute",bottom:8,right:8,fontSize:9,fontFamily:BD,color:C.bg,background:C.gn,padding:"2px 8px",borderRadius:3}}>x{cart[p.id]}</span>}
          {role !== "admin" && <button onClick={(e) => { e.stopPropagation(); setFavs(f => f.includes(p.id) ? f.filter(x => x!==p.id) : [...f, p.id]); dbToggleFav(p.id); }} style={{position:"absolute",top:8,right:role==="admin"?42:38,background:"rgba(255,255,255,0.85)",border:"none",cursor:"pointer",width:26,height:26,borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={favs.includes(p.id)?"#6b4c3b":"none"} stroke={favs.includes(p.id)?"#6b4c3b":"#999"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>}
        </div>
        <div style={{padding:"12px 14px",background:darkMode?C.bg2:"#faf6f1"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
            <span style={{fontSize:14,fontWeight:500,fontFamily:DP,color:C.dk}}>{p.model}</span>
            <span style={{fontSize:14,fontWeight:600,fontFamily:BD,color:C.dk}}>{fmt(displayPrice)} €</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginTop:2}}>
            <span style={{fontSize:11,color:C.gr,fontFamily:BD}}>{p.color}</span>
            <span style={{fontSize:9,fontFamily:BD,color:C.gr2}}>PVP {isAcetato ? "70" : "45-50"} €</span>
          </div>
          <div style={{fontSize:10,color:C.gr2,fontFamily:BD,marginTop:1}}>{p.sku}</div>
          <div style={{display:"flex",gap:6,marginTop:10,alignItems:"center"}}>
            {p.stock === 0 && (role === "client" || role === "distributor") ? (() => {
              const myAlert = productAlerts.find(a => String(a.product_id) === String(p.id) && a.client_email === user.email);
              return myAlert
                ? <button onClick={() => { dbRemoveAlert(myAlert.id); toast(t("alertaQuitada"),"info"); }} style={{flex:1,padding:"8px 0",background:CL.gn+"12",color:CL.gn,border:"1px solid "+CL.gn+"40",fontSize:11,cursor:"pointer",fontFamily:BD,borderRadius:8,fontWeight:600}}>🔔 {t("teAvisaremos")}</button>
                : <button onClick={() => { dbAddAlert(p.id); toast(t("alertaCreada")); }} style={{flex:1,padding:"8px 0",background:"transparent",color:C.dk,border:"1.5px solid "+C.dk,fontSize:11,cursor:"pointer",fontFamily:BD,borderRadius:8,fontWeight:600}}>🔔 {t("avisameCuandoVuelva")}</button>;
            })() : <>
            <div style={{display:"flex",alignItems:"center",border:"1px solid "+C.ln,borderRadius:8,overflow:"hidden"}}>
              <button onClick={() => setCardQty(p.id, cq - 1)} style={{width:28,height:30,background:C.bg,border:"none",cursor:"pointer",fontSize:13,fontFamily:BD,color:C.dk}}>-</button>
              <span style={{minWidth:28,textAlign:"center",fontSize:12,fontFamily:BD,color:C.dk,fontWeight:600}}>{cq}</span>
              <button onClick={() => setCardQty(p.id, cq + 1)} style={{width:28,height:30,background:C.bg,border:"none",cursor:"pointer",fontSize:13,fontFamily:BD,color:C.dk}}>+</button>
            </div>
            <button onClick={() => addToCart(p.id, cq)} style={{flex:1,padding:"8px 0",background:C.dk,color:C.bg,border:"none",fontSize:11,cursor:"pointer",fontFamily:BD,borderRadius:8,fontWeight:500}}>{t("ajouterPanier")}</button>
            </>}
          </div>
        </div>
      </div>
    );
  };

  /* ═══ MODEL CATALOG GRID ═══ */
  const renderModelCatalog = () => {
    const filtered = products.filter(p => (role === "admin" || role === "team" || p.active !== false) && (favFilter ? favs.includes(p.id) : true) && (colFilter === "all" || p.col === colFilter) && (shapeFilter === "all" || p.shape === shapeFilter) && (colorFilter === "all" || p.colorFamily === colorFilter) && (!filter || p.model.toLowerCase().includes(filter.toLowerCase()) || p.color.toLowerCase().includes(filter.toLowerCase())));
    const modelGroups = {};
    filtered.forEach(p => {
      if (!modelGroups[p.model]) modelGroups[p.model] = {model:p.model, col:p.col, colors:[], tags:new Set()};
      modelGroups[p.model].colors.push(p);
      (p.tags||[]).forEach(t => modelGroups[p.model].tags.add(t));
    });
    const models = Object.values(modelGroups);
    const tagConf = {top:{l:t("topVenta"),c:"#c4956a"},new:{l:t("nuevo"),c:"#8e44ad"},rec:{l:t("recomendado"),c:"#722f37"},icons:{l:"Icons",c:"#b8860b"},privee:{l:"Privée",c:"#18332f"}};
    return <>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(160px, calc(50% - 6px)),1fr))",gap:12}}>
        {models.map(mg => {
          const mainColor = mg.colors.find(c => c.imageUrl) || mg.colors[0];
          const isAcetato = mg.col === "Acetato";
          const totalInCart = mg.colors.reduce((s,c) => s + (cart[c.id]||0), 0);
          const minStock = Math.min(...mg.colors.map(c => c.stock));
          return <div key={mg.model} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden",cursor:"pointer",transition:"box-shadow 0.2s"}} onClick={() => { setSelectedModel(mg); setSelectedColorIdx(0); setModal("viewModel"); }}
            onMouseEnter={e => e.currentTarget.style.boxShadow="0 4px 16px rgba(24,51,47,0.12)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow="none"}>
            <div style={{height:"min(180px, 42vw)",background:C.wh,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
              {mainColor.imageUrl ? <img src={mainColor.imageUrl} alt={mg.model} style={{width:"100%",height:"100%",objectFit:"contain",padding:10}} /> : <span style={{fontSize:32,color:C.ln,fontFamily:DP}}>MINUË</span>}
              <span style={{position:"absolute",top:8,left:8,fontSize:9,color:isAcetato?"#7a5c3a":C.gr,fontFamily:BD,background:isAcetato?"#e8d5c0":"rgba(255,255,255,0.9)",padding:"2px 7px",borderRadius:3,fontWeight:500}}>{mg.col}</span>
              {[...mg.tags].filter(tg => tagConf[tg]).length > 0 && <div style={{position:"absolute",bottom:8,left:8,display:"flex",gap:3}}>
                {[...mg.tags].map(tg => tagConf[tg] ? <span key={tg} style={{fontSize:8,fontFamily:BD,fontWeight:700,color:"#fff",background:tagConf[tg].c,padding:"2px 6px",borderRadius:3,textTransform:"uppercase"}}>{tagConf[tg].l}</span> : null)}
              </div>}
              {totalInCart > 0 && <span style={{position:"absolute",bottom:8,right:8,fontSize:9,fontFamily:BD,color:C.bg,background:C.gn,padding:"2px 8px",borderRadius:3}}>x{totalInCart}</span>}
            </div>
            <div style={{padding:"12px 14px",background:darkMode?C.bg2:"#faf6f1"}}>
              <div style={{fontSize:15,fontWeight:500,fontFamily:DP,color:C.dk}}>{mg.model}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4}}>
                <span style={{fontSize:11,color:C.gr,fontFamily:BD}}>{mg.colors.length} {t("couleurs")}</span>
                <span style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>
                  {isAcetato ? fmt(mg.colors[0]?.fixedPrice||27.90) : fmt(customPrice>0?customPrice:essentialUnitPrice)} €
                </span>
              </div>
              {/* Color dots preview */}
              <div style={{display:"flex",gap:4,marginTop:8,flexWrap:"wrap"}}>
                {mg.colors.slice(0,6).map((c,i) => <div key={i} style={{width:20,height:20,borderRadius:10,border:"1px solid "+C.ln,overflow:"hidden",flexShrink:0}}>
                  {c.imageUrl ? <img src={c.imageUrl} style={{width:"100%",height:"100%",objectFit:"cover"}} /> : <div style={{width:"100%",height:"100%",background:C.bg}} />}
                </div>)}
                {mg.colors.length > 6 && <span style={{fontSize:9,fontFamily:BD,color:C.gr,display:"flex",alignItems:"center"}}>+{mg.colors.length-6}</span>}
              </div>
            </div>
          </div>;
        })}
      </div>
      {models.length === 0 && <div style={{textAlign:"center",padding:40,fontFamily:BD,color:C.gr}}>{t("noResults")}</div>}
    </>;
  };

  const renderOrderRow = (o, i, showComm, showDist) => (
    <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"11px 14px",borderBottom:"1px solid "+C.bg2,background:C.wh,flexWrap:"wrap",cursor:"pointer"}} onClick={() => { if (role === "admin" || role === "team") { setModal("editOrd"); setEd({...o, idx: orders.indexOf(o)}); } else { setModal("viewOrd"); setEd({...o}); }}}>
      {o.dist === "Faire" && <span title={"Pedido Faire"+(o.faireRef?" — "+o.faireRef:"")} style={{width:22,height:22,borderRadius:11,background:"#000",color:"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11,fontFamily:BD,fontWeight:700,flexShrink:0,letterSpacing:0}}>F</span>}
      <span style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>{o.id}</span>
      <span style={{fontSize:12,fontFamily:BD,color:C.dk,flex:"1 1 80px",minWidth:60}}>{o.client}</span>
      <span style={{fontSize:11,fontFamily:BD,color:C.gr}}>{o.date}</span>
      <span style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>{fmt(o.total)} €</span>
      <Badge l={SL[o.status]} c={SC[o.status]} />
      <Badge l={PL[o.pay]} c={PC[o.pay]} />
      <span style={{fontSize:10,fontFamily:BD,color:C.bl}}>→</span>
    </div>
  );

  const exportCSV = (filename, headers, rows) => {
    const clean = v => String(v||"").replace(/"/g,'""').replace(/\n/g,' ');
    const csv = [headers.join(";"), ...rows.map(r => r.map(v => '"'+clean(v)+'"').join(";"))].join("\r\n");
    const blob = new Blob(["\uFEFF"+csv], {type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };
  const exportClients = () => {
    const h = ["Nom","Contact","Email","Ville","CP","Pays","Canal","Status","Prix custom","Early Pay","Tel","Adresse","Raison sociale","NIF","Notes"];
    const rows = clients.map(c => [c.name||"",c.contact||"",c.companyEmail||"",c.city||"",c.postalCode||"",c.country||"",c.channel||"",c.status||"",c.customPrice||0,c.earlyPay?"Oui":"Non",c.phone||"",c.address||"",c.companyName||"",c.taxId||"",c.notes||""]);
    exportCSV("minue_clients_"+new Date().toISOString().slice(0,10)+".csv", h, rows);
  };
  const exportOrders = () => {
    const h = ["No","Client","Distributeur","Date","Unites","Total","Status","Paiement","Transporteur","Tracking","Notes"];
    const rows = orders.map(o => [o.id||"",o.client||"",o.dist||"",o.date||"",o.items||0,o.total||0,o.status||"",o.pay||"",o.carrier||"",o.track||"",o.clientNotes||""]);
    exportCSV("minue_pedidos_"+new Date().toISOString().slice(0,10)+".csv", h, rows);
  };

  const downloadAlbaran = (o) => {
    const cl = clients.find(c => c.name === o.client || (c.name && o.client && c.name.toLowerCase().trim() === o.client.toLowerCase().trim())) || {};
    const lines = o.lines || [];
    const totalUnits = lines.reduce((s,l) => s + (l.qty||0), 0) || o.items || 0;
    const fmtN = n => (Number(n)||0).toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2});
    const today = new Date().toLocaleDateString("es-ES");
    const addr = [cl.address, [cl.postalCode, cl.city].filter(Boolean).join(" "), cl.country].filter(Boolean).join("<br>");
    const shipAddr = [cl.shippingAddress||cl.address, [cl.shippingPostal||cl.postalCode, cl.shippingCity||cl.city].filter(Boolean).join(" "), cl.shippingCountry||cl.country].filter(Boolean).join("<br>");
    const rowsHtml = lines.map(l => `<tr>
      <td style="padding:9px 12px;border-bottom:1px solid #eee;font-weight:600;color:#18332f">${l.model||""}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #eee;color:#555">${l.color||""}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #eee;color:#888;font-size:11px">${l.sku||""}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #eee;text-align:center;font-weight:600">${l.qty||0}</td>
    </tr>`).join("");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Albarán ${o.id}</title>
    <style>
      @page { size: A4; margin: 14mm; }
      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #2a2a2a; font-size: 13px; line-height: 1.5; }
      .page { padding: 16mm 18mm; max-width: 210mm; margin: 0 auto; }
      @media print { .page { padding: 0; } }
      .head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #18332f; padding-bottom: 18px; margin-bottom: 26px; }
      .brand { font-size: 30px; font-weight: 300; letter-spacing: 4px; color: #18332f; font-style: italic; }
      .brand-sub { font-size: 10px; letter-spacing: 3px; color: #b8860b; font-weight: 700; margin-top: 2px; }
      .doc-title { text-align: right; }
      .doc-title h1 { font-size: 22px; color: #18332f; margin: 0 0 4px; letter-spacing: 2px; }
      .doc-title .meta { font-size: 12px; color: #777; }
      .cols { display: flex; gap: 40px; margin-bottom: 26px; }
      .col { flex: 1; }
      .col h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #b8860b; margin: 0 0 6px; font-weight: 700; }
      .col .name { font-weight: 700; color: #18332f; font-size: 14px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      thead th { background: #18332f; color: #f8efe6; padding: 10px 12px; text-align: left; font-size: 11px; letter-spacing: 0.5px; font-weight: 600; }
      thead th:last-child { text-align: center; }
      tfoot td { padding: 12px; font-weight: 700; font-size: 15px; color: #18332f; border-top: 2px solid #18332f; }
      .notes { background: #f8efe6; border-radius: 8px; padding: 14px 18px; font-size: 12px; color: #555; margin-bottom: 20px; }
      .foot { margin-top: 40px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 10px; color: #999; text-align: center; line-height: 1.7; }
      .sign { display: flex; gap: 60px; margin-top: 50px; }
      .sign div { flex: 1; border-top: 1px solid #999; padding-top: 6px; font-size: 11px; color: #777; text-align: center; }
    </style></head><body>
    <div class="page">
      <div class="head">
        <div><img src="https://cdn.shopify.com/s/files/1/0052/2797/0629/files/LOGO_VERDE_MINUE.png?v=1613555706" alt="Minuë" style="height:54px;width:auto;display:block" /></div>
        <div class="doc-title"><h1>ALBARÁN</h1><div class="meta">Nº ${o.id}<br>Fecha: ${today}<br>Pedido: ${o.date||"—"}</div></div>
      </div>
      <div class="cols">
        <div class="col">
          <h3>Remitente</h3>
          <div class="name">Minuë Opticians</div>
          Calle Ardilla nº13, oficinas<br>41010 Sevilla, España<br>NIF: ES77843808D<br>hola@minueopticians.com
        </div>
        <div class="col">
          <h3>Cliente</h3>
          <div class="name">${o.client||cl.name||"—"}</div>
          ${cl.companyName ? cl.companyName+"<br>" : ""}${cl.taxId ? "NIF: "+cl.taxId+"<br>" : ""}${addr||"—"}
        </div>
        <div class="col">
          <h3>Dirección de envío</h3>
          ${shipAddr||addr||"—"}
          ${o.carrier ? "<br><br><strong>Transportista:</strong> "+o.carrier : ""}
          ${o.track ? "<br><strong>Tracking:</strong> "+o.track : ""}
        </div>
      </div>
      <table>
        <thead><tr><th>Modelo</th><th>Color</th><th>SKU</th><th>Cantidad</th></tr></thead>
        <tbody>${rowsHtml}</tbody>
        <tfoot><tr><td colspan="3">TOTAL UNIDADES</td><td style="text-align:center">${totalUnits}</td></tr></tfoot>
      </table>
      ${o.clientNotes ? '<div class="notes"><strong>Notas:</strong> '+o.clientNotes+'</div>' : ''}
      <div class="sign"><div>Firma remitente</div><div>Firma recepción / fecha</div></div>
      <div class="foot">Minuë Opticians · Calle Ardilla nº13, oficinas, 41010 Sevilla · NIF ES77843808D · hola@minueopticians.com<br>Este albarán acompaña la mercancía y no tiene valor de factura.</div>
    </div>
      <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 300); }<\/script>
    </body></html>`;
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); }
    else { toast(t("popupBloqueado")||"Permite ventanas emergentes para descargar el albarán"); }
  };


  const renderKPI = (label, value, accent, onClick) => (
    <div onClick={onClick} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"16px 14px",...(onClick?{cursor:"pointer"}:{})}}>
      <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:6,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5}}>{label}</div>
      <div style={{fontSize:"min(24px, 5.5vw)",fontWeight:600,fontFamily:BD,color:accent||C.dk,lineHeight:1.1}}>{value}</div>
    </div>
  );

  /* ═══ MODAL ═══ */
  const renderModal = () => {
    if (!modal) return null;
    const titles = {editCl:t("condComm"),editSt:t("editerStock"),newProd:t("nouveauProduit"),newOrd:t("nouvelleCmd"),editOrd:t("modifierCmd"),viewOrd:t("detailCmd"),newCl:t("nouveauClient"),newUser:t("nouveauUser"),editUser:t("editUser"),newPromo:t("nouveauPromo"),editPromo:t("editPromo"),newNews:t("nouvelleNouveaute"),editNews:t("titreNouveaute"),viewInv:t("factureDetail"),newFaq:t("nouvelleFaq"),editFaq:t("questionLabel"),newTask:t("nouvelleTache"),editTask:t("titreTache")};
    return (
      <div style={{position:"fixed",inset:0,background:"rgba(24,51,47,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}} onClick={() => setModal(null)}>
        <div style={{background:C.wh,padding:"24px 20px",borderRadius:8,width:"100%",maxWidth:480,maxHeight:"90vh",overflow:"auto",margin:"0 16px"}} onClick={e => e.stopPropagation()}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}>
            <h2 style={{fontSize:18,fontWeight:400,fontFamily:DP,color:C.dk,margin:0}}>{titles[modal] || ""}</h2>
            <button onClick={() => setModal(null)} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:C.gr}}>x</button>
          </div>

          {/* EDIT CLIENT */}
          {modal === "editCl" && <>
            <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}>
              <span style={{fontSize:18,fontFamily:DP,color:C.dk,fontWeight:600}}>{ed.name}</span>
              <Badge l={ed.status==="vip"?"VIP":ed.status==="prospect"?t("prospect"):t("actif")} c={ed.status==="vip"?C.yl:ed.status==="prospect"?C.gr2:C.gn} />
            </div>
            <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginBottom:16}}>{ed.contact} · {ed.city}, {ed.country} · {ed.channel}</div>
            <div style={{display:"flex",gap:4,marginBottom:16,borderBottom:"1px solid "+C.ln,overflowX:"auto"}}>
              {[["resume",t("resumeClient")],["info",t("fichaCliente")],...(role==="admin"||role==="team"?[["cond",t("condiciones")]]:[]),["notes",t("notesPrivees")]].map(([v,l]) => (
                <button key={v} onClick={() => setEd(p => ({...p, _tab:v}))} style={{padding:"8px 14px",background:"none",border:"none",borderBottom:"2px solid "+((ed._tab||"resume")===v?C.dk:"transparent"),cursor:"pointer",fontSize:11,fontFamily:BD,fontWeight:(ed._tab||"resume")===v?600:400,color:(ed._tab||"resume")===v?C.dk:C.gr,whiteSpace:"nowrap"}}>{l}</button>
              ))}
            </div>

            {/* RESUME TAB */}
            {(ed._tab||"resume") === "resume" && (() => {
              const clOrders = orders.filter(o => o.client === ed.name);
              const totalSpent = clOrders.reduce((s,o) => s + o.total, 0);
              const totalUnits = clOrders.reduce((s,o) => s + o.items, 0);
              const lastOrd = clOrders[0];
              return <>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:8,marginBottom:16}}>
                  {renderKPI(t("nbCommandes"), String(clOrders.length))}
                  {renderKPI(t("totalDepense"), fmt(totalSpent)+" €", C.gn)}
                  {renderKPI(t("unites"), String(totalUnits))}
                  {renderKPI(t("dernierCmd"), lastOrd ? lastOrd.date : "—")}
                </div>
                {clOrders.length > 0 ? <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden",maxHeight:250,overflowY:"auto"}}>
                  {clOrders.map((o,i) => (
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",borderBottom:"1px solid "+C.bg2,cursor:"pointer"}} onClick={() => { setModal("viewOrd"); setEd({...o, idx:orders.indexOf(o)}); }}>
                      <span style={{fontSize:12,fontFamily:DP,color:C.dk,fontWeight:600}}>{o.id}</span>
                      <span style={{fontSize:11,fontFamily:BD,color:C.gr,flex:1}}>{o.date}</span>
                      <span style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600}}>{o.items} uds · {fmt(o.total)} €</span>
                      <Badge l={SL[o.status]} c={SC[o.status]} />
                    </div>
                  ))}
                </div> : <div style={{fontSize:12,fontFamily:BD,color:C.gr2,textAlign:"center",padding:20}}>—</div>}
              </>;
            })()}

            {(ed._tab||"resume") === "info" && <>
              <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:14,marginBottom:12}}>
                <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:10}}>{t("datosPersonales")}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 10px"}}>
                  {[[t("boutique"),"name"],[t("contact"),"contact"],[t("telephone"),"phone"],[t("emailLabel"),"companyEmail"],[t("ville"),"city"],[t("pays"),"country"]].map(([l,k]) => (
                    <div key={k} style={{marginBottom:8}}>
                      <div style={{fontSize:9,color:C.gr,fontFamily:BD,marginBottom:2}}>{l}</div>
                      <input value={ed[k]||""} onChange={e => setEd(p => ({...p,[k]:e.target.value}))} style={{width:"100%",padding:7,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:14,marginBottom:12}}>
                <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:10}}>{t("dirEnvio")}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 10px"}}>
                  {[[t("direccion"),"shippingAddress"],[t("ville"),"shippingCity"],[t("codePostal"),"shippingPostal"],[t("pays"),"shippingCountry"]].map(([l,k]) => (
                    <div key={k} style={{marginBottom:8}}>
                      <div style={{fontSize:9,color:C.gr,fontFamily:BD,marginBottom:2}}>{l}</div>
                      <input value={ed[k]||""} onChange={e => setEd(p => ({...p,[k]:e.target.value}))} style={{width:"100%",padding:7,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:14,marginBottom:12}}>
                <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:10}}>{t("dirFacturacion")}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 10px"}}>
                  {[[t("raisonSociale"),"companyName"],[t("nif"),"taxId"],[t("direccion"),"address"],[t("codePostal"),"postalCode"],[t("telephone"),"phone"],[t("emailLabel"),"companyEmail"]].map(([l,k]) => (
                    <div key={k} style={{marginBottom:8}}>
                      <div style={{fontSize:9,color:C.gr,fontFamily:BD,marginBottom:2}}>{l}</div>
                      <input value={ed[k]||""} onChange={e => setEd(p => ({...p,[k]:e.target.value}))} style={{width:"100%",padding:7,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:14,marginBottom:12}}>
                <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:10}}>{t("donneesBancaires")}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 10px"}}>
                  {[[t("titulaire"),"bankHolder"],[t("iban"),"iban"],[t("bic"),"bic"]].map(([l,k]) => (
                    <div key={k} style={{marginBottom:8}}>
                      <div style={{fontSize:9,color:C.gr,fontFamily:BD,marginBottom:2}}>{l}</div>
                      <input value={ed[k]||""} onChange={e => setEd(p => ({...p,[k]:e.target.value}))} style={{width:"100%",padding:7,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>Status</div>
                <div style={{display:"flex",gap:6}}>
                  {[["prospect",t("prospect")],["active",t("actif")],["vip","VIP"]].map(([v,l]) => (
                    <button key={v} onClick={() => setEd(p => ({...p, status:v}))} style={{padding:"5px 12px",background:ed.status===v?C.dk:"transparent",color:ed.status===v?C.bg:C.gr,border:"1px solid "+(ed.status===v?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,borderRadius:20}}>{l}</button>
                  ))}
                </div>
              </div>
            </>}

            {(ed._tab||"resume") === "cond" && <>
              <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:16,marginBottom:16}}>
                <div style={{display:"flex",gap:8,marginBottom:12}}>
                  <button onClick={() => setEd(p => ({...p, customPrice: 0}))} style={{flex:1,padding:10,background:ed.customPrice===0?C.dk:C.wh,color:ed.customPrice===0?C.bg:C.dk,border:"1px solid "+(ed.customPrice===0?C.dk:C.ln),borderRadius:4,fontSize:11,fontFamily:BD,cursor:"pointer",fontWeight:500}}>{t("tarifAuto")}</button>
                  <button onClick={() => setEd(p => ({...p, customPrice: p.customPrice || 19.90}))} style={{flex:1,padding:10,background:ed.customPrice>0?C.dk:C.wh,color:ed.customPrice>0?C.bg:C.dk,border:"1px solid "+(ed.customPrice>0?C.dk:C.ln),borderRadius:4,fontSize:11,fontFamily:BD,cursor:"pointer",fontWeight:500}}>{t("prixFixe")}</button>
                </div>
                {ed.customPrice > 0
                  ? <>
                    <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("prixUnit")} <span style={{fontSize:9,color:C.gr2}}>{t("oTarifaEstandar")}</span></div>
                    <input type="number" step="0.10" value={ed.customPrice} onChange={e => setEd(p => ({...p, customPrice: parseFloat(e.target.value) || 0}))} style={{width:"100%",padding:10,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:14,background:C.wh,color:C.dk,boxSizing:"border-box",fontWeight:600}} />
                    <div style={{fontSize:10,fontFamily:BD,color:"#c47a00",background:"#fff8e6",border:"1px solid #f0a02030",padding:"6px 10px",borderRadius:4,marginTop:8}}>{t("precioGlobalAlerta")}</div>
                  </>
                  : <div style={{fontSize:11,fontFamily:BD,color:C.gr}}>{t("prixAutoDesc")}</div>
                }
              </div>

              {/* PER-COLLECTION PRICES (only when no global custom price) */}
              <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:16,marginBottom:16,opacity:ed.customPrice>0?0.45:1}}>
                <div style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:4}}>💰 {t("precioPorColeccion")}</div>
                <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:14,lineHeight:1.5}}>{t("precioPorColeccionDesc")}</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10}}>
                  <div>
                    <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4,fontWeight:600}}>Essential <span style={{color:C.gr2}}>€/ud</span></div>
                    <input type="number" step="0.10" disabled={ed.customPrice>0} value={ed.priceEssential||""} onChange={e => setEd(p => ({...p, priceEssential: parseFloat(e.target.value) || 0}))} placeholder="0.00" style={{width:"100%",padding:10,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:13,background:C.wh,color:C.dk,boxSizing:"border-box",fontWeight:600}} />
                  </div>
                  <div>
                    <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4,fontWeight:600}}>Icons <span style={{color:C.gr2}}>€/ud</span></div>
                    <input type="number" step="0.10" disabled={ed.customPrice>0} value={ed.priceIcons||""} onChange={e => setEd(p => ({...p, priceIcons: parseFloat(e.target.value) || 0}))} placeholder="0.00" style={{width:"100%",padding:10,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:13,background:C.wh,color:C.dk,boxSizing:"border-box",fontWeight:600}} />
                  </div>
                  <div>
                    <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4,fontWeight:600}}>Acetato <span style={{color:C.gr2}}>€/ud</span></div>
                    <input type="number" step="0.10" disabled={ed.customPrice>0} value={ed.priceAcetato||""} onChange={e => setEd(p => ({...p, priceAcetato: parseFloat(e.target.value) || 0}))} placeholder="0.00" style={{width:"100%",padding:10,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:13,background:C.wh,color:C.dk,boxSizing:"border-box",fontWeight:600}} />
                  </div>
                </div>
              </div>

              <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:16,marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:600}}>{t("prontoPago")}</div><div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:2}}>{t("prontoDesc")}</div></div>
                <button onClick={() => setEd(p => ({...p, earlyPay: !p.earlyPay}))} style={{width:44,height:24,borderRadius:12,background:ed.earlyPay?C.gn:C.ln,border:"none",cursor:"pointer",position:"relative"}}>
                  <div style={{width:18,height:18,borderRadius:9,background:C.wh,position:"absolute",top:3,left:ed.earlyPay?23:3,transition:"left 0.2s"}} />
                </button>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("notesComm")}</div>
                <textarea value={ed.notes || ""} onChange={e => setEd(p => ({...p, notes: e.target.value}))} rows={2} style={{width:"100%",padding:10,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
              </div>
            </>}

            {/* PRIVATE NOTES TAB */}
            {(ed._tab||"resume") === "notes" && <>
              <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginBottom:10}}>{t("notesPriveesDesc")}</div>
              <textarea value={ed.privateNotes || ""} onChange={e => setEd(p => ({...p, privateNotes: e.target.value}))} rows={6} placeholder="..." style={{width:"100%",padding:12,border:"1px solid "+C.ln,borderRadius:6,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical",lineHeight:1.6}} />
            </>}

            <div style={{display:"flex",gap:8,marginTop:12}}>
              <Btn onClick={() => { setClients(p => p.map(c => c.id === ed.id ? {...c, ...ed, _tab:undefined} : c)); if(ed.privateNotes !== undefined && user) dbSavePrivateNote(user.email, String(ed.id), ed.privateNotes||""); dbUpdateClient(ed); setModal(null); }} style={{flex:1}}>{t("enregistrerCond")}</Btn>
              <Btn ghost onClick={() => askConfirm(t("confirmarEliminar"), () => { setClients(p => p.filter(c => c.id !== ed.id)); dbDeleteClient(ed.id); toast(t("clienteEliminado")); setModal(null); })} style={{color:C.rd,borderColor:C.rd}}>✕</Btn>
            </div>
          </>}

          {/* NEW CLIENT */}
          {modal === "newCl" && <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              {[[t("boutique"),"name"],[t("contact"),"contact"],[t("ville"),"city"],[t("pays"),"country"],[t("codePostal"),"postalCode"],[t("telephone"),"phone"]].map(([l,k]) => (
                <div key={k} style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{l}</div>
                  <input value={ed[k] || ""} onChange={e => setEd(p => ({...p, [k]: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                </div>
              ))}
            </div>
            <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:700,marginTop:8,marginBottom:8}}>{t("dirEnvio")}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              {[[t("direccion"),"shippingAddress"],[t("ville"),"shippingCity"],[t("codePostal"),"shippingPostal"],[t("pays"),"shippingCountry"]].map(([l,k]) => (
                <div key={k} style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{l}</div>
                  <input value={ed[k] || ""} onChange={e => setEd(p => ({...p, [k]: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                </div>
              ))}
            </div>
            <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:700,marginTop:8,marginBottom:8}}>{t("dirFacturacion")}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              {[[t("raisonSociale"),"companyName"],[t("nif"),"taxId"],[t("direccion"),"address"],[t("emailLabel"),"companyEmail"]].map(([l,k]) => (
                <div key={k} style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{l}</div>
                  <input value={ed[k] || ""} onChange={e => setEd(p => ({...p, [k]: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                </div>
              ))}
            </div>
            <Btn onClick={() => { if(ed.name){const fromCart = ed._fromCart; const nc = {...ed, id: Date.now(), orders:0, total:0, status:"prospect", channel: role==="distributor"?distLabel:"Direct", customPrice:0, earlyPay:false}; delete nc._fromCart; setClients(p => [...p, nc]); dbSaveClient(nc); if(fromCart && role==="distributor"){ setCartCl(nc.name); } toast(t("clienteCreado")); setModal(null);} }} style={{width:"100%",marginTop:8}}>{t("enregistrer")}</Btn>
          </>}

          {/* EDIT STOCK */}
          {/* MODEL DETAIL MODAL */}
          {modal === "viewModel" && selectedModel && (() => {
            const mg = selectedModel;
            const colors = mg.colors;
            const sel = colors[selectedColorIdx] || colors[0];
            const isAcetato = mg.col === "Acetato";
            const displayPrice = isAcetato ? (sel.fixedPrice||27.90) : (customPrice > 0 ? customPrice : essentialUnitPrice);
            return <>
              <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                {/* LEFT: Image */}
                <div style={{flex:"1 1 260px",minWidth:200}}>
                  <div style={{height:260,background:C.wh,borderRadius:6,border:"1px solid "+C.ln,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",marginBottom:10}}>
                    {sel.imageUrl ? <img src={sel.imageUrl} alt={sel.model+" "+sel.color} style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain",padding:10}} /> : <span style={{fontSize:40,color:C.ln,fontFamily:DP}}>MINUË</span>}
                  </div>
                  {/* Color thumbnails */}
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {colors.map((c,i) => <div key={i} onClick={() => setSelectedColorIdx(i)} style={{width:48,height:48,borderRadius:6,border:selectedColorIdx===i?"2px solid "+C.dk:"1px solid "+C.ln,overflow:"hidden",cursor:"pointer",background:C.wh,display:"flex",alignItems:"center",justifyContent:"center",transition:"border 0.2s"}}>
                      {c.imageUrl ? <img src={c.imageUrl} style={{width:"100%",height:"100%",objectFit:"contain",padding:2}} /> : <span style={{fontSize:6,color:C.gr,fontFamily:BD}}>—</span>}
                    </div>)}
                  </div>
                </div>
                {/* RIGHT: Info + colors */}
                <div style={{flex:"1 1 240px",minWidth:200}}>
                  <div style={{fontSize:9,fontFamily:BD,color:isAcetato?"#7a5c3a":C.gr,background:isAcetato?"#e8d5c0":C.bg,padding:"3px 10px",borderRadius:10,display:"inline-block",marginBottom:8,fontWeight:500}}>{mg.col}</div>
                  <div style={{fontSize:22,fontFamily:DP,fontWeight:400,color:C.dk,marginBottom:2}}>{mg.model}</div>
                  <div style={{fontSize:13,fontFamily:BD,color:C.gr,marginBottom:4}}>{sel.color}</div>
                  <div style={{fontSize:10,fontFamily:BD,color:C.gr2,marginBottom:12}}>{sel.sku}</div>
                  <div style={{display:"flex",gap:16,marginBottom:16}}>
                    <div><div style={{fontSize:10,color:C.gr,fontFamily:BD}}>Wholesale</div><div style={{fontSize:20,fontWeight:600,fontFamily:BD,color:C.dk}}>{fmt(displayPrice)} €</div></div>
                    <div><div style={{fontSize:10,color:C.gr,fontFamily:BD}}>PVP</div><div style={{fontSize:16,fontWeight:400,fontFamily:BD,color:C.gr}}>{isAcetato?"70":"45-50"} €</div></div>
                    <div><div style={{fontSize:10,color:C.gr,fontFamily:BD}}>Stock</div><div style={{fontSize:16,fontWeight:600,fontFamily:BD,color:sel.stock===0?C.rd:sel.stock<5?C.yl:C.gn}}>{sel.stock}</div></div>
                  </div>
                  {/* Color list with add to cart */}
                  <div style={{fontSize:11,fontFamily:BD,fontWeight:600,color:C.dk,marginBottom:8}}>{mg.colors.length} {t("couleurs")} :</div>
                  <div style={{maxHeight:200,overflowY:"auto"}}>
                    {colors.map((c,i) => {
                      const cq = getCardQty(c.id);
                      const inCart = cart[c.id]>0;
                      return <div key={c.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:6,marginBottom:4,background:selectedColorIdx===i?C.dk+"08":inCart?C.gn+"08":"transparent",border:"1px solid "+(selectedColorIdx===i?C.dk+"20":inCart?C.gn+"20":"transparent"),cursor:"pointer"}} onClick={() => setSelectedColorIdx(i)}>
                        <div style={{width:32,height:32,borderRadius:4,border:"1px solid "+C.ln,overflow:"hidden",flexShrink:0,background:C.wh}}>
                          {c.imageUrl ? <img src={c.imageUrl} style={{width:"100%",height:"100%",objectFit:"contain"}} /> : null}
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:selectedColorIdx===i?600:400}}>{c.color}</div>
                          <div style={{fontSize:9,fontFamily:BD,color:c.stock===0?C.rd:c.stock<5?C.yl:C.gr}}>Stock: {c.stock}{inCart?" · 🛒 x"+cart[c.id]:""}</div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:2,flexShrink:0}}>
                          <div style={{display:"flex",alignItems:"center",border:"1px solid "+C.ln,borderRadius:3,overflow:"hidden"}}>
                            <button onClick={e => { e.stopPropagation(); setCardQty(c.id, cq-1); }} style={{width:24,height:26,background:C.bg,border:"none",cursor:"pointer",fontSize:11,fontFamily:BD,color:C.dk}}>-</button>
                            <span style={{minWidth:22,textAlign:"center",fontSize:11,fontFamily:BD,fontWeight:600}}>{cq}</span>
                            <button onClick={e => { e.stopPropagation(); setCardQty(c.id, cq+1); }} style={{width:24,height:26,background:C.bg,border:"none",cursor:"pointer",fontSize:11,fontFamily:BD,color:C.dk}}>+</button>
                          </div>
                          <button onClick={e => { e.stopPropagation(); addToCart(c.id, cq); }} style={{padding:"5px 10px",background:C.dk,color:C.bg,border:"none",fontSize:9,cursor:"pointer",fontFamily:BD,borderRadius:3,fontWeight:500}}>+🛒</button>
                        </div>
                      </div>;
                    })}
                  </div>
                  {role !== "admin" && <button onClick={() => { const isFav = favs.includes(sel.id); setFavs(f => isFav?f.filter(x=>x!==sel.id):[...f,sel.id]); dbToggleFav(sel.id); }} style={{marginTop:12,padding:"8px 16px",background:"transparent",border:"1px solid "+(favs.includes(sel.id)?"#6b4c3b":C.ln),borderRadius:4,fontSize:10,fontFamily:BD,color:favs.includes(sel.id)?"#6b4c3b":C.gr,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill={favs.includes(sel.id)?"#6b4c3b":"none"} stroke={favs.includes(sel.id)?"#6b4c3b":"#999"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    {favs.includes(sel.id)?t("retirerFav"):t("ajouterFav")}
                  </button>}
                </div>
              </div>
              {/* CONTINUE BROWSING BUTTON */}
              {role !== "admin" && <div style={{marginTop:20,paddingTop:16,borderTop:"1px solid "+C.bg2,display:"flex",gap:10,flexWrap:"wrap",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:11,fontFamily:BD,color:C.gr}}>{cartCount > 0 ? "🛒 "+cartCount+" "+t("unites")+" — "+fmt(finalTotal)+" €" : t("panier")+" "+t("vide")}</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <button onClick={() => setModal(null)} style={{padding:"10px 18px",background:"transparent",color:C.dk,border:"1px solid "+C.dk,borderRadius:5,fontSize:11,fontFamily:BD,fontWeight:600,cursor:"pointer"}}>← {t("seguirComprando")}</button>
                  {cartCount > 0 && <button onClick={() => { setModal(null); setView(role === "distributor" ? "d-cart" : "c-cart"); }} style={{padding:"10px 18px",background:C.dk,color:C.bg,border:"none",borderRadius:5,fontSize:11,fontFamily:BD,fontWeight:600,cursor:"pointer"}}>🛒 {t("panier")} →</button>}
                </div>
              </div>}
            </>;
          })()}

          {modal === "editSt" && <>
            {ed.imageUrl && <div style={{height:118,background:C.wh,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14,border:"1px solid "+C.ln,overflow:"hidden",position:"relative"}}>
              <img src={ed.imageUrl} alt={ed.model} style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain",padding:6,opacity:ed.active===false?0.4:1}} />
              {ed.active === false && <div style={{position:"absolute",top:8,right:8,background:"#666",color:"#fff",padding:"3px 10px",borderRadius:3,fontSize:9,fontFamily:BD,fontWeight:700,letterSpacing:1}}>OCULTO</div>}
            </div>}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:8}}>
              <div style={{fontSize:15,fontFamily:DP,color:C.dk,fontWeight:500}}>{ed.model} - {ed.color}</div>
              {ed.active === false && <span style={{fontSize:9,fontFamily:BD,fontWeight:700,color:"#666",background:"#66666615",padding:"3px 10px",borderRadius:3,letterSpacing:1}}>OCULTO PARA TIENDAS</span>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
              <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:14,textAlign:"center"}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("stockActuel")}</div>
                <div style={{fontSize:24,fontWeight:300,fontFamily:DP,color:parseInt(ed.stock)<10?C.yl:C.gn}}>{ed.stock}</div>
              </div>
              <div>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("nouveauStock")}</div>
                <input type="number" value={ed.stock} onChange={e => setEd(p => ({...p, stock: e.target.value}))} style={{width:"100%",padding:12,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:18,background:C.wh,color:C.dk,boxSizing:"border-box",fontWeight:600,textAlign:"center"}} />
                <div style={{display:"flex",gap:6,marginTop:8}}>
                  {[5,10,20,50].map(n => <button key={n} onClick={() => setEd(p => ({...p, stock: String((parseInt(p.stock)||0)+n)}))} style={{flex:1,padding:6,background:C.bg,border:"1px solid "+C.ln,borderRadius:3,fontSize:10,fontFamily:BD,color:C.dk,cursor:"pointer"}}>+{n}</button>)}
                </div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              <div>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("forme")}</div>
                <select value={ed.shape||""} onChange={e => setEd(p => ({...p, shape:e.target.value}))} style={{width:"100%",padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  <option value="">—</option>
                  {["ronde","carree","catEye","rectangulaire","aviateur","oversize","geometrique"].map(v => <option key={v} value={v}>{t(v)}</option>)}
                </select>
              </div>
              <div>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("couleur")}</div>
                <select value={ed.colorFamily||""} onChange={e => setEd(p => ({...p, colorFamily:e.target.value}))} style={{width:"100%",padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  <option value="">—</option>
                  {["noir","careyCol","marron","vert","dore","rose","bleu","rougeVin","orangeCol","cremeNude","gris","transparentCol","multicolore"].map(v => <option key={v} value={v}>{t(v)}</option>)}
                </select>
              </div>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:6}}>{t("etiquetas")}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {[["top",t("topVenta"),"#c4956a"],["new",t("nuevo"),"#8e44ad"],["rec",t("recomendado"),"#722f37"],["icons","Icons","#b8860b"],["privee","Privée","#18332f"]].map(([tg,lb,cl]) => { const tags = ed.tags||[]; const on = tags.includes(tg); return (
                  <button key={tg} onClick={() => setEd(p => ({...p, tags: on ? tags.filter(x=>x!==tg) : [...tags, tg]}))} style={{padding:"6px 12px",background:on?cl:"transparent",color:on?"#fff":cl,border:"1px solid "+(on?cl:C.ln),borderRadius:3,fontSize:10,fontFamily:BD,fontWeight:600,cursor:"pointer",textTransform:"uppercase"}}>{lb}</button>
                ); })}
              </div>
            </div>

            {/* VISIBILITY TOGGLE */}
            <div style={{marginBottom:16,padding:"12px 14px",background:ed.active===false?"#fafafa":C.bg,border:"1px solid "+(ed.active===false?"#66666640":C.ln),borderRadius:6}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
                <div style={{flex:1,minWidth:200}}>
                  <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:3}}>👁 Visibilidad para tiendas y distribuidores</div>
                  <div style={{fontSize:10,fontFamily:BD,color:C.gr,lineHeight:1.4}}>{ed.active===false ? "Producto OCULTO — no aparece en el catálogo de clientes ni distribuidores. Sigue visible solo para admin/equipo." : "Producto ACTIVO — visible en el catálogo de todos los clientes y distribuidores."}</div>
                </div>
                <button onClick={() => setEd(p => ({...p, active: p.active === false}))} style={{padding:"8px 16px",background:ed.active===false?"#666":C.gn,color:"#fff",border:"none",borderRadius:4,fontSize:11,fontFamily:BD,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>{ed.active===false ? "↻ Activar" : "⊘ Ocultar"}</button>
              </div>
            </div>

            <Btn onClick={() => { const newActive = ed.active !== false; setProducts(p => p.map(pr => pr.id === ed.id ? {...pr, stock: parseInt(ed.stock)||0, tags: ed.tags||[], shape: ed.shape||"", colorFamily: ed.colorFamily||"", active: newActive} : pr)); dbUpdateProduct({...ed, stock: parseInt(ed.stock)||0, active: newActive}); setModal(null); }} style={{width:"100%"}}>{t("mettreAJour")}</Btn>
          </>}

          {/* SUPPLIER ORDER - editable */}
          {modal === "supplierOrder" && <>
            <div style={{fontSize:15,fontFamily:DP,fontWeight:600,color:C.dk,marginBottom:4}}>📋 Pedido proveedor</div>
            <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginBottom:14}}>Ajusta cantidades · {(ed.lines||[]).filter(l => l._order > 0).length} productos · {(ed.lines||[]).reduce((s,l) => s+(l._order||0), 0)} uds total</div>

            {/* ADD MANUAL PRODUCT */}
            <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:"10px 12px",marginBottom:12}}>
              <div style={{fontSize:10,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:6}}>➕ Añadir diseño al pedido</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                <input value={ed._supSearch||""} onChange={e => setEd(p => ({...p, _supSearch:e.target.value}))} placeholder="🔍 Buscar modelo, color, SKU..." style={{flex:"1 1 180px",padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} />
                <select id="supManualProd" style={{flex:"1 1 220px",padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk}}>
                  {products.filter(p => {
                    const inList = (ed.lines||[]).some(l => l.sku === p.sku);
                    if (inList) return false;
                    if (!ed._supSearch) return true;
                    const s = ed._supSearch.toLowerCase();
                    return p.model.toLowerCase().includes(s) || p.color.toLowerCase().includes(s) || (p.sku||"").toLowerCase().includes(s);
                  }).map(p => <option key={p.id} value={p.id}>{p.model} - {p.color} [{p.col}] (stock: {p.stock})</option>)}
                </select>
                <input id="supManualQty" type="number" min="1" defaultValue="5" placeholder="Uds" style={{width:60,padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,textAlign:"center",boxSizing:"border-box"}} />
                <Btn small onClick={() => {
                  const sel = document.getElementById("supManualProd");
                  const qi = document.getElementById("supManualQty");
                  const p = products.find(x => String(x.id) === String(sel.value));
                  if (!p) return;
                  const allLines = orders.flatMap(o => (o.lines||[]).map(l => ({...l})));
                  const sold = allLines.filter(l => l.sku === p.sku).reduce((s,l) => s+l.qty, 0);
                  const newLine = {...p, _sold:sold, _sug:Math.max(0,Math.ceil(sold*1.5)-p.stock), _order:parseInt(qi.value)||5, _manual:true};
                  setEd(prev => ({...prev, lines:[newLine, ...(prev.lines||[])], _supSearch:""}));
                }}>+ Añadir</Btn>
              </div>
              <div style={{fontSize:9,fontFamily:BD,color:C.gr2,marginTop:6}}>💡 Útil para añadir diseños nuevos, productos sin sugerencia, o variantes que aún no tienen historial de ventas.</div>
            </div>

            <div style={{maxHeight:"45vh",overflowY:"auto",border:"1px solid "+C.ln,borderRadius:6,background:C.wh}}>
              {/* Header */}
              <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 10px",borderBottom:"2px solid "+C.ln,background:C.bg,fontSize:9,fontFamily:BD,color:C.gr,fontWeight:600,letterSpacing:0.5,position:"sticky",top:0,zIndex:1}}>
                <span style={{width:32}}></span>
                <span style={{flex:1}}>PRODUCTO</span>
                <span style={{width:40,textAlign:"center"}}>STOCK</span>
                <span style={{width:40,textAlign:"center"}}>VEND.</span>
                <span style={{width:40,textAlign:"center"}}>SUG.</span>
                <span style={{width:56,textAlign:"center"}}>PEDIR</span>
                <span style={{width:22}}></span>
              </div>
              {(ed.lines||[]).map((l,i) => <div key={l.sku} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderBottom:"1px solid "+C.bg2,background:l._order>0?(l.stock===0?C.rd+"06":l._manual?"#8e44ad08":C.bl+"04"):"transparent"}}>
                <div style={{width:32,height:32,borderRadius:3,background:C.wh,border:"1px solid "+C.ln,overflow:"hidden",flexShrink:0}}>
                  {l.imageUrl ? <img src={l.imageUrl} style={{width:"100%",height:"100%",objectFit:"contain"}} /> : null}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <span style={{fontSize:11,fontWeight:600,fontFamily:BD,color:C.dk}}>{l.model} </span>
                  <span style={{fontSize:10,fontFamily:BD,color:C.gr}}>{l.color}</span>
                  {l._manual && <span style={{fontSize:8,marginLeft:6,padding:"1px 5px",background:"#8e44ad20",color:"#8e44ad",borderRadius:3,fontWeight:700,letterSpacing:0.3}}>MANUAL</span>}
                  <div style={{fontSize:8,fontFamily:BD,color:C.gr2}}>{l.sku} · {l.col}</div>
                </div>
                <span style={{width:40,textAlign:"center",fontSize:11,fontFamily:BD,color:l.stock===0?C.rd:l.stock<5?C.yl:C.dk,fontWeight:600}}>{l.stock}</span>
                <span style={{width:40,textAlign:"center",fontSize:10,fontFamily:BD,color:C.bl}}>{l._sold||0}</span>
                <span style={{width:40,textAlign:"center",fontSize:10,fontFamily:BD,color:C.gr}}>{l._sug||0}</span>
                <input type="number" min="0" value={l._order||0} onChange={e => { const val = parseInt(e.target.value)||0; setEd(p => ({...p, lines:p.lines.map((ll,j) => j===i?{...ll,_order:val}:ll)})); }} style={{width:56,padding:"4px 2px",border:"1px solid "+(l._order>0?C.bl+"50":C.ln),borderRadius:3,fontFamily:BD,fontSize:12,fontWeight:600,background:l._order>0?C.bl+"08":C.wh,color:C.dk,textAlign:"center",boxSizing:"border-box"}} />
                <button onClick={() => setEd(p => ({...p, lines:p.lines.filter((_,j) => j !== i)}))} title="Quitar" style={{width:22,height:22,background:"transparent",border:"none",color:C.rd,cursor:"pointer",fontSize:14,padding:0,fontWeight:700}}>×</button>
              </div>)}
            </div>
            <div style={{display:"flex",gap:10,marginTop:14,flexWrap:"wrap"}}>
              <button onClick={() => setEd(p => ({...p, lines:p.lines.map(l => l._manual ? l : ({...l,_order:l._sug||0}))}))} style={{flex:1,padding:"10px 0",background:C.bg,border:"1px solid "+C.ln,borderRadius:4,fontSize:10,fontFamily:BD,color:C.dk,cursor:"pointer",fontWeight:500}}>↺ Resetear sugeridos</button>
              <button onClick={() => setEd(p => ({...p, lines:p.lines.map(l => ({...l,_order:0}))}))} style={{padding:"10px 14px",background:C.bg,border:"1px solid "+C.ln,borderRadius:4,fontSize:10,fontFamily:BD,color:C.gr,cursor:"pointer"}}>Limpiar</button>
            </div>
            <Btn onClick={() => { const toOrder = (ed.lines||[]).filter(l => l._order > 0); if(toOrder.length===0) return; const csv = "SKU;Modelo;Color;Coleccion;Stock actual;Vendidos;Cantidad pedida;Tipo\n" + toOrder.map(l => [l.sku,l.model,l.color,l.col,l.stock,l._sold||0,l._order,l._manual?"Manual":"Sugerido"].join(";")).join("\n"); const blob = new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"}); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href=url; a.download="pedido_proveedor_"+new Date().toISOString().slice(0,10)+".csv"; a.click(); setModal(null); }} style={{width:"100%",marginTop:8}}>📥 Descargar CSV ({(ed.lines||[]).filter(l => l._order > 0).length} productos · {(ed.lines||[]).reduce((s,l) => s+(l._order||0), 0)} uds)</Btn>
          </>}

          {/* NEW PRODUCT */}
          {modal === "newProd" && <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              {[[t("modele"),"model"],[t("couleur"),"color"],["SKU","sku"],[t("categorie"),"cat"]].map(([l,k]) => (
                <div key={k} style={{marginBottom:12}}>
                  <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{l}</div>
                  <input value={ed[k] || ""} onChange={e => setEd(p => ({...p, [k]: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>Collection</div>
                <select value={ed.col || "Essential"} onChange={e => setEd(p => ({...p, col: e.target.value, fixedPrice: e.target.value === "Acetato" ? ACETATO_PRICE : 0}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  <option value="Essential">Essential</option>
                  <option value="Acetato">Acetato</option>
                </select>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("stockInit")}</div>
                <input type="number" value={ed.stock || ""} onChange={e => setEd(p => ({...p, stock: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
            </div>
            {(ed.col === "Acetato") && <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>Prix fixe Acetato (€)</div>
              <input type="number" step="0.10" value={ed.fixedPrice || ACETATO_PRICE} onChange={e => setEd(p => ({...p, fixedPrice: parseFloat(e.target.value) || ACETATO_PRICE}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>}
            <Btn onClick={() => { if(ed.model){setProducts(p => [...p, {id:p.length+50, model:ed.model.toUpperCase(), color:ed.color||"", sku:ed.sku||"MN-NEW", col:ed.col||"Essential", cat:ed.col||"Essential", stock:parseInt(ed.stock)||0, fixedPrice:ed.col==="Acetato"?(ed.fixedPrice||ACETATO_PRICE):0}]); setModal(null);} }} style={{width:"100%"}}>{t("ajouterCat")}</Btn>
          </>}

          {/* NEW ORDER */}
          {modal === "newOrd" && <>
            <div style={{fontSize:18,fontFamily:DP,color:C.dk,fontWeight:600,marginBottom:14}}>📦 {t("nouvelleCmd")}</div>

            {/* CLIENT SECTION */}
            <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:14,marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:6}}>
                <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:700}}>👤 {t("client")} *</div>
                <button onClick={() => setEd(p => ({...p, _newClient: !p._newClient, client:""}))} style={{padding:"5px 10px",background:ed._newClient?C.dk:"transparent",color:ed._newClient?C.bg:C.gn,border:"1px solid "+(ed._newClient?C.dk:C.gn),borderRadius:4,fontSize:10,fontFamily:BD,fontWeight:600,cursor:"pointer"}}>{ed._newClient ? "← Elegir existente" : "+ Nuevo cliente"}</button>
              </div>
              {ed._newClient ? <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <div><div style={{fontSize:9,color:C.gr,fontFamily:BD,marginBottom:3}}>{t("boutique")} *</div><input value={ed._newClientName||""} onChange={e => setEd(p => ({...p, _newClientName: e.target.value, client: e.target.value}))} placeholder="Optique Paris" style={{width:"100%",padding:7,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} /></div>
                <div><div style={{fontSize:9,color:C.gr,fontFamily:BD,marginBottom:3}}>{t("contact")}</div><input value={ed._newClientContact||""} onChange={e => setEd(p => ({...p, _newClientContact: e.target.value}))} placeholder="Marie Dupont" style={{width:"100%",padding:7,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} /></div>
                <div><div style={{fontSize:9,color:C.gr,fontFamily:BD,marginBottom:3}}>{t("ville")}</div><input value={ed._newClientCity||""} onChange={e => setEd(p => ({...p, _newClientCity: e.target.value}))} placeholder="Paris" style={{width:"100%",padding:7,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} /></div>
                <div><div style={{fontSize:9,color:C.gr,fontFamily:BD,marginBottom:3}}>{t("pays")}</div><input value={ed._newClientCountry||"FR"} onChange={e => setEd(p => ({...p, _newClientCountry: e.target.value}))} placeholder="FR" style={{width:"100%",padding:7,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} /></div>
                <div><div style={{fontSize:9,color:C.gr,fontFamily:BD,marginBottom:3}}>{t("emailLabel")}</div><input value={ed._newClientEmail||""} onChange={e => setEd(p => ({...p, _newClientEmail: e.target.value}))} placeholder="contact@store.com" style={{width:"100%",padding:7,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} /></div>
                <div><div style={{fontSize:9,color:C.gr,fontFamily:BD,marginBottom:3}}>{t("telephone")}</div><input value={ed._newClientPhone||""} onChange={e => setEd(p => ({...p, _newClientPhone: e.target.value}))} placeholder="+33 6 12 34 56 78" style={{width:"100%",padding:7,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} /></div>
                <div style={{gridColumn:"1 / -1",fontSize:9,fontFamily:BD,color:C.bl,padding:"4px 8px",background:C.bl+"10",borderRadius:3,fontWeight:500}}>ℹ️ Se creará en la lista de clientes (status: prospect) al guardar el pedido</div>
              </div> : <>
                <input value={ed._clSearch||""} onChange={e => setEd(p => ({...p, _clSearch: e.target.value}))} placeholder="🔍 Buscar cliente por nombre, ciudad..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.wh,color:C.dk,boxSizing:"border-box",marginBottom:6}} />
                <select value={ed.client || ""} onChange={e => setEd(p => ({...p, client: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.wh,color:C.dk,boxSizing:"border-box"}}>
                  <option value="">{t("choisirClient")}</option>
                  {clients.filter(c => !ed._clSearch || c.name.toLowerCase().includes(ed._clSearch.toLowerCase()) || (c.city||"").toLowerCase().includes(ed._clSearch.toLowerCase()) || (c.contact||"").toLowerCase().includes(ed._clSearch.toLowerCase())).map(c => <option key={c.id} value={c.name}>{c.name} · {c.city||"—"} ({c.channel}) {c.status==="vip"?"★":""}</option>)}
                </select>
                {ed.client && (() => { const sc = clients.find(c => c.name === ed.client); return sc ? <div style={{marginTop:6,fontSize:10,fontFamily:BD,color:C.gr,lineHeight:1.5}}>📞 {sc.phone||"—"} · ✉️ {sc.companyEmail||"—"} {sc.customPrice>0 && <span style={{color:C.bl,fontWeight:600,marginLeft:6}}>💰 Precio fijo: {fmt(sc.customPrice)} €</span>} {sc.status==="vip" && <span style={{color:C.yl,marginLeft:6}}>★ VIP</span>}</div> : null; })()}
              </>}
              <div style={{marginTop:10}}>
                <div style={{fontSize:9,color:C.gr,fontFamily:BD,marginBottom:3}}>{t("canal")}</div>
                <select value={ed.dist || "Direct"} onChange={e => setEd(p => ({...p, dist: e.target.value}))} style={{width:"100%",padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.wh,color:C.dk,boxSizing:"border-box"}}>
                  {["Direct","Agent Sud","MPM Diffusion","Showroom Nomada","MCModa","Faire",...users.filter(u => u.role === "distributor").map(u => u.co).filter(c => c && !["Agent Sud","MPM Diffusion","Showroom Nomada","MCModa","Faire"].includes(c))].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* PRODUCTS SECTION */}
            <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:14,marginBottom:14}}>
              <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:8}}>🕶 {t("articles")} *</div>
              <input value={ed._prSearch||""} onChange={e => setEd(p => ({...p, _prSearch: e.target.value}))} placeholder="🔍 Buscar modelo, color, SKU..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.wh,color:C.dk,boxSizing:"border-box",marginBottom:8}} />
              <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
                <select id="nop" style={{flex:"1 1 200px",padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk}}>
                  {products.filter(p => !ed._prSearch || p.model.toLowerCase().includes(ed._prSearch.toLowerCase()) || p.color.toLowerCase().includes(ed._prSearch.toLowerCase()) || (p.sku||"").toLowerCase().includes(ed._prSearch.toLowerCase())).map(p => <option key={p.id} value={p.id} style={{color:p.stock===0?"#e74c3c":p.stock<5?"#f39c12":"inherit"}}>{p.model} - {p.color} [{p.col}] (stock: {p.stock})</option>)}
                </select>
                <input id="noq" type="number" defaultValue="2" min="1" placeholder="Uds" style={{width:60,padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,textAlign:"center"}} />
                <Btn small onClick={() => { const sel = document.getElementById("nop"); const qi = document.getElementById("noq"); const p = products.find(x => String(x.id) === String(sel.value)); if(p) setEd(prev => ({...prev, lines:[...(prev.lines||[]), {model:p.model, color:p.color, sku:p.sku, qty:parseInt(qi.value)||2, price:0, col:p.col}]})); }}>+ {t("ajouter")}</Btn>
              </div>
              {edLines.length > 0 && <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:4,overflow:"hidden"}}>
                {edLines.map((l, i) => {
                  const isAcetato = l.col === "Acetato";
                  const linePrice = isAcetato ? 27.90 : edUp;
                  return <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",borderBottom:"1px solid "+C.bg2,fontSize:11,fontFamily:BD,flexWrap:"wrap"}}>
                    <span style={{fontWeight:600,color:C.dk,flex:"1 1 120px"}}>{l.model}</span>
                    <span style={{color:C.gr,fontSize:10}}>{l.color}{isAcetato && <span style={{marginLeft:4,fontSize:8,padding:"1px 5px",background:"#e8d5c0",color:"#7a5c3a",borderRadius:2}}>Acetato</span>}</span>
                    <button onClick={() => setEd(prev => ({...prev, lines: prev.lines.map((x,j) => j===i ? {...x, qty: Math.max(1, x.qty-1)} : x)}))} style={{width:22,height:22,background:C.bg,border:"1px solid "+C.ln,borderRadius:2,cursor:"pointer",fontSize:11,fontFamily:BD,color:C.dk}}>-</button>
                    <span style={{fontWeight:600,minWidth:24,textAlign:"center"}}>{l.qty}</span>
                    <button onClick={() => setEd(prev => ({...prev, lines: prev.lines.map((x,j) => j===i ? {...x, qty: x.qty+1} : x)}))} style={{width:22,height:22,background:C.bg,border:"1px solid "+C.ln,borderRadius:2,cursor:"pointer",fontSize:11,fontFamily:BD,color:C.dk}}>+</button>
                    <span style={{fontWeight:600,minWidth:60,textAlign:"right"}}>{fmt(linePrice * l.qty)} €</span>
                    <button onClick={() => setEd(prev => ({...prev, lines: prev.lines.filter((_, j) => j !== i)}))} style={{background:"none",border:"none",color:C.rd,cursor:"pointer",fontSize:14,padding:"0 4px"}}>×</button>
                  </div>;
                })}
              </div>}
            </div>

            {/* SHIPPING + DATE + NOTES */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:12}}>
                <div style={{fontSize:10,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:6}}>📦 {t("dirEnvio")}</div>
                {ed.client && !ed._newClient && (() => { const sc = clients.find(c => c.name === ed.client); return sc && (sc.shippingAddress || sc.address) ? <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:6,lineHeight:1.4}}>{sc.shippingAddress || sc.address}<br/>{sc.shippingCity || sc.city || ""}, {sc.shippingPostal || sc.postalCode || ""} {sc.shippingCountry || sc.country || ""}</div> : <div style={{fontSize:10,fontFamily:BD,color:C.gr2,marginBottom:6,fontStyle:"italic"}}>Sin dirección registrada</div>; })()}
                <textarea value={ed.shippingOverride||""} onChange={e => setEd(p => ({...p, shippingOverride: e.target.value}))} rows={2} placeholder="Sobrescribir dirección (opcional)..." style={{width:"100%",padding:7,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:10,background:C.wh,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
              </div>
              <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:12}}>
                <div style={{fontSize:10,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:6}}>📅 Fecha preferente envío</div>
                <input type="date" value={ed.preferredDate||""} onChange={e => setEd(p => ({...p, preferredDate: e.target.value}))} min={new Date(Date.now()+3*86400000).toISOString().split("T")[0]} style={{width:"100%",padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} />
                <div style={{fontSize:9,fontFamily:BD,color:C.gr,marginTop:4}}>Mín. 3-5 días laborables</div>
              </div>
            </div>

            {/* NOTES */}
            <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:12,marginBottom:14}}>
              <div style={{fontSize:10,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:6}}>📝 {t("notesCmd")}</div>
              <textarea value={ed.clientNotes||""} onChange={e => setEd(p => ({...p, clientNotes: e.target.value}))} rows={2} placeholder="Notas internas o del cliente..." style={{width:"100%",padding:7,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
            </div>

            {/* DISCOUNT */}
            <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:12,marginBottom:14}}>
              <div style={{fontSize:10,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:6}}>💸 Descuento (opcional)</div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <select value={ed.discountType||"none"} onChange={e => setEd(p => ({...p, discountType: e.target.value, discount: e.target.value==="none"?0:p.discount||0}))} style={{padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk}}>
                  <option value="none">Sin descuento</option>
                  <option value="pct">% Porcentaje</option>
                  <option value="abs">€ Importe fijo</option>
                </select>
                {ed.discountType && ed.discountType !== "none" && <input type="number" step="0.01" value={ed.discount||""} onChange={e => setEd(p => ({...p, discount: parseFloat(e.target.value)||0}))} placeholder={ed.discountType==="pct"?"5":"10"} style={{width:80,padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} />}
                {ed.discountType === "pct" && <span style={{fontSize:11,fontFamily:BD,color:C.gr}}>%</span>}
                {ed.discountType === "abs" && <span style={{fontSize:11,fontFamily:BD,color:C.gr}}>€</span>}
                <input value={ed.discountReason||""} onChange={e => setEd(p => ({...p, discountReason: e.target.value}))} placeholder="Motivo (ej: primer pedido)" style={{flex:1,padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} />
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:12,marginBottom:14}}>
              <div style={{fontSize:10,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:6}}>💳 Método de pago (si se sabe ya)</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {[["",t("plusTard"),"⏱"],["stripe","Stripe","💳"],["sepa","SEPA","🏦"],["transfer","Transferencia","🏧"],["deferred","Aplazado","📅"]].map(([v,l,e]) => (
                  <button key={v} onClick={() => setEd(p => ({...p, payMethod: v, pay: v ? "pending" : "pending"}))} style={{padding:"6px 12px",background:(ed.payMethod||"")===v?C.dk:C.wh,color:(ed.payMethod||"")===v?C.bg:C.dk,border:"1px solid "+((ed.payMethod||"")===v?C.dk:C.ln),borderRadius:4,fontSize:10,fontFamily:BD,fontWeight:500,cursor:"pointer"}}>{e} {l}</button>
                ))}
              </div>
            </div>

            {/* SUMMARY + ACTIONS */}
            {(() => {
              const subtotal = edLines.reduce((s,l) => s + ((l.col === "Acetato" ? 27.90 : edUp) * l.qty), 0);
              const disc = ed.discountType === "pct" ? subtotal * ((ed.discount||0)/100) : ed.discountType === "abs" ? (ed.discount||0) : 0;
              const finalT = Math.max(0, subtotal - disc);
              return <>
                <div style={{background:"linear-gradient(135deg,"+C.dk+"08,"+CL.gn+"10)",border:"2px solid "+C.dk+"20",borderRadius:8,padding:"14px 18px",marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:disc>0?6:0}}>
                    <span style={{fontSize:11,fontFamily:BD,color:C.gr}}>Subtotal · {edQty} uds</span>
                    <span style={{fontSize:13,fontFamily:BD,fontWeight:600,color:C.dk}}>{fmt(subtotal)} €</span>
                  </div>
                  {disc > 0 && <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <span style={{fontSize:11,fontFamily:BD,color:C.gn}}>Descuento {ed.discountType==="pct"?"("+ed.discount+"%)":""}</span>
                    <span style={{fontSize:12,fontFamily:BD,fontWeight:600,color:C.gn}}>-{fmt(disc)} €</span>
                  </div>}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:disc>0?8:0,borderTop:disc>0?"1px solid "+C.dk+"15":"none"}}>
                    <span style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700}}>{t("totalHT")}</span>
                    <span style={{fontSize:24,fontFamily:DP,fontWeight:500,color:C.dk}}>{fmt(finalT)} €</span>
                  </div>
                </div>
                <Btn disabled={(!ed.client && !(ed._newClient && ed._newClientName)) || edQty === 0} onClick={async () => {
                  // Create client if new
                  let clientName = ed.client;
                  if (ed._newClient && ed._newClientName) {
                    const tempId = Date.now();
                    const newCl = {id:tempId, name:ed._newClientName, contact:ed._newClientContact||"", city:ed._newClientCity||"", country:ed._newClientCountry||"FR", channel:ed.dist||"Direct", customPrice:0, priceEssential:0, priceIcons:0, priceAcetato:0, earlyPay:false, status:"prospect", notes:"Creado al hacer pedido", orders:0, total:0, phone:ed._newClientPhone||"", companyEmail:ed._newClientEmail||""};
                    setClients(p => [...p, newCl]);
                    clientName = newCl.name;
                    if (dbReady) { try { const {data} = await supabase.from("clients").insert({name:newCl.name, contact:newCl.contact, city:newCl.city, country:newCl.country, channel:newCl.channel, status:"prospect", phone:newCl.phone, company_email:newCl.companyEmail}).select().single(); if(data?.id) setClients(p => p.map(c => c.id === tempId ? {...c, id: data.id} : c)); } catch(e){ console.log("DB error:", e); } }
                  }
                  const lns = edLines.map(l => ({...l, price: l.col === "Acetato" ? 27.90 : edUp}));
                  const orderId = "#MN-"+String(orders.length+1).padStart(4,"0");
                  const newOrder = {id:orderId, client:clientName, dist:ed.dist||"Direct", date:new Date().toLocaleDateString("fr-FR"), items:edQty, total:finalT, comm:ed.dist!=="Direct"&&ed.dist!=="Faire"?finalT*0.15:0, status:"confirmed", pay:"pending", track:"", lines:lns, clientNotes: ed.clientNotes||"", shippingOverride: ed.shippingOverride||"", preferredDate: ed.preferredDate||"", payMethod: ed.payMethod||"", discountType: ed.discountType||"none", discount: ed.discount||0, discountReason: ed.discountReason||"", subtotal};
                  setOrders(p => [newOrder, ...p]);
                  logOrderChange(orderId, "Pedido creado por "+role, "Cliente: "+clientName+" · "+edQty+" uds · "+fmt(finalT)+" €"+(ed.discountType!=="none"?" · Descuento "+(ed.discountType==="pct"?ed.discount+"%":fmt(ed.discount)+"€"):""));
                  if (dbReady) { try { const {data:co} = await supabase.from("orders").insert({order_number:orderId, client_name:clientName, distributor:ed.dist||"Direct", total:finalT, items_count:edQty, status:"confirmed", payment_status:"pending", client_notes:ed.clientNotes||"", preferred_date:ed.preferredDate||null, payment_method:ed.payMethod||null}).select().single(); if(co) { for (const l of lns) { await supabase.from("order_lines").insert({order_id:co.id, model:l.model, color:l.color, sku:l.sku, quantity:l.qty, unit_price:l.price, collection:l.col||""}); } } } catch(e){} }
                  setModal(null);
                }} style={{width:"100%"}}>✓ Crear pedido ({edQty} uds · {fmt(finalT)} €)</Btn>
              </>;
            })()}
          </>}

          {/* IMPORT FAIRE ORDER */}
          {modal === "importFaire" && <>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,padding:"14px 18px",background:"#fafafa",border:"2px solid #000",borderRadius:8}}>
              <div style={{width:38,height:38,borderRadius:19,background:"#000",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontFamily:BD,fontWeight:700,flexShrink:0}}>F</div>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontFamily:DP,color:C.dk,fontWeight:600}}>Importar pedido de Faire</div>
                <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginTop:2}}>Registra aquí los pedidos que llegan por Faire. Faire ya cobró al cliente.</div>
              </div>
            </div>

            {/* FAIRE REF + DATE */}
            <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:14,marginBottom:14}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div>
                  <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:4}}>Referencia Faire *</div>
                  <input value={ed.faireRef||""} onChange={e => setEd(p => ({...p, faireRef:e.target.value}))} placeholder="F-12345 o BO-12345" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.wh,color:C.dk,boxSizing:"border-box"}} />
                </div>
                <div>
                  <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:4}}>Fecha del pedido</div>
                  <input type="date" value={ed.faireDate||""} onChange={e => setEd(p => ({...p, faireDate:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.wh,color:C.dk,boxSizing:"border-box"}} />
                </div>
              </div>
            </div>

            {/* TIENDA */}
            <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:14,marginBottom:14}}>
              <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:8}}>🏪 Tienda compradora</div>
              <input value={ed.client||""} onChange={e => setEd(p => ({...p, client:e.target.value}))} placeholder="Nombre de la tienda (escribe nuevo o elige existente)" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.wh,color:C.dk,boxSizing:"border-box",marginBottom:8}} />
              {ed.client && (() => {
                const matches = clients.filter(c => c.name.toLowerCase().includes(ed.client.toLowerCase())).slice(0,5);
                return matches.length > 0 ? <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  <div style={{fontSize:9,fontFamily:BD,color:C.gr2,fontWeight:600}}>Coincidencias (click para usar):</div>
                  {matches.map(c => <button key={c.id} onClick={() => setEd(p => ({...p, client:c.name, _matchedClient:c.id}))} style={{padding:"5px 10px",background:ed._matchedClient===c.id?CL.gn+"15":C.wh,border:"1px solid "+(ed._matchedClient===c.id?CL.gn:C.ln),borderRadius:3,fontSize:11,fontFamily:BD,color:C.dk,cursor:"pointer",textAlign:"left"}}>{c.name} · {c.city||"—"} · {c.channel}</button>)}
                </div> : <div style={{fontSize:10,fontFamily:BD,color:"#f0a020",padding:"6px 10px",background:"#fff8e6",borderRadius:3}}>⚠️ Tienda no existe. Se creará nueva como canal "Faire" (sin acceso a la plataforma).</div>;
              })()}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:8}}>
                <input value={ed.faireCity||""} onChange={e => setEd(p => ({...p, faireCity:e.target.value}))} placeholder="Ciudad (opcional)" style={{width:"100%",padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} />
                <input value={ed.faireCountry||""} onChange={e => setEd(p => ({...p, faireCountry:e.target.value}))} placeholder="País (FR, ES, DE...)" style={{width:"100%",padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} />
              </div>
            </div>

            {/* PRODUCTOS */}
            <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:14,marginBottom:14}}>
              <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:8}}>🕶 Productos del pedido Faire</div>
              <input value={ed._prSearch||""} onChange={e => setEd(p => ({...p, _prSearch: e.target.value}))} placeholder="🔍 Buscar modelo, color, SKU..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.wh,color:C.dk,boxSizing:"border-box",marginBottom:8}} />
              <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
                <select id="faireProd" style={{flex:"1 1 200px",padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk}}>
                  {products.filter(p => !ed._prSearch || p.model.toLowerCase().includes(ed._prSearch.toLowerCase()) || p.color.toLowerCase().includes(ed._prSearch.toLowerCase()) || (p.sku||"").toLowerCase().includes(ed._prSearch.toLowerCase())).map(p => <option key={p.id} value={p.id}>{p.model} - {p.color} [{p.col}] (stock: {p.stock})</option>)}
                </select>
                <input id="faireQty" type="number" defaultValue="2" min="1" placeholder="Uds" style={{width:60,padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,textAlign:"center"}} />
                <Btn small onClick={() => { const sel = document.getElementById("faireProd"); const qi = document.getElementById("faireQty"); const p = products.find(x => String(x.id) === String(sel.value)); if(p) setEd(prev => ({...prev, lines:[...(prev.lines||[]), {model:p.model, color:p.color, sku:p.sku, qty:parseInt(qi.value)||2, price:0, col:p.col}]})); }}>+ Añadir</Btn>
              </div>
              {(ed.lines||[]).length > 0 && <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:4,overflow:"hidden"}}>
                {(ed.lines||[]).map((l, i) => <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",borderBottom:"1px solid "+C.bg2,fontSize:11,fontFamily:BD,flexWrap:"wrap"}}>
                  <span style={{fontWeight:600,color:C.dk,flex:"1 1 120px"}}>{l.model}</span>
                  <span style={{color:C.gr,fontSize:10}}>{l.color}</span>
                  <button onClick={() => setEd(prev => ({...prev, lines: prev.lines.map((x,j) => j===i ? {...x, qty: Math.max(1, x.qty-1)} : x)}))} style={{width:22,height:22,background:C.bg,border:"1px solid "+C.ln,borderRadius:2,cursor:"pointer",fontSize:11,fontFamily:BD,color:C.dk}}>-</button>
                  <span style={{fontWeight:600,minWidth:24,textAlign:"center"}}>{l.qty}</span>
                  <button onClick={() => setEd(prev => ({...prev, lines: prev.lines.map((x,j) => j===i ? {...x, qty: x.qty+1} : x)}))} style={{width:22,height:22,background:C.bg,border:"1px solid "+C.ln,borderRadius:2,cursor:"pointer",fontSize:11,fontFamily:BD,color:C.dk}}>+</button>
                  <button onClick={() => setEd(prev => ({...prev, lines: prev.lines.filter((_, j) => j !== i)}))} style={{background:"none",border:"none",color:C.rd,cursor:"pointer",fontSize:14}}>×</button>
                </div>)}
              </div>}
              <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:8,padding:"6px 10px",background:"#fafafa",border:"1px solid "+C.ln,borderRadius:4}}>💡 Los precios se calculan automáticamente con el subtotal bruto que pongas abajo, prorrateado por unidad.</div>
            </div>

            {/* DINERO */}
            <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:14,marginBottom:14}}>
              <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:8}}>💰 Importes</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <div>
                  <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:4}}>Subtotal BRUTO (lo que ve la tienda en Faire)</div>
                  <input type="number" step="0.01" value={ed.subtotal||""} onChange={e => setEd(p => ({...p, subtotal:parseFloat(e.target.value)||0}))} placeholder="0.00" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:13,background:C.wh,color:C.dk,boxSizing:"border-box"}} />
                </div>
                <div>
                  <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:4}}>Comisión Faire (%)</div>
                  <select value={ed.faireCommission!==undefined?ed.faireCommission:17} onChange={e => setEd(p => ({...p, faireCommission:parseFloat(e.target.value)}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:13,background:C.wh,color:C.dk,boxSizing:"border-box"}}>
                    <option value={17}>17% (cliente nuevo)</option>
                    <option value={10}>10% (cliente recurrente)</option>
                    <option value={0}>0% (sin comisión)</option>
                    <option value="custom">Otro %...</option>
                  </select>
                  {ed.faireCommission === "custom" && <input type="number" step="0.01" placeholder="ej: 12.5" onChange={e => setEd(p => ({...p, faireCommission:parseFloat(e.target.value)||0}))} style={{width:"100%",marginTop:6,padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.wh,color:C.dk,boxSizing:"border-box"}} />}
                </div>
              </div>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:4}}>🎁 Promo Faire aplicada (opcional)</div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <select value={ed.fairePromoType||"none"} onChange={e => setEd(p => ({...p, fairePromoType:e.target.value, fairePromo:e.target.value==="none"?0:p.fairePromo||0}))} style={{padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.wh,color:C.dk}}>
                    <option value="none">Sin promo</option>
                    <option value="pct">% Descuento</option>
                    <option value="abs">€ Importe fijo</option>
                  </select>
                  {ed.fairePromoType && ed.fairePromoType !== "none" && <>
                    <input type="number" step="0.01" value={ed.fairePromo||""} onChange={e => setEd(p => ({...p, fairePromo:parseFloat(e.target.value)||0}))} placeholder={ed.fairePromoType==="pct"?"10":"5"} style={{width:80,padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.wh,color:C.dk,boxSizing:"border-box"}} />
                    <span style={{fontSize:12,fontFamily:BD,color:C.gr}}>{ed.fairePromoType === "pct" ? "%" : "€"}</span>
                  </>}
                  <input value={ed.fairePromoCode||""} onChange={e => setEd(p => ({...p, fairePromoCode:e.target.value}))} placeholder="Código (ej: SUMMER10)" style={{flex:1,padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.wh,color:C.dk,boxSizing:"border-box"}} />
                </div>
              </div>
              {(() => {
                const subtotalBruto = parseFloat(ed.subtotal)||0;
                const promoDisc = ed.fairePromoType === "pct" ? subtotalBruto * ((ed.fairePromo||0)/100) : ed.fairePromoType === "abs" ? (ed.fairePromo||0) : 0;
                const afterPromo = Math.max(0, subtotalBruto - promoDisc);
                const commPct = typeof ed.faireCommission === "number" ? ed.faireCommission : 17;
                const commAmount = afterPromo * (commPct/100);
                const net = afterPromo - commAmount;
                return <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:4,padding:"10px 12px",fontSize:11,fontFamily:BD,lineHeight:1.7}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.gr}}>Subtotal bruto</span><span style={{color:C.dk,fontWeight:600}}>{fmt(subtotalBruto)} €</span></div>
                  {promoDisc > 0 && <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#8e44ad"}}>Promo {ed.fairePromoCode?"("+ed.fairePromoCode+")":""} {ed.fairePromoType==="pct"?"-"+ed.fairePromo+"%":""}</span><span style={{color:"#8e44ad",fontWeight:600}}>-{fmt(promoDisc)} €</span></div>}
                  {promoDisc > 0 && <div style={{display:"flex",justifyContent:"space-between",borderTop:"1px dashed "+C.ln,paddingTop:4,marginTop:4}}><span style={{color:C.gr,fontSize:10}}>Subtotal tras promo</span><span style={{color:C.dk,fontWeight:600,fontSize:10}}>{fmt(afterPromo)} €</span></div>}
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#ff6b35"}}>Comisión Faire ({commPct}%)</span><span style={{color:"#ff6b35",fontWeight:600}}>-{fmt(commAmount)} €</span></div>
                  <div style={{display:"flex",justifyContent:"space-between",borderTop:"1px solid "+C.ln,paddingTop:6,marginTop:6}}><span style={{color:C.dk,fontWeight:700}}>NETO para Minuë</span><span style={{color:CL.gn,fontWeight:700,fontSize:14}}>{fmt(net)} €</span></div>
                </div>;
              })()}
            </div>

            {/* NOTAS */}
            <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:14,marginBottom:14}}>
              <div style={{fontSize:10,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:6}}>📝 Notas (opcional)</div>
              <textarea value={ed.clientNotes||""} onChange={e => setEd(p => ({...p, clientNotes:e.target.value}))} rows={2} placeholder="Dirección envío especial, observaciones..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
            </div>

            <div style={{padding:"10px 14px",background:"#fff8e6",border:"1px solid #f0a020"+"30",borderRadius:6,marginBottom:14,fontSize:11,fontFamily:BD,color:C.dk,lineHeight:1.5}}>
              ⏱ <strong>Recuerda:</strong> Faire paga a 60 días desde la fecha del pedido. Al enviar el pedido, añade el tracking <strong>también en el panel de Faire</strong> para que liberen tu pago.
            </div>

            <Btn disabled={!ed.faireRef || !ed.client || !(ed.lines||[]).length || !ed.subtotal} onClick={async () => {
              const subtotalBruto = parseFloat(ed.subtotal)||0;
              const promoDisc = ed.fairePromoType === "pct" ? subtotalBruto * ((ed.fairePromo||0)/100) : ed.fairePromoType === "abs" ? (ed.fairePromo||0) : 0;
              const afterPromo = Math.max(0, subtotalBruto - promoDisc);
              const commPct = typeof ed.faireCommission === "number" ? ed.faireCommission : 17;
              const commAmount = afterPromo * (commPct/100);
              const net = afterPromo - commAmount;
              const totalUnits = (ed.lines||[]).reduce((s,l) => s + l.qty, 0);
              // Find or create client
              let clientName = ed.client;
              const existing = clients.find(c => c.name.toLowerCase() === ed.client.toLowerCase());
              if (!existing) {
                const tempId = Date.now();
                const newCl = {id:tempId, name:ed.client, contact:"", city:ed.faireCity||"", country:ed.faireCountry||"", channel:"Faire", customPrice:0, priceEssential:0, priceIcons:0, priceAcetato:0, earlyPay:false, status:"faire-only", notes:"Cliente Faire — no tiene acceso a plataforma", orders:0, total:0, phone:"", companyEmail:""};
                setClients(p => [...p, newCl]);
                clientName = newCl.name;
                if (dbReady) { try { const {data} = await supabase.from("clients").insert({name:newCl.name, city:newCl.city, country:newCl.country, channel:"Faire", status:"faire-only", notes:newCl.notes}).select().single(); if(data?.id) setClients(p => p.map(c => c.id === tempId ? {...c, id: data.id} : c)); } catch(e){ console.log("DB error:", e); } }
              }
              const orderId = "#MN-"+String(orders.length+1).padStart(4,"0");
              // Per-line price proportionally on the after-promo amount
              const totalQty = totalUnits || 1;
              const pricePerUnit = afterPromo / totalQty;
              const lns = (ed.lines||[]).map(l => ({...l, price: pricePerUnit}));
              const promoNote = promoDisc > 0 ? "Promo "+(ed.fairePromoCode||"")+" "+(ed.fairePromoType==="pct"?ed.fairePromo+"%":fmt(ed.fairePromo)+"€")+" (-"+fmt(promoDisc)+" €)" : "";
              const newOrder = {id:orderId, client:clientName, dist:"Faire", date:new Date(ed.faireDate).toLocaleDateString("fr-FR"), items:totalUnits, total:net, totalBruto:subtotalBruto, faireCommission:commPct, faireCommAmount:commAmount, faireRef:ed.faireRef, fairePromoType:ed.fairePromoType||"none", fairePromo:ed.fairePromo||0, fairePromoCode:ed.fairePromoCode||"", fairePromoDisc:promoDisc, comm:0, status:"confirmed", pay:"paid", payMethod:"faire", track:"", lines:lns, clientNotes:[ed.clientNotes||"", promoNote].filter(Boolean).join(" · "), isFaire:true};
              setOrders(p => [newOrder, ...p]);
              logOrderChange(orderId, "Pedido Faire importado", "Ref: "+ed.faireRef+" · Bruto: "+fmt(subtotalBruto)+" €"+(promoDisc>0?" · Promo: -"+fmt(promoDisc)+" €":"")+" · Comisión: "+commPct+"% · NETO: "+fmt(net)+" €");
              if (dbReady) { try { const {data:co} = await supabase.from("orders").insert({order_number:orderId, client_name:clientName, distributor:"Faire", total:net, items_count:totalUnits, status:"confirmed", payment_status:"paid", payment_method:"faire", client_notes:[ed.clientNotes||"", promoNote].filter(Boolean).join(" · "), faire_ref:ed.faireRef, faire_commission:commPct, total_bruto:subtotalBruto}).select().single(); if(co) { for (const l of lns) { await supabase.from("order_lines").insert({order_id:co.id, model:l.model, color:l.color, sku:l.sku, quantity:l.qty, unit_price:l.price, collection:l.col||""}); } } } catch(e){} }
              setModal(null);
            }} style={{width:"100%",background:"#000",borderColor:"#000",color:"#fff"}}>
              <span style={{display:"inline-flex",alignItems:"center",gap:8}}>
                <span style={{width:18,height:18,borderRadius:9,background:"#fff",color:"#000",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,fontFamily:BD,fontWeight:700}}>F</span>
                Importar pedido Faire ({(() => { const s=parseFloat(ed.subtotal)||0; const pd=ed.fairePromoType==="pct"?s*((ed.fairePromo||0)/100):ed.fairePromoType==="abs"?(ed.fairePromo||0):0; const ap=Math.max(0,s-pd); const cp=typeof ed.faireCommission==="number"?ed.faireCommission:17; return fmt(ap*(1-cp/100)); })()} € neto)
              </span>
            </Btn>
          </>}

          {/* EDIT ORDER */}
          {modal === "editOrd" && <>
            <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:16,flexWrap:"wrap"}}>
              <span style={{fontSize:24,fontFamily:DP,color:C.dk,fontWeight:600,letterSpacing:1}}>{ed.id}</span>
              <div style={{display:"flex",flexDirection:"column",gap:2}}>
                <span style={{fontSize:13,fontFamily:BD,color:C.dk,fontWeight:600}}>{ed.client}</span>
                <span style={{fontSize:10,fontFamily:BD,color:C.gr}}>{ed.date} · {ed.dist}</span>
              </div>
              <span style={{flex:1}} />
              <Badge l={ed.dist} c={ed.dist==="Agent Sud"?C.bl:ed.dist==="Faire"?"#000":C.gn} />
            </div>
            {/* FAIRE BANNER */}
            {ed.dist === "Faire" && <div style={{background:"#fafafa",border:"2px solid #000",borderRadius:8,padding:"14px 16px",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                <div style={{width:34,height:34,borderRadius:17,background:"#000",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontFamily:BD,fontWeight:700,flexShrink:0}}>F</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontFamily:BD,fontWeight:700,color:"#000"}}>Pedido FAIRE — Ref: {ed.faireRef||"—"}</div>
                  <div style={{fontSize:11,fontFamily:BD,color:C.dk,marginTop:6,lineHeight:1.7}}>
                    <div>Bruto: <strong>{fmt(ed.totalBruto||ed.total)} €</strong></div>
                    {ed.fairePromoDisc > 0 && <div style={{color:"#8e44ad"}}>Promo {ed.fairePromoCode?"("+ed.fairePromoCode+")":""}: <strong>-{fmt(ed.fairePromoDisc)} €</strong></div>}
                    <div>Comisión Faire ({ed.faireCommission||17}%): <strong style={{color:"#666"}}>-{fmt(ed.faireCommAmount||0)} €</strong></div>
                    <div style={{borderTop:"1px solid "+C.ln,paddingTop:4,marginTop:4}}>Neto Minuë: <strong style={{color:CL.gn,fontSize:13}}>{fmt(ed.total)} €</strong></div>
                  </div>
                  {(ed.status === "preparing" || ed.status === "confirmed") && <div style={{fontSize:11,fontFamily:BD,color:"#000",marginTop:10,padding:"8px 12px",background:"#fff8e6",border:"1px solid #f0a020"+"50",borderRadius:4,fontWeight:600}}>⚠️ Al enviar, añade el tracking <strong>también en el panel de Faire</strong> para que liberen el pago a 60 días.</div>}
                </div>
              </div>
            </div>}
            {ed.lines && ed.lines.length > 0 && <>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:6,fontWeight:500}}>{t("detailArt")}</div>
              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:4,marginBottom:14,overflow:"hidden",maxHeight:220,overflowY:"auto"}}>
                {ed.lines.map((l, i) => (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:4,padding:"6px 12px",borderBottom:"1px solid "+C.bg2,fontSize:11,fontFamily:BD}}>
                    <span style={{fontWeight:600,color:C.dk,flex:1}}>{l.model}</span>
                    <span style={{color:C.gr}}>{l.color}</span>
                    <button onClick={() => {
                      const nl = ed.lines.map((x,j) => j===i ? {...x, qty: Math.max(1, x.qty-1)} : x);
                      const ni = nl.reduce((s,x)=>s+x.qty,0); const nt = nl.reduce((s,x)=>s+x.price*x.qty,0);
                      setEd(p => ({...p, lines:nl, items:ni, total:nt}));
                    }} style={{width:20,height:20,background:C.bg,border:"1px solid "+C.ln,borderRadius:2,cursor:"pointer",fontSize:11,fontFamily:BD,color:C.dk,padding:0}}>-</button>
                    <span style={{fontWeight:600,minWidth:24,textAlign:"center"}}>{l.qty}</span>
                    <button onClick={() => {
                      const nl = ed.lines.map((x,j) => j===i ? {...x, qty: x.qty+1} : x);
                      const ni = nl.reduce((s,x)=>s+x.qty,0); const nt = nl.reduce((s,x)=>s+x.price*x.qty,0);
                      setEd(p => ({...p, lines:nl, items:ni, total:nt}));
                    }} style={{width:20,height:20,background:C.bg,border:"1px solid "+C.ln,borderRadius:2,cursor:"pointer",fontSize:11,fontFamily:BD,color:C.dk,padding:0}}>+</button>
                    <span style={{fontWeight:600,minWidth:50,textAlign:"right"}}>{fmt(l.price * l.qty)} €</span>
                    <button onClick={() => {
                      const removed = ed.lines[i];
                      const newLines = ed.lines.filter((_, j) => j !== i);
                      const newItems = newLines.reduce((s, x) => s + x.qty, 0);
                      const newTotal = newLines.reduce((s, x) => s + x.price * x.qty, 0);
                      const note = (ed.clientNotes ? ed.clientNotes + "\n" : "") + removed.model + " " + removed.color + " (x" + removed.qty + ") " + t("artSupprime");
                      setEd(p => ({...p, lines: newLines, items: newItems, total: newTotal, clientNotes: note}));
                    }} style={{background:"none",border:"none",color:C.rd,cursor:"pointer",fontSize:9,fontFamily:BD,fontWeight:600,padding:"2px 4px",flexShrink:0}}>✕</button>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",padding:"7px 12px",background:C.bg,fontFamily:BD,fontSize:11,fontWeight:600}}>
                  <span>{ed.items || ed.lines.reduce((s,x)=>s+x.qty,0)} {t("unites")}</span>
                  <span>{fmt(ed.total || ed.lines.reduce((s,x)=>s+x.price*x.qty,0))} €</span>
                </div>
              </div>
            </>}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("statutCmd")}</div>
                <select value={ed.status} onChange={e => setEd(p => ({...p, status: e.target.value}))} style={{width:"100%",padding:10,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:13,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  {Object.keys(SL).map(k => <option key={k} value={k}>{SL[k]}</option>)}
                </select>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("statutPay")}</div>
                <select value={ed.pay} onChange={e => setEd(p => ({...p, pay: e.target.value}))} style={{width:"100%",padding:10,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:13,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  {Object.keys(PL).map(k => <option key={k} value={k}>{PL[k]}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("tracking")}</div>
                <input value={ed.track || ""} onChange={e => setEd(p => ({...p, track: e.target.value}))} placeholder="ABC123456" style={{width:"100%",padding:10,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:13,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("transporteur")}</div>
                <input value={ed.carrier || ""} onChange={e => setEd(p => ({...p, carrier: e.target.value}))} placeholder="DHL, GLS, SEUR..." style={{width:"100%",padding:10,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:13,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("urlSuivi")}</div>
              <input value={ed.trackUrl || ""} onChange={e => setEd(p => ({...p, trackUrl: e.target.value}))} placeholder="https://..." style={{width:"100%",padding:10,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:13,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("fraisEnvoi")} {(ed.items||0) >= 20 && <span style={{color:C.gn,fontSize:9,fontWeight:600}}>({t("envoiInclus")})</span>}</div>
              <input type="number" step="0.01" value={ed.shippingCost === -1 ? "" : (ed.shippingCost || 0)} onChange={e => setEd(p => ({...p, shippingCost: parseFloat(e.target.value) || 0}))} placeholder="0.00" style={{width:"100%",padding:10,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:13,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4,display:"flex",alignItems:"center",gap:6}}>🔒 {t("notesInt")} <span style={{fontSize:9,color:C.rd,background:C.rd+"10",padding:"1px 6px",borderRadius:3,fontWeight:700}}>PRIVADO — solo admin/equipo</span></div>
              <textarea value={ed.notes || ""} onChange={e => setEd(p => ({...p, notes: e.target.value}))} rows={3} placeholder="Notas privadas internas, no visibles para cliente ni distribuidor..." style={{width:"100%",padding:10,border:"1px solid "+C.rd+"30",borderRadius:3,fontFamily:BD,fontSize:12,background:"#fef5f5",color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("notesClient")} <span style={{color:C.gr2,fontSize:9}}>({t("client")} {t("voirPlus").toLowerCase()})</span></div>
              <textarea value={ed.clientNotes || ""} onChange={e => setEd(p => ({...p, clientNotes: e.target.value}))} rows={2} placeholder="..." style={{width:"100%",padding:10,border:"1px solid "+C.bl+"40",borderRadius:3,fontFamily:BD,fontSize:12,background:"#f0f6fa",color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
            </div>

            {/* ═══ PAYMENT MANAGEMENT ═══ */}
            <div style={{marginBottom:14,padding:"14px 16px",background:C.bg,border:"1px solid "+C.ln,borderRadius:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontSize:13,fontFamily:BD,fontWeight:700,color:C.dk}}>💳 Gestión de pago</div>
                <Badge l={PL[ed.pay]} c={PC[ed.pay]} />
              </div>
              <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:6}}>Forma de pago</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
                {[["card","💳 Tarjeta"],["sepa","🏦 SEPA"],["transfer","💸 Transferencia"],["deferred","📅 Aplazado"],["split","➗ Fraccionado"]].map(([v,l]) => {
                  const isSel = (ed.payMethod||"transfer") === v;
                  return <button key={v} onClick={() => setEd(p => ({...p, payMethod:v}))} style={{padding:"6px 12px",background:isSel?C.dk:C.wh,color:isSel?C.bg:C.gr,border:"1px solid "+(isSel?C.dk:C.ln),borderRadius:20,cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:500}}>{l}</button>;
                })}
              </div>

              {ed.payMethod === "card" && <div style={{padding:"12px 14px",background:"#f0f0ff",border:"1px solid #635bff20",borderRadius:6,marginBottom:10}}>
                <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600,marginBottom:6}}>Stripe Payment Link</div>
                <div style={{fontSize:10,fontFamily:BD,color:C.gr,lineHeight:1.5,marginBottom:10}}>1. Click el botón · 2. Crea Payment Link de {fmt(ed.total)} € · 3. Pega el link aquí</div>
                <a href="https://dashboard.stripe.com/payment-links/create" target="_blank" rel="noreferrer" style={{display:"inline-block",padding:"7px 14px",background:"#635bff",color:"#fff",borderRadius:5,fontSize:11,fontFamily:BD,fontWeight:600,textDecoration:"none",marginBottom:10}}>→ Generar en Stripe ({fmt(ed.total)} €)</a>
                <input value={ed.paymentLink||""} onChange={e => setEd(p => ({...p, paymentLink:e.target.value}))} placeholder="https://buy.stripe.com/..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} />
                {ed.paymentLink && <a href={ed.paymentLink} target="_blank" rel="noreferrer" style={{display:"block",marginTop:8,fontSize:10,fontFamily:BD,color:C.bl}}>🔗 Ver link generado</a>}
              </div>}

              {(ed.payMethod === "sepa" || ed.payMethod === "transfer") && <div style={{padding:"12px 14px",background:C.wh,border:"1px solid "+C.ln,borderRadius:6,marginBottom:10}}>
                <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600,marginBottom:8}}>Datos para {ed.payMethod === "sepa" ? "SEPA Direct Debit" : "transferencia"}</div>
                <div style={{fontSize:11,color:C.dk,lineHeight:1.8,fontFamily:"monospace",background:C.bg,padding:"8px 10px",borderRadius:4}}>
                  <div><span style={{color:C.gr}}>Titular:</span> Minuë Opticians (Alejandro Carrasco Díaz)</div>
                  <div><span style={{color:C.gr}}>NIF:</span> ES77843808D</div>
                  <div><span style={{color:C.gr}}>IBAN:</span> ES11 2100 8447 6202 0010 9299</div>
                  <div><span style={{color:C.gr}}>BIC:</span> CAIXESBBXXX</div>
                  <div><span style={{color:C.gr}}>Concepto:</span> {ed.id}</div>
                  <div><span style={{color:C.gr}}>Importe:</span> {fmt(ed.total)} €</div>
                </div>
                <button onClick={() => { const txt = "Pago pedido "+ed.id+"\nTitular: Minuë Opticians\nNIF: ES77843808D\nIBAN: ES11 2100 8447 6202 0010 9299\nBIC: CAIXESBBXXX\nConcepto: "+ed.id+"\nImporte: "+fmt(ed.total)+" €"; navigator.clipboard.writeText(txt); toast("Datos copiados al portapapeles"); }} style={{marginTop:8,padding:"6px 12px",background:C.dk,color:C.bg,border:"none",borderRadius:4,fontSize:10,fontFamily:BD,cursor:"pointer",fontWeight:500}}>📋 Copiar datos</button>
              </div>}

              {ed.payMethod === "deferred" && <div style={{padding:"12px 14px",background:"#fff8e6",border:"1px solid #f0a02030",borderRadius:6,marginBottom:10}}>
                <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600,marginBottom:8}}>Pago aplazado</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>Vencimiento</div><input type="date" value={ed.payDueDate||""} onChange={e => setEd(p => ({...p, payDueDate:e.target.value}))} style={{width:"100%",padding:7,border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} /></div>
                  <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>Recordar X días antes</div><input type="number" value={ed.payReminderDays||7} onChange={e => setEd(p => ({...p, payReminderDays:parseInt(e.target.value)||7}))} style={{width:"100%",padding:7,border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} /></div>
                </div>
              </div>}

              {ed.payMethod === "split" && <div style={{padding:"12px 14px",background:"#f3eef9",border:"1px solid #8e44ad30",borderRadius:6,marginBottom:10}}>
                <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600,marginBottom:8}}>Pago fraccionado (50/50 por defecto)</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div>
                    <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>1er pago</div>
                    <input type="number" step="0.01" value={ed.paySplit1Amount||(ed.total/2).toFixed(2)} onChange={e => setEd(p => ({...p, paySplit1Amount:parseFloat(e.target.value)||0}))} style={{width:"100%",padding:7,border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box",marginBottom:4}} />
                    <input type="date" value={ed.paySplit1Date||""} onChange={e => setEd(p => ({...p, paySplit1Date:e.target.value}))} style={{width:"100%",padding:7,border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} />
                    <label style={{display:"flex",alignItems:"center",gap:4,marginTop:6,fontSize:10,fontFamily:BD,color:C.gr,cursor:"pointer"}}><input type="checkbox" checked={ed.paySplit1Done||false} onChange={e => setEd(p => ({...p, paySplit1Done:e.target.checked}))} /> Cobrado</label>
                  </div>
                  <div>
                    <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>2º pago</div>
                    <input type="number" step="0.01" value={ed.paySplit2Amount||(ed.total/2).toFixed(2)} onChange={e => setEd(p => ({...p, paySplit2Amount:parseFloat(e.target.value)||0}))} style={{width:"100%",padding:7,border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box",marginBottom:4}} />
                    <input type="date" value={ed.paySplit2Date||""} onChange={e => setEd(p => ({...p, paySplit2Date:e.target.value}))} style={{width:"100%",padding:7,border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} />
                    <label style={{display:"flex",alignItems:"center",gap:4,marginTop:6,fontSize:10,fontFamily:BD,color:C.gr,cursor:"pointer"}}><input type="checkbox" checked={ed.paySplit2Done||false} onChange={e => setEd(p => ({...p, paySplit2Done:e.target.checked}))} /> Cobrado</label>
                  </div>
                </div>
              </div>}
            </div>

            <div style={{display:"flex",gap:8}}>
              <Btn onClick={() => { const updated = {...orders[ed.idx], status:ed.status, pay:ed.pay, track:ed.track, carrier:ed.carrier, trackUrl:ed.trackUrl, notes:ed.notes, clientNotes:ed.clientNotes, lines:ed.lines, items:ed.items, total:ed.total, shippingCost:ed.shippingCost, comm:ed.dist!=="Direct"&&ed.dist!=="Faire"?ed.total*0.15:0, payMethod:ed.payMethod, paymentLink:ed.paymentLink, payDueDate:ed.payDueDate, payReminderDays:ed.payReminderDays, paySplit1Amount:ed.paySplit1Amount, paySplit1Date:ed.paySplit1Date, paySplit1Done:ed.paySplit1Done, paySplit2Amount:ed.paySplit2Amount, paySplit2Date:ed.paySplit2Date, paySplit2Done:ed.paySplit2Done}; setOrders(p => p.map((o, i) => i === ed.idx ? updated : o)); dbUpdateOrder(updated); setModal(null); }} style={{flex:1}}>{t("enregistrer")}</Btn>
              <Btn ghost onClick={() => askConfirm(t("confirmarEliminar"), () => { const o = orders[ed.idx]; setOrders(p => p.filter((_, i) => i !== ed.idx)); dbDeleteOrder(o); toast(t("pedidoEliminado")); setModal(null); })} style={{color:C.rd,borderColor:C.rd}}>{t("eliminarCmd")}</Btn>
            </div>
            <Btn ghost onClick={() => downloadAlbaran(ed)} style={{width:"100%",marginTop:8}}>📄 {t("descargarAlbaran")}</Btn>
          </>}

          {/* VIEW ORDER (client / distributor read-only) */}
          {/* VIEW MODEL */}
          {modal === "viewModel" && ed.variants && <>
            <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:16}}>
              {(() => { const first = ed.variants.find(v => v.imageUrl) || ed.variants[0]; return first.imageUrl ? <img src={first.imageUrl} alt={ed.model} style={{width:80,height:80,objectFit:"contain",borderRadius:6,border:"1px solid "+C.ln}} /> : <div style={{width:80,height:80,borderRadius:6,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:DP,fontSize:18,color:C.ln,border:"1px solid "+C.ln}}>MINUË</div>; })()}
              <div>
                <div style={{fontSize:22,fontFamily:DP,color:C.dk,fontWeight:600}}>{ed.model}</div>
                <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginTop:4}}>{ed.variants[0].col} · {ed.variants.length} {t("couleurs")} · {ed.variants.reduce((s,v) => s+v.stock,0)} {t("stockDisponible")}</div>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:"50vh",overflowY:"auto"}}>
              {ed.variants.map(v => {
                const isAcetato = v.col === "Acetato";
                const price = isAcetato ? v.fixedPrice : (customPrice > 0 ? customPrice : essentialCount > 0 ? essentialUnitPrice : 26.90);
                const cq = getCardQty(v.id);
                return (
                  <div key={v.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:cart[v.id]>0?C.gn+"08":C.bg,border:"1px solid "+(cart[v.id]>0?C.gn+"30":C.ln),borderRadius:6}}>
                    <div style={{width:20,height:20,borderRadius:10,background:colorDot[v.color]||"#aaa",border:"2px solid #e0d8d0",flexShrink:0}} />
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontFamily:BD,color:C.dk,fontWeight:600}}>{v.color}</div>
                      <div style={{fontSize:10,fontFamily:BD,color:C.gr}}>{v.sku} · stock: {v.stock}</div>
                    </div>
                    {role !== "admin" && <button onClick={(e) => { e.stopPropagation(); setFavs(f => f.includes(v.id) ? f.filter(x => x!==v.id) : [...f, v.id]); }} style={{background:"none",border:"none",cursor:"pointer",padding:2}}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={favs.includes(v.id)?"#6b4c3b":"none"} stroke={favs.includes(v.id)?"#6b4c3b":"#ccc"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    </button>}
                    <span style={{fontSize:13,fontFamily:BD,color:C.dk,fontWeight:600,minWidth:55,textAlign:"right"}}>{fmt(price)} €</span>
                    {role !== "admin" && <>
                      <div style={{display:"flex",alignItems:"center",border:"1px solid "+C.ln,borderRadius:3,overflow:"hidden"}}>
                        <button onClick={() => setCardQty(v.id, cq-1)} style={{width:26,height:28,background:C.wh,border:"none",cursor:"pointer",fontSize:12,color:C.dk}}>-</button>
                        <span style={{minWidth:24,textAlign:"center",fontSize:12,fontFamily:BD,fontWeight:600}}>{cq}</span>
                        <button onClick={() => setCardQty(v.id, cq+1)} style={{width:26,height:28,background:C.wh,border:"none",cursor:"pointer",fontSize:12,color:C.dk}}>+</button>
                      </div>
                      <button onClick={() => addToCart(v.id, cq)} style={{padding:"6px 12px",background:C.dk,color:C.bg,border:"none",fontSize:10,cursor:"pointer",fontFamily:BD,borderRadius:3,fontWeight:500}}>+</button>
                    </>}
                    {v.stock === 0 && <span style={{fontSize:9,fontFamily:BD,color:"#fff",background:C.rd,padding:"2px 6px",borderRadius:3}}>{t("agotado")}</span>}
                  </div>
                );
              })}
            </div>
          </>}

          {modal === "viewOrd" && (() => {
            const canEdit = role === "distributor" && ed.status === "confirmed";
            const isPartial = ed.status === "partial";
            const hasQtyData = isPartial && ed.lines && ed.lines.some(l => (l.qtyReceived||0) > 0);
            const shippedQty = hasQtyData ? ed.lines.reduce((s,l) => s + (l.qtyReceived||0), 0) : 0;
            const pendingQty = isPartial ? ed.items - shippedQty : 0;
            const shippedLines = hasQtyData ? ed.lines.filter(l => (l.qtyReceived||0) > 0) : [];
            const pendingLines = hasQtyData ? ed.lines.filter(l => (l.qtyReceived||0) < l.qty) : [];
            return <>
            <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:6,flexWrap:"wrap"}}>
              <span style={{fontSize:24,fontFamily:DP,color:C.dk,fontWeight:600,letterSpacing:1}}>{ed.id}</span>
              <Badge l={SL[ed.status]} c={SC[ed.status]} />
              <Badge l={PL[ed.pay]} c={PC[ed.pay]} />
            </div>
            <div style={{fontSize:12,fontFamily:BD,color:C.gr,marginBottom:canEdit?8:16}}>{ed.client} · {ed.date} · {ed.dist}</div>
            {canEdit && <div style={{background:C.gn+"10",border:"1px solid "+C.gn+"30",borderRadius:6,padding:"8px 14px",marginBottom:14,fontSize:11,fontFamily:BD,color:C.gn,fontWeight:500}}>✏️ {t("cmdNonConfirmee")}</div>}

            {/* ORDER PROGRESS STEPPER */}
            {ed.status !== "cancelled" && (() => {
              const steps = [["confirmed","✓",t("confirme")],["preparing","📦",t("enPrepa")],["shipped","🚚",t("expedie")],["delivered","🏠",t("livre")]];
              const stepIdx = {confirmed:0, preparing:1, partial:2, shipped:2, delivered:3}[ed.status] ?? 0;
              return <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:12,padding:"18px 16px 14px",marginBottom:16}}>
                <div style={{display:"flex",alignItems:"flex-start",position:"relative"}}>
                  <div style={{position:"absolute",top:15,left:"12%",right:"12%",height:3,background:C.ln,borderRadius:2}} />
                  <div style={{position:"absolute",top:15,left:"12%",width:(stepIdx/(steps.length-1)*76)+"%",height:3,background:"linear-gradient(90deg,"+CL.gn+","+CL.gn+"cc)",borderRadius:2,transition:"width 0.5s"}} />
                  {steps.map(([key, icon, label], i) => {
                    const done = i <= stepIdx;
                    const current = i === stepIdx;
                    return <div key={key} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",position:"relative",zIndex:1}}>
                      <div style={{width:32,height:32,borderRadius:16,background:done?CL.gn:C.wh,border:"2.5px solid "+(done?CL.gn:C.ln),display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,boxShadow:current?"0 0 0 5px "+CL.gn+"20":"none",transition:"all 0.3s"}}>{done && i < stepIdx ? <span style={{color:"#fff",fontWeight:700,fontSize:14}}>✓</span> : <span style={{filter:done?"none":"grayscale(1) opacity(0.4)"}}>{icon}</span>}</div>
                      <span style={{fontSize:9,fontFamily:BD,fontWeight:current?700:500,color:done?CL.gn:C.gr2,marginTop:6,textAlign:"center",letterSpacing:0.3}}>{label}</span>
                    </div>;
                  })}
                </div>
                {(ed.status === "shipped" || ed.status === "partial") && ed.track && <div style={{marginTop:14,paddingTop:14,borderTop:"1px dashed "+C.ln}}>
                  <a href={ed.trackUrl || ("https://www.google.com/search?q="+encodeURIComponent((ed.carrier||"")+" tracking "+ed.track))} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:C.dk,borderRadius:10,textDecoration:"none",cursor:"pointer"}}>
                    <span style={{fontSize:22}}>📍</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontFamily:BD,fontWeight:700,color:C.bg}}>{t("seguirEnvio")}{ed.carrier ? " · "+ed.carrier : ""}</div>
                      <div style={{fontSize:11,fontFamily:"monospace",color:C.bg+"99",marginTop:2}}>{ed.track}</div>
                    </div>
                    <span style={{fontSize:16,color:C.bg}}>→</span>
                  </a>
                </div>}
              </div>;
            })()}

            {/* PARTIAL PROGRESS - only with qtyReceived data */}
            {isPartial && hasQtyData && <div style={{background:C.yl+"10",border:"1px solid "+C.yl+"30",borderRadius:8,padding:"14px 16px",marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700}}>{t("envioPartial")}</span>
                <span style={{fontSize:11,fontFamily:BD,color:C.gr}}>{shippedQty} / {ed.items} {t("unites")}</span>
              </div>
              <div style={{height:6,background:C.bg2,borderRadius:3,overflow:"hidden",marginBottom:10}}>
                <div style={{height:6,background:C.gn,borderRadius:3,width:Math.round(shippedQty/ed.items*100)+"%"}} />
              </div>
              <div style={{display:"flex",gap:12}}>
                <div style={{flex:1,background:C.gn+"10",borderRadius:6,padding:"8px 12px",textAlign:"center"}}>
                  <div style={{fontSize:18,fontFamily:BD,color:C.gn,fontWeight:700}}>{shippedQty}</div>
                  <div style={{fontSize:9,fontFamily:BD,color:C.gn}}>{t("enviado")}</div>
                </div>
                <div style={{flex:1,background:C.yl+"10",borderRadius:6,padding:"8px 12px",textAlign:"center"}}>
                  <div style={{fontSize:18,fontFamily:BD,color:C.yl,fontWeight:700}}>{pendingQty}</div>
                  <div style={{fontSize:9,fontFamily:BD,color:C.yl}}>{t("pendienteEnvio")}</div>
                </div>
              </div>
            </div>}

            {/* PARTIAL without qtyReceived data - show badge */}
            {isPartial && !hasQtyData && <div style={{background:C.yl+"10",border:"1px solid "+C.yl+"30",borderRadius:8,padding:"14px 16px",marginBottom:16}}>
              <div style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:4}}>{t("envioPartial")}</div>
              <div style={{fontSize:11,fontFamily:BD,color:C.gr,lineHeight:1.5}}>{ed.clientNotes || ed.notes || ""}</div>
            </div>}

            {/* SHIPPED ITEMS (partial with data) */}
            {isPartial && hasQtyData && shippedLines.length > 0 && <>
              <div style={{fontSize:11,fontFamily:BD,color:C.gn,fontWeight:700,marginBottom:6}}>✓ {t("enviado")} — {shippedQty} {t("unites")}</div>
              <div style={{background:C.wh,border:"1px solid "+C.gn+"30",borderRadius:4,marginBottom:14,overflow:"hidden"}}>
                {shippedLines.map((l, i) => (
                  <div key={"s"+i} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 12px",borderBottom:"1px solid "+C.bg2,fontSize:12,fontFamily:BD}}>
                    <span style={{width:6,height:6,borderRadius:3,background:C.gn,flexShrink:0}} />
                    <span style={{fontWeight:600,color:C.dk,flex:1}}>{l.model}</span>
                    <span style={{color:C.gr}}>{l.color}</span>
                    <span style={{fontWeight:600,minWidth:28,textAlign:"center"}}>x{l.qtyReceived||l.qty}</span>
                    <span style={{fontWeight:600,minWidth:55,textAlign:"right"}}>{fmt(l.price * (l.qtyReceived||l.qty))} €</span>
                  </div>
                ))}
              </div>
            </>}

            {/* PENDING ITEMS (partial with data) */}
            {isPartial && hasQtyData && pendingLines.length > 0 && <>
              <div style={{fontSize:11,fontFamily:BD,color:C.yl,fontWeight:700,marginBottom:6}}>⏳ {t("pendienteEnvio")} — {pendingQty} {t("unites")}</div>
              <div style={{background:C.wh,border:"1px solid "+C.yl+"30",borderRadius:4,marginBottom:14,overflow:"hidden"}}>
                {pendingLines.map((l, i) => { const pend = l.qty - (l.qtyReceived||0); return (
                  <div key={"p"+i} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 12px",borderBottom:"1px solid "+C.bg2,fontSize:12,fontFamily:BD,opacity:0.7}}>
                    <span style={{width:6,height:6,borderRadius:3,background:C.yl,flexShrink:0}} />
                    <span style={{fontWeight:600,color:C.dk,flex:1}}>{l.model}</span>
                    <span style={{color:C.gr}}>{l.color}</span>
                    <span style={{fontWeight:600,minWidth:28,textAlign:"center"}}>x{pend}</span>
                    <span style={{fontWeight:600,minWidth:55,textAlign:"right",color:C.gr}}>{fmt(l.price * pend)} €</span>
                  </div>
                ); })}
              </div>
            </>}

            {/* NORMAL LINES (non-partial OR partial without qty data) */}
            {(!isPartial || (isPartial && !hasQtyData)) && ed.lines && ed.lines.length > 0 && <>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:6,fontWeight:500}}>{t("detailArt")}</div>
              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:4,marginBottom:14,overflow:"hidden"}}>
                {ed.lines.map((l, i) => (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",borderBottom:"1px solid "+C.bg2,fontSize:12,fontFamily:BD}}>
                    <span style={{fontWeight:600,color:C.dk,flex:1}}>{l.model}</span>
                    <span style={{color:C.gr}}>{l.color}</span>
                    {canEdit ? <>
                      <button onClick={() => { const nl = [...ed.lines]; nl[i] = {...nl[i], qty: Math.max(1, nl[i].qty-1)}; const items = nl.reduce((s,x) => s+x.qty,0); const total = nl.reduce((s,x) => s+x.qty*x.price,0); setEd(p => ({...p, lines:nl, items, total})); }} style={{width:22,height:22,background:C.bg,border:"1px solid "+C.ln,borderRadius:3,cursor:"pointer",fontSize:11,color:C.dk,padding:0}}>-</button>
                      <span style={{fontWeight:600,minWidth:22,textAlign:"center"}}>{l.qty}</span>
                      <button onClick={() => { const nl = [...ed.lines]; nl[i] = {...nl[i], qty: nl[i].qty+1}; const items = nl.reduce((s,x) => s+x.qty,0); const total = nl.reduce((s,x) => s+x.qty*x.price,0); setEd(p => ({...p, lines:nl, items, total})); }} style={{width:22,height:22,background:C.bg,border:"1px solid "+C.ln,borderRadius:3,cursor:"pointer",fontSize:11,color:C.dk,padding:0}}>+</button>
                      <span style={{fontWeight:600,minWidth:55,textAlign:"right"}}>{fmt(l.price * l.qty)} €</span>
                      <button onClick={() => { const nl = ed.lines.filter((_,j) => j!==i); const items = nl.reduce((s,x) => s+x.qty,0); const total = nl.reduce((s,x) => s+x.qty*x.price,0); setEd(p => ({...p, lines:nl, items, total})); }} style={{background:"none",border:"none",color:C.rd,cursor:"pointer",fontSize:14,padding:"0 2px"}}>✕</button>
                    </> : <>
                      <span style={{fontWeight:600,minWidth:28,textAlign:"center"}}>x{l.qty}</span>
                      <span style={{fontWeight:600,minWidth:55,textAlign:"right"}}>{fmt(l.price * l.qty)} €</span>
                    </>}
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",padding:"10px 12px",background:C.bg,fontFamily:BD,fontSize:12,fontWeight:600}}>
                  <span>{ed.items} {t("unites")}</span>
                  <span>{fmt(ed.total)} €</span>
                </div>
              </div>
            </>}

            {/* TOTAL (partial with qty data) */}
            {isPartial && hasQtyData && <div style={{display:"flex",justifyContent:"space-between",padding:"10px 14px",background:C.bg,borderRadius:4,fontFamily:BD,fontSize:12,fontWeight:600,marginBottom:14}}>
              <span>{ed.items} {t("unites")}</span>
              <span>{fmt(ed.total)} €</span>
            </div>}
            {canEdit && <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("notesCmd")}</div>
              <textarea value={ed.clientNotes||""} onChange={e => setEd(p => ({...p, clientNotes:e.target.value}))} rows={2} placeholder={t("notesPlaceholder")} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
            </div>}
            {(ed.track || ed.carrier) && <div style={{marginBottom:12,padding:"12px 14px",background:C.bg,borderRadius:4,border:"1px solid "+C.ln}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:6}}>{t("tracking")}</div>
              <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                {ed.carrier && <span style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600,background:C.wh,padding:"3px 10px",borderRadius:3,border:"1px solid "+C.ln}}>{ed.carrier}</span>}
                {ed.track && <span style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:600,letterSpacing:0.5}}>{ed.track}</span>}
              </div>
              {ed.trackUrl && <a href={ed.trackUrl} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,marginTop:8,fontSize:11,fontFamily:BD,color:C.bl,textDecoration:"none",fontWeight:600,padding:"5px 12px",background:C.bl+"10",borderRadius:3}}>{t("suivreColis")} →</a>}
            </div>}
            {!canEdit && ed.clientNotes && <div style={{padding:"12px 14px",background:"#f0f6fa",borderRadius:4,border:"1px solid "+C.bl+"30"}}>
              <div style={{fontSize:10,fontFamily:BD,color:C.bl,fontWeight:600,marginBottom:4}}>{t("noteDuCmd")}</div>
              <div style={{fontSize:12,fontFamily:BD,color:C.dk,lineHeight:1.5,whiteSpace:"pre-line"}}>{ed.clientNotes}</div>
            </div>}

            {/* ═══ PAYMENT MANAGEMENT (admin + team only) ═══ */}
            {(role === "admin" || role === "team") && <div style={{marginTop:16,padding:"14px 16px",background:C.wh,border:"1px solid "+C.ln,borderRadius:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontSize:13,fontFamily:BD,fontWeight:700,color:C.dk}}>💳 Gestión de pago</div>
                <Badge l={PL[ed.pay]} c={PC[ed.pay]} />
              </div>
              <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:6}}>Forma de pago</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
                {[["card","💳 Tarjeta (Stripe)"],["sepa","🏦 SEPA"],["transfer","💸 Transferencia"],["deferred","📅 Aplazado"],["split","➗ Fraccionado"]].map(([v,l]) => {
                  const isSel = (ed.payMethod||"transfer") === v;
                  return <button key={v} onClick={() => setEd(p => ({...p, payMethod:v}))} style={{padding:"6px 12px",background:isSel?C.dk:"transparent",color:isSel?C.bg:C.gr,border:"1px solid "+(isSel?C.dk:C.ln),borderRadius:20,cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:500}}>{l}</button>;
                })}
              </div>

              {/* STRIPE CARD */}
              {ed.payMethod === "card" && <div style={{padding:"12px 14px",background:C.bl+"06",border:"1px solid "+C.bl+"20",borderRadius:6,marginBottom:10}}>
                <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600,marginBottom:6}}>Stripe Payment Link</div>
                <div style={{fontSize:10,fontFamily:BD,color:C.gr,lineHeight:1.5,marginBottom:10}}>1. Click el botón abajo · 2. En Stripe, crea un Payment Link con el importe {fmt(ed.total)} € · 3. Pega el link aquí y guárdalo</div>
                <a href="https://dashboard.stripe.com/payment-links/create" target="_blank" rel="noreferrer" style={{display:"inline-block",padding:"7px 14px",background:"#635bff",color:"#fff",borderRadius:5,fontSize:11,fontFamily:BD,fontWeight:600,textDecoration:"none",marginBottom:10}}>→ Generar en Stripe ({fmt(ed.total)} €)</a>
                <input value={ed.paymentLink||""} onChange={e => setEd(p => ({...p, paymentLink:e.target.value}))} placeholder="https://buy.stripe.com/..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                {ed.paymentLink && <a href={ed.paymentLink} target="_blank" rel="noreferrer" style={{display:"block",marginTop:8,fontSize:10,fontFamily:BD,color:C.bl}}>🔗 Ver link generado</a>}
              </div>}

              {/* SEPA / TRANSFER */}
              {(ed.payMethod === "sepa" || ed.payMethod === "transfer") && <div style={{padding:"12px 14px",background:C.bg,border:"1px solid "+C.ln,borderRadius:6,marginBottom:10}}>
                <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600,marginBottom:8}}>Datos para {ed.payMethod === "sepa" ? "SEPA Direct Debit" : "transferencia bancaria"}</div>
                <div style={{fontSize:11,fontFamily:BD,color:C.dk,lineHeight:1.8,fontFamily:"monospace",background:C.wh,padding:"8px 10px",borderRadius:4}}>
                  <div><span style={{color:C.gr}}>Titular:</span> Alejandro Carrasco Díaz / Minuë Opticians</div>
                  <div><span style={{color:C.gr}}>NIF:</span> ES77843808D</div>
                  <div><span style={{color:C.gr}}>IBAN:</span> ES11 2100 8447 6202 0010 9299</div>
                  <div><span style={{color:C.gr}}>BIC:</span> CAIXESBBXXX</div>
                  <div><span style={{color:C.gr}}>Banco:</span> CaixaBank</div>
                  <div><span style={{color:C.gr}}>Concepto:</span> {ed.id}</div>
                  <div><span style={{color:C.gr}}>Importe:</span> {fmt(ed.total)} €</div>
                </div>
                <button onClick={() => { const txt = "Pago pedido "+ed.id+"\nTitular: Minuë Opticians (Alejandro Carrasco Díaz)\nNIF: ES77843808D\nIBAN: ES11 2100 8447 6202 0010 9299\nBIC: CAIXESBBXXX\nBanco: CaixaBank\nConcepto: "+ed.id+"\nImporte: "+fmt(ed.total)+" €"; navigator.clipboard.writeText(txt); toast("Datos bancarios copiados"); }} style={{marginTop:8,padding:"6px 12px",background:C.dk,color:C.bg,border:"none",borderRadius:4,fontSize:10,fontFamily:BD,cursor:"pointer",fontWeight:500}}>📋 Copiar datos para enviar al cliente</button>
              </div>}

              {/* DEFERRED */}
              {ed.payMethod === "deferred" && <div style={{padding:"12px 14px",background:"#fff8e6",border:"1px solid #f0a020"+"30",borderRadius:6,marginBottom:10}}>
                <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600,marginBottom:8}}>Pago aplazado</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div>
                    <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>Vencimiento</div>
                    <input type="date" value={ed.payDueDate||""} onChange={e => setEd(p => ({...p, payDueDate:e.target.value}))} style={{width:"100%",padding:7,border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} />
                  </div>
                  <div>
                    <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>Recordar X días antes</div>
                    <input type="number" value={ed.payReminderDays||7} onChange={e => setEd(p => ({...p, payReminderDays:parseInt(e.target.value)||7}))} style={{width:"100%",padding:7,border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} />
                  </div>
                </div>
              </div>}

              {/* SPLIT 50/50 */}
              {ed.payMethod === "split" && <div style={{padding:"12px 14px",background:"#f3eef9",border:"1px solid #8e44ad30",borderRadius:6,marginBottom:10}}>
                <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600,marginBottom:8}}>Pago fraccionado (50% / 50% por defecto)</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:8}}>
                  <div>
                    <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>1er pago</div>
                    <input type="number" step="0.01" value={ed.paySplit1Amount||(ed.total/2).toFixed(2)} onChange={e => setEd(p => ({...p, paySplit1Amount:parseFloat(e.target.value)||0}))} style={{width:"100%",padding:7,border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box",marginBottom:4}} />
                    <input type="date" value={ed.paySplit1Date||""} onChange={e => setEd(p => ({...p, paySplit1Date:e.target.value}))} style={{width:"100%",padding:7,border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} />
                    <label style={{display:"flex",alignItems:"center",gap:4,marginTop:6,fontSize:10,fontFamily:BD,color:C.gr,cursor:"pointer"}}><input type="checkbox" checked={ed.paySplit1Done||false} onChange={e => setEd(p => ({...p, paySplit1Done:e.target.checked}))} /> Cobrado</label>
                  </div>
                  <div>
                    <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>2º pago</div>
                    <input type="number" step="0.01" value={ed.paySplit2Amount||(ed.total/2).toFixed(2)} onChange={e => setEd(p => ({...p, paySplit2Amount:parseFloat(e.target.value)||0}))} style={{width:"100%",padding:7,border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box",marginBottom:4}} />
                    <input type="date" value={ed.paySplit2Date||""} onChange={e => setEd(p => ({...p, paySplit2Date:e.target.value}))} style={{width:"100%",padding:7,border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} />
                    <label style={{display:"flex",alignItems:"center",gap:4,marginTop:6,fontSize:10,fontFamily:BD,color:C.gr,cursor:"pointer"}}><input type="checkbox" checked={ed.paySplit2Done||false} onChange={e => setEd(p => ({...p, paySplit2Done:e.target.checked}))} /> Cobrado</label>
                  </div>
                </div>
              </div>}

              {/* PAYMENT STATUS */}
              <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:6}}>Estado del pago</div>
              <div style={{display:"flex",gap:6}}>
                {[["pending","Pendiente",C.yl],["partial","Cobro parcial","#e67e22"],["paid","Pagado",C.gn],["overdue","Vencido",C.rd]].map(([v,l,col]) => {
                  const isSel = ed.pay === v;
                  return <button key={v} onClick={() => setEd(p => ({...p, pay:v}))} style={{padding:"6px 12px",background:isSel?col:"transparent",color:isSel?"#fff":col,border:"1px solid "+col+(isSel?"":"50"),borderRadius:4,cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:600}}>{l}</button>;
                })}
              </div>

              <button onClick={() => { 
                const orig = orders.find(o => o.id === ed.id);
                const changes = [];
                if ((orig.pay||"") !== (ed.pay||"")) changes.push("Estado pago: "+(orig.pay||"—")+" → "+(ed.pay||"—"));
                if ((orig.payMethod||"") !== (ed.payMethod||"")) changes.push("Método pago: "+(orig.payMethod||"—")+" → "+(ed.payMethod||"—"));
                const updates = {pay:ed.pay,payMethod:ed.payMethod,paymentLink:ed.paymentLink||"",payDueDate:ed.payDueDate||"",payReminderDays:ed.payReminderDays||7,paySplit1Amount:ed.paySplit1Amount||0,paySplit1Date:ed.paySplit1Date||"",paySplit1Done:ed.paySplit1Done||false,paySplit2Amount:ed.paySplit2Amount||0,paySplit2Date:ed.paySplit2Date||"",paySplit2Done:ed.paySplit2Done||false}; 
                setOrders(p => p.map(o => o.id === ed.id ? {...o, ...updates} : o)); 
                if(dbReady && ed.dbId) { supabase.from("orders").update({payment:ed.pay,payment_method:ed.payMethod||null,payment_link:ed.paymentLink||null,payment_due_date:ed.payDueDate||null}).eq("id", ed.dbId); } 
                if (changes.length > 0) logOrderChange(ed.id, "Cambio en pago", changes.join(" · "));
                setModal(null); 
              }} style={{width:"100%",marginTop:12,padding:"10px 0",background:C.dk,color:C.bg,border:"none",borderRadius:4,fontSize:11,fontFamily:BD,cursor:"pointer",fontWeight:600}}>💾 Guardar pago</button>
            </div>}

            {/* CLIENT VIEW - payment status */}
            {role === "client" && <div style={{marginTop:16,padding:"14px 16px",background:C.wh,border:"1px solid "+C.ln,borderRadius:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontSize:13,fontFamily:BD,fontWeight:700,color:C.dk}}>💳 {t("pagoDelPedido")}</div>
                <Badge l={PL[ed.pay]} c={PC[ed.pay]} />
              </div>
              {!ed.payMethod ? <div style={{fontSize:11,fontFamily:BD,color:C.gr,padding:"10px 12px",background:C.bg,borderRadius:4,lineHeight:1.5}}>{t("esperandoConfirmacion")}</div> : <>
                <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginBottom:8}}>{t("metodo")}: {ed.payMethod === "card" ? "💳 "+t("pagarAhora").replace(t("pagarAhora"),"Tarjeta / Card") : ed.payMethod === "sepa" ? "🏦 SEPA" : ed.payMethod === "transfer" ? "💸 Transferencia" : ed.payMethod === "deferred" ? "📅 Aplazado" : "➗ Fraccionado"}</div>
                {ed.payMethod === "card" && (ed.paymentLink ? <a href={ed.paymentLink} target="_blank" rel="noreferrer" style={{display:"inline-block",padding:"12px 24px",background:"#635bff",color:"#fff",borderRadius:6,fontSize:13,fontFamily:BD,fontWeight:700,textDecoration:"none"}}>💳 {t("pagarAhora")} — {fmt(ed.total)} €</a> : <div style={{fontSize:11,color:C.gr,fontFamily:BD,padding:"10px 12px",background:C.bg,borderRadius:4}}>{t("pendienteGenerarLink")}</div>)}
                {(ed.payMethod === "sepa" || ed.payMethod === "transfer") && <div style={{fontSize:11,fontFamily:BD,color:C.dk,lineHeight:1.7,fontFamily:"monospace",background:C.bg,padding:"10px 12px",borderRadius:4}}>
                  <div><span style={{color:C.gr}}>Titular:</span> Minuë Opticians</div>
                  <div><span style={{color:C.gr}}>IBAN:</span> ES11 2100 8447 6202 0010 9299</div>
                  <div><span style={{color:C.gr}}>BIC:</span> CAIXESBBXXX</div>
                  <div><span style={{color:C.gr}}>Banco:</span> CaixaBank</div>
                  <div><span style={{color:C.gr}}>Concepto:</span> <strong>{ed.id}</strong></div>
                  <div><span style={{color:C.gr}}>Importe:</span> <strong>{fmt(ed.total)} €</strong></div>
                </div>}
                {ed.payMethod === "deferred" && ed.payDueDate && <div style={{fontSize:11,fontFamily:BD,color:C.dk,padding:"10px 12px",background:"#fff8e6",borderRadius:4}}>{lang==="fr"?"Échéance":lang==="en"?"Due date":lang==="it"?"Scadenza":"Vencimiento"}: <strong>{new Date(ed.payDueDate).toLocaleDateString(lang)}</strong></div>}
                {ed.payMethod === "split" && <div style={{fontSize:11,fontFamily:BD,color:C.dk,lineHeight:1.8,padding:"10px 12px",background:"#f3eef9",borderRadius:4}}>
                  <div>{lang==="fr"?"1er paiement":lang==="en"?"1st payment":lang==="it"?"1° pagamento":"1er pago"}: <strong>{fmt(ed.paySplit1Amount||0)} €</strong> {ed.paySplit1Date && " · "+new Date(ed.paySplit1Date).toLocaleDateString(lang)} {ed.paySplit1Done && <span style={{color:C.gn,fontWeight:600}}>✓ {lang==="fr"?"Encaissé":lang==="en"?"Paid":lang==="it"?"Incassato":"Cobrado"}</span>}</div>
                  <div>{lang==="fr"?"2e paiement":lang==="en"?"2nd payment":lang==="it"?"2° pagamento":"2º pago"}: <strong>{fmt(ed.paySplit2Amount||0)} €</strong> {ed.paySplit2Date && " · "+new Date(ed.paySplit2Date).toLocaleDateString(lang)} {ed.paySplit2Done && <span style={{color:C.gn,fontWeight:600}}>✓ {lang==="fr"?"Encaissé":lang==="en"?"Paid":lang==="it"?"Incassato":"Cobrado"}</span>}</div>
                </div>}
              </>}
            </div>}

            {/* HISTORY (admin/team only) */}
            {(role === "admin" || role === "team") && orderHistory[ed.id] && orderHistory[ed.id].length > 0 && <div style={{marginTop:16,padding:"14px 16px",background:C.wh,border:"1px solid "+C.ln,borderRadius:8}}>
              <div style={{fontSize:12,fontFamily:BD,fontWeight:700,color:C.dk,marginBottom:10}}>📜 Histórico de cambios ({orderHistory[ed.id].length})</div>
              <div style={{maxHeight:220,overflowY:"auto",display:"flex",flexDirection:"column",gap:6}}>
                {[...orderHistory[ed.id]].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).map(h => (
                  <div key={h.id} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"7px 10px",background:C.bg,borderRadius:4,fontSize:11,fontFamily:BD}}>
                    <span style={{fontSize:10,fontFamily:BD,color:C.gr2,fontWeight:600,minWidth:90}}>{new Date(h.timestamp).toLocaleString("es-ES",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}</span>
                    <div style={{flex:1}}>
                      <div style={{color:C.dk,fontWeight:600}}>{h.action}</div>
                      {h.details && <div style={{color:C.gr,fontSize:10,marginTop:1}}>{h.details}</div>}
                    </div>
                    <span style={{fontSize:9,padding:"2px 6px",background:h.role==="admin"?C.dk:h.role==="team"?"#a8c8e8":h.role==="distributor"?C.bl:C.gn,color:"#fff",borderRadius:3,fontWeight:600,whiteSpace:"nowrap"}}>{h.user}</span>
                  </div>
                ))}
              </div>
            </div>}

            {canEdit && <Btn onClick={() => { 
              const orig = orders.find(o => o.id === ed.id);
              const changes = [];
              if (orig.status !== ed.status) changes.push("Estado: "+orig.status+" → "+ed.status);
              if (orig.items !== ed.items) changes.push("Unidades: "+orig.items+" → "+ed.items);
              if (Math.abs((orig.total||0) - (ed.total||0)) > 0.01) changes.push("Total: "+fmt(orig.total)+" → "+fmt(ed.total)+" €");
              if ((orig.notes||"") !== (ed.notes||"")) changes.push("Notas internas actualizadas");
              if ((orig.clientNotes||"") !== (ed.clientNotes||"")) changes.push("Notas cliente actualizadas");
              setOrders(p => p.map((o, i) => i === ed.idx ? {...o, lines:ed.lines, items:ed.items, total:ed.total, clientNotes:ed.clientNotes, notes:ed.notes, status:ed.status, track:ed.track, carrier:ed.carrier} : o)); 
              if (changes.length > 0) logOrderChange(ed.id, "Edición de pedido", changes.join(" · "));
              setModal(null); 
            }} style={{width:"100%",marginTop:8}}>{t("editarCmd")}</Btn>}
            {(role === "admin" || role === "team") && <Btn ghost onClick={() => downloadAlbaran(ed)} style={{width:"100%",marginTop:8}}>📄 {t("descargarAlbaran")}</Btn>}
          </>;
          })()}

          {/* NEW USER */}
          {modal === "newUser" && <>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:6}}>{t("roleLabel")}</div>
              <div style={{display:"flex",gap:8}}>
                {[["client",t("client"),"🏪",C.gn],["distributor",t("distributeur")+" / Showroom","🤝",C.bl],["team",t("employe")+" Minuë","👤","#a8c8e8"]].map(([v,l,icon,col]) => (
                  <button key={v} onClick={() => setEd(p => ({...p, role:v, commRate:v==="distributor"?15:0}))} style={{flex:1,padding:"12px 14px",background:ed.role===v?col+"12":"transparent",border:"2px solid "+(ed.role===v?col:C.ln),borderRadius:8,cursor:"pointer",textAlign:"left"}}>
                    <div style={{fontSize:18,marginBottom:4}}>{icon}</div>
                    <div style={{fontSize:12,fontFamily:BD,fontWeight:600,color:ed.role===v?col:C.gr}}>{l}</div>
                  </button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("langue")}</div>
              <div style={{display:"flex",gap:6}}>
                {[["fr","FR"],["es","ES"],["en","EN"],["it","IT"]].map(([v,l]) => (
                  <button key={v} onClick={() => setEd(p => ({...p, lang:v}))} style={{padding:"6px 14px",background:ed.lang===v?C.dk:"transparent",color:ed.lang===v?C.bg:C.gr,border:"1px solid "+(ed.lang===v?C.dk:C.ln),cursor:"pointer",fontSize:11,fontFamily:BD,fontWeight:500,borderRadius:20}}>{l}</button>
                ))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("contact")}</div>
                <input value={ed.name || ""} onChange={e => setEd(p => ({...p, name: e.target.value}))} placeholder="Nom" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("entreprise")}</div>
                <input value={ed.co || ""} onChange={e => setEd(p => ({...p, co: e.target.value}))} placeholder="Boutique / Showroom" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("emailLabel")}</div>
              <input type="email" value={ed.email || ""} onChange={e => setEd(p => ({...p, email: e.target.value}))} placeholder="user@store.com" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("pwLabel")}</div>
              <input value={ed.pw || ""} onChange={e => setEd(p => ({...p, pw: e.target.value}))} placeholder="min. 6 chars" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            {ed.role === "distributor" && <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("commissionRate")}</div>
              <input type="number" value={ed.commRate || 15} onChange={e => setEd(p => ({...p, commRate: parseInt(e.target.value)||15}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:"8px 12px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("telephone")}</div>
                <input value={ed.phone || ""} onChange={e => setEd(p => ({...p, phone: e.target.value}))} placeholder="+34..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("ville")}</div>
                <input value={ed.city || ""} onChange={e => setEd(p => ({...p, city: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("pays")}</div>
                <input value={ed.country || ""} onChange={e => setEd(p => ({...p, country: e.target.value}))} placeholder="FR, ES, DE..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("notesUser")}</div>
              <textarea value={ed.notes || ""} onChange={e => setEd(p => ({...p, notes: e.target.value}))} rows={2} placeholder="..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
            </div>
            <Btn onClick={async () => { if(ed.email && ed.name && ed.pw){ const nu = {...ed, active: true}; setUsers(p => [...p, nu]); await dbSaveUser(nu); if(ed.role === "client"){ const exists = clients.find(cl => (cl.companyEmail && cl.companyEmail.toLowerCase()===ed.email.toLowerCase()) || (cl.name && ed.co && cl.name.toLowerCase()===ed.co.toLowerCase())); if(!exists){ const nc = {id:Date.now(), name:ed.co||ed.name, contact:ed.name, companyEmail:ed.email, phone:ed.phone||"", city:ed.city||"", country:ed.country||"FR", channel:"Direct", status:"prospect", customPrice:0, priceEssential:0, priceIcons:0, priceAcetato:0, earlyPay:false, orders:0, total:0, notes:ed.notes||""}; setClients(p => [...p, nc]); const cid = await dbSaveClient(nc); if(cid) setClients(p => p.map(x => x.id===nc.id?{...x,id:cid}:x)); } } toast(t("enregistrer")); setModal(null); }}} style={{width:"100%"}}>{t("enregistrer")}</Btn>
          </>}

          {/* EDIT USER */}
          {modal === "editUser" && <>
            <div style={{fontSize:15,fontFamily:DP,color:C.dk,fontWeight:500,marginBottom:4}}>{ed.name}</div>
            <div style={{fontSize:12,fontFamily:BD,color:C.gr,marginBottom:16}}>{ed.email} - {ed.role === "distributor" ? t("distributeur") : t(ed.role)}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("contact")}</div>
                <input value={ed.name || ""} onChange={e => setEd(p => ({...p, name: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("entreprise")}</div>
                <input value={ed.co || ""} onChange={e => setEd(p => ({...p, co: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("pwLabel")}</div>
              <input value={ed.pw || ""} onChange={e => setEd(p => ({...p, pw: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            {ed.role === "distributor" && <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("commissionRate")}</div>
              <input type="number" value={ed.commRate || 15} onChange={e => setEd(p => ({...p, commRate: parseInt(e.target.value)||15}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:"8px 12px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("telephone")}</div>
                <input value={ed.phone || ""} onChange={e => setEd(p => ({...p, phone: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("ville")}</div>
                <input value={ed.city || ""} onChange={e => setEd(p => ({...p, city: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("pays")}</div>
                <input value={ed.country || ""} onChange={e => setEd(p => ({...p, country: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("notesUser")}</div>
              <textarea value={ed.notes || ""} onChange={e => setEd(p => ({...p, notes: e.target.value}))} rows={3} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={() => { setUsers(p => p.map(u => u.email === ed.origEmail ? {...u, name:ed.name, co:ed.co, pw:ed.pw, commRate:ed.commRate, active:ed.active!==false, phone:ed.phone, city:ed.city, country:ed.country, notes:ed.notes} : u)); dbUpdateUser(ed); setModal(null); }} style={{flex:1}}>{t("enregistrer")}</Btn>
              <Btn ghost onClick={() => { const tu={...ed, active:!(ed.active!==false)}; setUsers(p => p.map(u => u.email === tu.origEmail ? {...u, active: tu.active} : u)); dbUpdateUser(tu); setModal(null); }} style={{flex:0}}>{ed.active !== false ? t("desactiver") : t("userActif")}</Btn>
            </div>
          </>}

          {/* NEW PROMO */}
          {modal === "newPromo" && <>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("nomPromo")}</div>
              <input value={ed.name || ""} onChange={e => setEd(p => ({...p, name: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("typePromo")}</div>
                <select value={ed.type || "percent"} onChange={e => setEd(p => ({...p, type: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  <option value="percent">{t("percent")}</option>
                  <option value="gift">{t("cadeau")}</option>
                </select>
              </div>
              {ed.type === "percent" && <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("reduction")}</div>
                <input type="number" value={ed.disc || 0} onChange={e => setEd(p => ({...p, disc: parseInt(e.target.value)||0}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 8px"}}>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("conditionFr")}</div><input value={(ed.cond && ed.cond.fr) || ""} onChange={e => setEd(p => ({...p, cond:{...(p.cond||{}), fr:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("conditionEs")}</div><input value={(ed.cond && ed.cond.es) || ""} onChange={e => setEd(p => ({...p, cond:{...(p.cond||{}), es:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("conditionEn")}</div><input value={(ed.cond && ed.cond.en) || ""} onChange={e => setEd(p => ({...p, cond:{...(p.cond||{}), en:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:6}}>{t("visiblePour")}</div>
              <div style={{display:"flex",gap:8}}>
                {["client","distributor"].map(r => { const vis = ed.visible || []; const on = vis.includes(r); return (
                  <button key={r} onClick={() => setEd(p => ({...p, visible: on ? vis.filter(x=>x!==r) : [...vis, r]}))} style={{padding:"6px 14px",background:on?C.dk:"transparent",color:on?C.bg:C.gr,border:"1px solid "+(on?C.dk:C.ln),borderRadius:3,fontSize:11,fontFamily:BD,cursor:"pointer"}}>{r === "distributor" ? t("distributeur") : t("client")}</button>
                ); })}
              </div>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:6}}>{t("promoClients")}</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                <button onClick={() => setEd(p => ({...p, targetClients:[]}))} style={{padding:"4px 10px",background:(!ed.targetClients||ed.targetClients.length===0)?C.dk:"transparent",color:(!ed.targetClients||ed.targetClients.length===0)?C.bg:C.gr,border:"1px solid "+((!ed.targetClients||ed.targetClients.length===0)?C.dk:C.ln),borderRadius:3,fontSize:10,fontFamily:BD,cursor:"pointer"}}>{t("tousClients")}</button>
                {clients.map(c => { const tgt = ed.targetClients||[]; const on = tgt.includes(c.name); return (
                  <button key={c.name} onClick={() => setEd(p => ({...p, targetClients: on ? tgt.filter(x=>x!==c.name) : [...tgt, c.name]}))} style={{padding:"4px 10px",background:on?C.bl:"transparent",color:on?"#fff":C.gr,border:"1px solid "+(on?C.bl:C.ln),borderRadius:3,fontSize:10,fontFamily:BD,cursor:"pointer"}}>{c.name}</button>
                ); })}
              </div>
            </div>
            <Btn onClick={async () => { 
              if(!ed.name) return;
              const tempId = Date.now();
              const np = {...ed, id: tempId, on:true}; 
              setPromos(p => [...p, np]); 
              const dbId = await dbSavePromo(np); 
              if (dbId) setPromos(p => p.map(pr => pr.id === tempId ? {...pr, id: dbId} : pr));
              setModal(null); 
            }} style={{width:"100%"}}>{t("enregistrer")}</Btn>
          </>}

          {/* EDIT PROMO */}
          {modal === "editPromo" && <>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("nomPromo")}</div>
              <input value={ed.name || ""} onChange={e => setEd(p => ({...p, name: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("typePromo")}</div>
                <select value={ed.type || "percent"} onChange={e => setEd(p => ({...p, type: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  <option value="percent">{t("percent")}</option>
                  <option value="gift">{t("cadeau")}</option>
                </select>
              </div>
              {ed.type === "percent" && <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("reduction")}</div>
                <input type="number" value={ed.disc || 0} onChange={e => setEd(p => ({...p, disc: parseInt(e.target.value)||0}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 8px"}}>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("conditionFr")}</div><input value={(ed.cond && ed.cond.fr) || ""} onChange={e => setEd(p => ({...p, cond:{...(p.cond||{}), fr:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("conditionEs")}</div><input value={(ed.cond && ed.cond.es) || ""} onChange={e => setEd(p => ({...p, cond:{...(p.cond||{}), es:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("conditionEn")}</div><input value={(ed.cond && ed.cond.en) || ""} onChange={e => setEd(p => ({...p, cond:{...(p.cond||{}), en:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:6}}>{t("visiblePour")}</div>
              <div style={{display:"flex",gap:8}}>
                {["client","distributor"].map(r => { const vis = ed.visible || []; const on = vis.includes(r); return (
                  <button key={r} onClick={() => setEd(p => ({...p, visible: on ? vis.filter(x=>x!==r) : [...vis, r]}))} style={{padding:"6px 14px",background:on?C.dk:"transparent",color:on?C.bg:C.gr,border:"1px solid "+(on?C.dk:C.ln),borderRadius:3,fontSize:11,fontFamily:BD,cursor:"pointer"}}>{r === "distributor" ? t("distributeur") : t("client")}</button>
                ); })}
              </div>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:6}}>{t("promoClients")}</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                <button onClick={() => setEd(p => ({...p, targetClients:[]}))} style={{padding:"4px 10px",background:(!ed.targetClients||ed.targetClients.length===0)?C.dk:"transparent",color:(!ed.targetClients||ed.targetClients.length===0)?C.bg:C.gr,border:"1px solid "+((!ed.targetClients||ed.targetClients.length===0)?C.dk:C.ln),borderRadius:3,fontSize:10,fontFamily:BD,cursor:"pointer"}}>{t("tousClients")}</button>
                {clients.map(c => { const tgt = ed.targetClients||[]; const on = tgt.includes(c.name); return (
                  <button key={c.name} onClick={() => setEd(p => ({...p, targetClients: on ? tgt.filter(x=>x!==c.name) : [...tgt, c.name]}))} style={{padding:"4px 10px",background:on?C.bl:"transparent",color:on?"#fff":C.gr,border:"1px solid "+(on?C.bl:C.ln),borderRadius:3,fontSize:10,fontFamily:BD,cursor:"pointer"}}>{c.name}</button>
                ); })}
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={() => { setPromos(p => p.map(pr => pr.id === ed.id ? {...ed} : pr)); dbUpdatePromo(ed); setModal(null); }} style={{flex:1}}>{t("enregistrer")}</Btn>
              <Btn ghost onClick={() => { const tp={...ed,on:!ed.on}; setPromos(p => p.map(pr => pr.id === tp.id ? {...pr, on: tp.on} : pr)); dbUpdatePromo(tp); setModal(null); }}>{ed.on ? t("desactiver") : t("userActif")}</Btn>
            </div>
          </>}

          {/* NEW NEWS */}
          {modal === "newNews" && <>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("titreNouveaute")} (FR)</div>
              <input value={(ed.title && ed.title.fr) || ""} onChange={e => setEd(p => ({...p, title:{...(p.title||{}), fr:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("titreNouveaute")} (ES)</div><input value={(ed.title && ed.title.es) || ""} onChange={e => setEd(p => ({...p, title:{...(p.title||{}), es:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("titreNouveaute")} (EN)</div><input value={(ed.title && ed.title.en) || ""} onChange={e => setEd(p => ({...p, title:{...(p.title||{}), en:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("contenu")} (FR)</div>
              <textarea value={(ed.content && ed.content.fr) || ""} onChange={e => setEd(p => ({...p, content:{...(p.content||{}), fr:e.target.value}}))} rows={3} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("contenu")} (ES)</div><textarea value={(ed.content && ed.content.es) || ""} onChange={e => setEd(p => ({...p, content:{...(p.content||{}), es:e.target.value}}))} rows={2} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} /></div>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("contenu")} (EN)</div><textarea value={(ed.content && ed.content.en) || ""} onChange={e => setEd(p => ({...p, content:{...(p.content||{}), en:e.target.value}}))} rows={2} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} /></div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("lienUrl")}</div>
              <input value={ed.url || ""} onChange={e => setEd(p => ({...p, url: e.target.value}))} placeholder="https://..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center"}}>
              <label style={{fontSize:11,fontFamily:BD,color:C.dk,display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}><input type="checkbox" checked={ed.pinned||false} onChange={e => setEd(p => ({...p, pinned:e.target.checked}))} /> {t("epingle")}</label>
            </div>
            <Btn onClick={async () => { if(ed.title && ed.title.fr){ const tempId = Date.now(); const nn = {...ed, id:tempId, date:new Date().toLocaleDateString("fr-FR"), on:true}; setNews(p => [...p, nn]); const realId = await dbSaveNews(nn); if (realId) setNews(p => p.map(x => x.id===tempId ? {...x, id:realId} : x)); toast(t("enregistrer")); setModal(null); }}} style={{width:"100%"}}>{t("enregistrer")}</Btn>
          </>}

          {/* EDIT NEWS */}
          {modal === "editNews" && <>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("titreNouveaute")} (FR)</div>
              <input value={(ed.title && ed.title.fr) || ""} onChange={e => setEd(p => ({...p, title:{...(p.title||{}), fr:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("titreNouveaute")} (ES)</div><input value={(ed.title && ed.title.es) || ""} onChange={e => setEd(p => ({...p, title:{...(p.title||{}), es:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("titreNouveaute")} (EN)</div><input value={(ed.title && ed.title.en) || ""} onChange={e => setEd(p => ({...p, title:{...(p.title||{}), en:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("contenu")} (FR)</div>
              <textarea value={(ed.content && ed.content.fr) || ""} onChange={e => setEd(p => ({...p, content:{...(p.content||{}), fr:e.target.value}}))} rows={3} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("contenu")} (ES)</div><textarea value={(ed.content && ed.content.es) || ""} onChange={e => setEd(p => ({...p, content:{...(p.content||{}), es:e.target.value}}))} rows={2} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} /></div>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("contenu")} (EN)</div><textarea value={(ed.content && ed.content.en) || ""} onChange={e => setEd(p => ({...p, content:{...(p.content||{}), en:e.target.value}}))} rows={2} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} /></div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("lienUrl")}</div>
              <input value={ed.url || ""} onChange={e => setEd(p => ({...p, url: e.target.value}))} placeholder="https://..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center"}}>
              <label style={{fontSize:11,fontFamily:BD,color:C.dk,display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}><input type="checkbox" checked={ed.pinned||false} onChange={e => setEd(p => ({...p, pinned:e.target.checked}))} /> {t("epingle")}</label>
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={() => { setNews(p => p.map(n => n.id === ed.id ? {...ed} : n)); dbUpdateNews(ed); setModal(null); }} style={{flex:1}}>{t("enregistrer")}</Btn>
              <Btn ghost onClick={() => { const tn={...ed,on:!ed.on}; setNews(p => p.map(n => n.id === tn.id ? {...n, on:tn.on} : n)); dbUpdateNews(tn); setModal(null); }}>{ed.on ? t("desactiver") : t("userActif")}</Btn>
            </div>
          </>}

          {/* NEW INSIGHT */}
          {modal === "newInsight" && <>
            <div style={{fontSize:18,fontFamily:DP,color:C.dk,fontWeight:500,marginBottom:14}}>💡 {t("nuevoInsight")}</div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("iconoLabel")} (emoji)</div>
              <input value={ed.icon||"📊"} onChange={e => setEd(p => ({...p, icon:e.target.value}))} maxLength={4} style={{width:80,padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:18,background:C.bg,color:C.dk,boxSizing:"border-box",textAlign:"center"}} />
            </div>
            {["es","fr","en","it"].map(l => <div key={l}>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("tituloLabel")} ({l.toUpperCase()})</div>
                <input value={(ed.title&&ed.title[l])||""} onChange={e => setEd(p => ({...p, title:{...(p.title||{}), [l]:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("textoLabel")} ({l.toUpperCase()})</div>
                <textarea value={(ed.text&&ed.text[l])||""} onChange={e => setEd(p => ({...p, text:{...(p.text||{}), [l]:e.target.value}}))} rows={2} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
              </div>
            </div>)}
            <label style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,cursor:"pointer"}}>
              <input type="checkbox" checked={ed.on!==false} onChange={e => setEd(p => ({...p, on:e.target.checked}))} />
              <span style={{fontSize:11,fontFamily:BD,color:C.dk}}>{t("activoLabel")}</span>
            </label>
            <Btn onClick={() => { const np = {...ed, id: Date.now()}; setInsights(p => [...p, np]); setModal(null); }} style={{width:"100%"}}>{t("enregistrer")}</Btn>
          </>}

          {/* EDIT INSIGHT */}
          {modal === "editInsight" && <>
            <div style={{fontSize:18,fontFamily:DP,color:C.dk,fontWeight:500,marginBottom:14}}>💡 Editar insight</div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("iconoLabel")} (emoji)</div>
              <input value={ed.icon||""} onChange={e => setEd(p => ({...p, icon:e.target.value}))} maxLength={4} style={{width:80,padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:18,background:C.bg,color:C.dk,boxSizing:"border-box",textAlign:"center"}} />
            </div>
            {["es","fr","en","it"].map(l => <div key={l}>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("tituloLabel")} ({l.toUpperCase()})</div>
                <input value={(ed.title&&ed.title[l])||""} onChange={e => setEd(p => ({...p, title:{...(p.title||{}), [l]:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("textoLabel")} ({l.toUpperCase()})</div>
                <textarea value={(ed.text&&ed.text[l])||""} onChange={e => setEd(p => ({...p, text:{...(p.text||{}), [l]:e.target.value}}))} rows={2} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
              </div>
            </div>)}
            <label style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,cursor:"pointer"}}>
              <input type="checkbox" checked={ed.on!==false} onChange={e => setEd(p => ({...p, on:e.target.checked}))} />
              <span style={{fontSize:11,fontFamily:BD,color:C.dk}}>{t("activoLabel")}</span>
            </label>
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={() => { setInsights(p => p.map(i => i.id === ed.id ? {...ed} : i)); setModal(null); }} style={{flex:1}}>{t("enregistrer")}</Btn>
              <Btn ghost onClick={() => askConfirm("¿Eliminar este insight?", () => { setInsights(p => p.filter(i => i.id !== ed.id)); setModal(null); })} style={{color:C.rd,borderColor:C.rd}}>Eliminar</Btn>
            </div>
          </>}

          {/* VIEW INVOICE */}
          {modal === "viewInv" && (() => {
            const invNumber = ed.invoiceNumber || ("F-" + new Date().getFullYear() + "-" + String((ed.id||"").replace("#MN-","")).padStart(4,"0"));
            const invDate = ed.invoiceDate || ed.date || new Date().toLocaleDateString("fr-FR");
            const cl = clients.find(c => c.name === ed.client) || {};
            const taxRate = ed.taxRate !== undefined ? ed.taxRate : 21;
            const shippingC = ed.shippingCost || 0;
            const subtotal = ed.total || 0;
            const tax = (subtotal + shippingC) * (taxRate/100);
            const total = subtotal + shippingC + tax;
            return <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
              <div style={{fontSize:18,fontFamily:DP,color:C.dk,fontWeight:600}}>📄 Factura</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                <button onClick={() => setEd(p => ({...p, _editMode: !p._editMode}))} style={{padding:"6px 12px",background:ed._editMode?C.dk:"transparent",color:ed._editMode?C.bg:C.dk,border:"1px solid "+C.dk,borderRadius:4,fontSize:11,fontFamily:BD,fontWeight:600,cursor:"pointer"}}>{ed._editMode ? "✓ Listo" : "✏️ Editar"}</button>
                <button onClick={() => {
                  const lns = ed.lines || [];
                  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${invNumber} — Minuë Opticians</title><style>
                    @page { margin: 1.8cm; size: A4; }
                    body { font-family:'Helvetica Neue', Arial, sans-serif; color:#18332f; line-height:1.5; padding:0; }
                    .header { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:3px solid #18332f; padding-bottom:18px; margin-bottom:30px; }
                    .brand { font-family:Georgia, serif; font-size:32px; font-weight:400; letter-spacing:1px; color:#18332f; margin-bottom:4px; }
                    .brand-sub { font-size:10px; color:#888; letter-spacing:3px; text-transform:uppercase; }
                    .inv-title { text-align:right; }
                    .inv-num { font-size:22px; font-family:Georgia, serif; color:#18332f; font-weight:400; }
                    .inv-date { font-size:11px; color:#888; margin-top:4px; }
                    .badge { display:inline-block; padding:4px 12px; border-radius:3px; font-size:10px; letter-spacing:1px; text-transform:uppercase; font-weight:600; margin-top:8px; }
                    .badge.paid { background:#1f9e6e; color:white; }
                    .badge.pending { background:#f0a020; color:white; }
                    .parties { display:flex; gap:30px; margin-bottom:30px; }
                    .party { flex:1; padding:14px 16px; background:#f8efe6; border-radius:6px; }
                    .party-label { font-size:9px; letter-spacing:2px; text-transform:uppercase; color:#888; font-weight:600; margin-bottom:8px; }
                    .party-name { font-size:13px; font-weight:600; color:#18332f; margin-bottom:6px; }
                    .party-info { font-size:11px; color:#666; line-height:1.6; }
                    table { width:100%; border-collapse:collapse; font-size:11px; margin-bottom:20px; }
                    th { background:#18332f; color:#f8efe6; padding:11px 12px; text-align:left; font-weight:500; font-size:10px; letter-spacing:1px; text-transform:uppercase; }
                    th.right, td.right { text-align:right; }
                    th.center, td.center { text-align:center; }
                    td { padding:10px 12px; border-bottom:1px solid #eee; }
                    tr:nth-child(even) td { background:#fafafa; }
                    .totals { background:#f8efe6; padding:20px 24px; border-radius:8px; margin-top:20px; max-width:400px; margin-left:auto; }
                    .tot-row { display:flex; justify-content:space-between; padding:5px 0; font-size:12px; }
                    .tot-row.grand { border-top:2px solid #18332f; padding-top:12px; margin-top:8px; font-weight:700; font-size:18px; }
                    .footer { margin-top:50px; padding-top:18px; border-top:1px solid #ddd; font-size:9px; color:#888; line-height:1.7; }
                    .bank { background:#fff8e6; border:1px solid #f0a020; padding:12px 16px; border-radius:6px; margin-top:24px; font-size:11px; }
                    .notes { margin-top:20px; padding:12px 16px; background:#fafafa; border-left:3px solid #18332f; font-size:10px; color:#666; }
                  </style></head><body>
                    <div class="header">
                      <div>
                        <img src="https://cdn.shopify.com/s/files/1/0052/2797/0629/files/LOGO_VERDE_MINUE.png?v=1613555706" alt="Minuë" style="height:50px;width:auto;display:block;margin-bottom:4px" />
                        <div class="brand-sub">Opticians · Wholesale</div>
                      </div>
                      <div class="inv-title">
                        <div class="inv-num">${invNumber}</div>
                        <div class="inv-date">Fecha: ${invDate}</div>
                        <div class="badge ${ed.pay==='paid'?'paid':'pending'}">${ed.pay==='paid'?'PAGADA':'PENDIENTE'}</div>
                      </div>
                    </div>

                    <div class="parties">
                      <div class="party">
                        <div class="party-label">Emisor</div>
                        <div class="party-name">Minuë Opticians</div>
                        <div class="party-info">
                          Alejandro Carrasco Díaz<br>
                          NIF: ES77843808D<br>
                          C/ Gutiérrez de Alba 2<br>
                          41010 Sevilla, España<br>
                          hola@minueopticians.com
                        </div>
                      </div>
                      <div class="party">
                        <div class="party-label">Destinatario</div>
                        <div class="party-name">${cl.companyName || ed.client || "—"}</div>
                        <div class="party-info">
                          ${cl.contact ? cl.contact + "<br>" : ""}
                          ${cl.taxId ? "NIF/CIF: " + cl.taxId + "<br>" : ""}
                          ${cl.address ? cl.address + "<br>" : ""}
                          ${cl.postalCode || ""} ${cl.city || ""}<br>
                          ${cl.country || ""}<br>
                          ${cl.companyEmail || ""}
                        </div>
                      </div>
                    </div>

                    <table>
                      <thead><tr><th>Concepto</th><th class="center">Uds</th><th class="right">P. Unitario</th><th class="right">Total</th></tr></thead>
                      <tbody>
                        ${lns.map(l => `<tr><td><strong>${l.model}</strong> · ${l.color}<br><span style="font-size:9px;color:#999">SKU: ${l.sku||"—"}</span></td><td class="center">${l.qty}</td><td class="right">${fmt(l.price)} €</td><td class="right"><strong>${fmt(l.price*l.qty)} €</strong></td></tr>`).join("")}
                      </tbody>
                    </table>

                    ${ed.clientNotes ? `<div class="notes"><strong>Notas:</strong> ${ed.clientNotes}</div>` : ""}

                    <div class="totals">
                      <div class="tot-row"><span>Subtotal</span><span>${fmt(subtotal)} €</span></div>
                      ${shippingC > 0 ? `<div class="tot-row"><span>Envío</span><span>${fmt(shippingC)} €</span></div>` : ""}
                      <div class="tot-row"><span>IVA (${taxRate}%)</span><span>${fmt(tax)} €</span></div>
                      <div class="tot-row grand"><span>TOTAL</span><span>${fmt(total)} €</span></div>
                    </div>

                    <div class="bank">
                      <strong>Datos bancarios:</strong><br>
                      Titular: Minuë Opticians<br>
                      IBAN: ES11 2100 8447 6202 0010 9299 · BIC: CAIXESBBXXX · CaixaBank<br>
                      Concepto: ${invNumber}
                    </div>

                    <div class="footer">
                      Factura generada el ${new Date().toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"})} desde b2b.minueopticians.com<br>
                      Producto entregado sujeto a las condiciones generales de venta de Minuë Opticians. Conforme al RGPD, los datos personales se conservan únicamente para la gestión comercial.
                    </div>
                  </body></html>`;
                  const w = window.open("","_blank");
                  w.document.write(html);
                  w.document.close();
                  setTimeout(() => w.print(), 500);
                }} style={{padding:"6px 12px",background:CL.gn,color:"#fff",border:"none",borderRadius:4,fontSize:11,fontFamily:BD,fontWeight:600,cursor:"pointer"}}>📄 PDF / Imprimir</button>
              </div>
            </div>

            <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:"20px",marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:8}}>
                <div>
                  {ed._editMode ? <>
                    <div style={{fontSize:9,color:C.gr,fontFamily:BD,marginBottom:3}}>Número factura</div>
                    <input value={invNumber} onChange={e => setEd(p => ({...p, invoiceNumber: e.target.value}))} style={{padding:6,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:14,background:C.wh,color:C.dk,fontWeight:600,marginBottom:6}} />
                    <input type="date" value={invDate} onChange={e => setEd(p => ({...p, invoiceDate: e.target.value}))} style={{padding:6,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,marginLeft:8}} />
                  </> : <>
                    <div style={{fontSize:18,fontFamily:DP,color:C.dk,fontWeight:500}}>{invNumber}</div>
                    <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:2}}>{invDate}</div>
                  </>}
                </div>
                <Badge l={PL[ed.pay]} c={PC[ed.pay]} />
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                <div>
                  <div style={{fontSize:9,fontFamily:BD,color:C.gr,marginBottom:4,fontWeight:600,textTransform:"uppercase"}}>Emisor</div>
                  <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600}}>Minuë Opticians</div>
                  <div style={{fontSize:10,fontFamily:BD,color:C.gr,lineHeight:1.5}}>Alejandro Carrasco Díaz<br/>NIF: ES77843808D<br/>C/ Gutiérrez de Alba 2<br/>41010 Sevilla, España</div>
                </div>
                <div>
                  <div style={{fontSize:9,fontFamily:BD,color:C.gr,marginBottom:4,fontWeight:600,textTransform:"uppercase"}}>Destinatario</div>
                  <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600}}>{cl.companyName || ed.client}</div>
                  <div style={{fontSize:10,fontFamily:BD,color:C.gr,lineHeight:1.5}}>
                    {cl.contact && <>{cl.contact}<br/></>}
                    {cl.taxId && <>NIF/CIF: {cl.taxId}<br/></>}
                    {cl.address && <>{cl.address}<br/></>}
                    {cl.postalCode || ""} {cl.city || ""}<br/>
                    {cl.country || ""}
                  </div>
                </div>
              </div>
              {ed.lines && ed.lines.length > 0 && <div style={{borderTop:"1px solid "+C.ln,paddingTop:12}}>
                <div style={{display:"flex",padding:"0 0 6px",fontSize:9,fontFamily:BD,color:C.gr,fontWeight:600,textTransform:"uppercase"}}>
                  <span style={{flex:1}}>Concepto</span><span style={{minWidth:35,textAlign:"center"}}>Uds</span><span style={{minWidth:55,textAlign:"right"}}>P.U.</span><span style={{minWidth:60,textAlign:"right"}}>Total</span>
                </div>
                {ed.lines.map((l,i) => (
                  <div key={i} style={{display:"flex",padding:"5px 0",fontSize:11,fontFamily:BD,borderBottom:"1px solid "+C.bg2}}>
                    <span style={{flex:1,color:C.dk}}>{l.model} {l.color}</span>
                    <span style={{minWidth:35,textAlign:"center",color:C.gr}}>{l.qty}</span>
                    <span style={{minWidth:55,textAlign:"right",color:C.gr}}>{fmt(l.price)} €</span>
                    <span style={{minWidth:60,textAlign:"right",color:C.dk,fontWeight:600}}>{fmt(l.price*l.qty)} €</span>
                  </div>
                ))}
              </div>}
              <div style={{borderTop:"2px solid "+C.dk,marginTop:12,paddingTop:10}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontFamily:BD,marginBottom:4}}><span style={{color:C.gr}}>{t("sousTotal")}</span><span>{fmt(subtotal)} €</span></div>
                {shippingC > 0 && <div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontFamily:BD,marginBottom:4}}><span style={{color:C.gr}}>{t("fraisEnvoi")}</span><span>{fmt(shippingC)} €</span></div>}
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontFamily:BD,marginBottom:4,alignItems:"center"}}>
                  <span style={{color:C.gr,display:"flex",alignItems:"center",gap:6}}>IVA{ed._editMode && <input type="number" value={taxRate} onChange={e => setEd(p => ({...p, taxRate: parseFloat(e.target.value)||0}))} style={{width:50,padding:3,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:10,background:C.wh,color:C.dk,boxSizing:"border-box"}} />} ({taxRate}%)</span>
                  <span>{fmt(tax)} €</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:14,fontFamily:DP,fontWeight:600,marginTop:6}}><span>TOTAL</span><span>{fmt(total)} €</span></div>
              </div>
              <div style={{marginTop:12,paddingTop:10,borderTop:"1px solid "+C.ln}}>
                <div style={{fontSize:9,fontFamily:BD,color:C.gr}}>IBAN: ES11 2100 8447 6202 0010 9299 · BIC: CAIXESBBXXX</div>
              </div>
            </div>

            {ed._editMode && <Btn onClick={() => {
              setOrders(p => p.map(o => o.id === ed.id ? {...o, invoiceNumber:ed.invoiceNumber||invNumber, invoiceDate:ed.invoiceDate||invDate, taxRate} : o));
              logOrderChange(ed.id, "Factura editada", "Número: "+invNumber+" · IVA: "+taxRate+"%");
              setEd(p => ({...p, _editMode: false}));
            }} style={{width:"100%"}}>💾 Guardar factura</Btn>}
            </>;
          })()}

          {/* NEW FAQ */}
          {modal === "newDefect" && <>
            <div style={{fontSize:14,fontFamily:DP,color:C.dk,fontWeight:600,marginBottom:14}}>{t("reportarDefecto")}</div>
            <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:6}}>Selecciona el diseño</div>
            {!ed.model ? <>
              <input placeholder={t("rechercher")+"..."} value={ed._search||""} onChange={e => setEd(p => ({...p, _search:e.target.value}))} style={{width:"100%",padding:"9px 12px",border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",marginBottom:8}} />
              <div style={{maxHeight:250,overflowY:"auto",border:"1px solid "+C.ln,borderRadius:4,background:C.wh}}>
                {products.filter(p => !ed._search || (p.model+" "+p.color).toLowerCase().includes((ed._search||"").toLowerCase())).slice(0,30).map((p,i) => (
                  <div key={i} onClick={() => setEd(prev => ({...prev, model:p.model, color:p.color, sku:p.sku, _search:""}))} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderBottom:"1px solid "+C.bg2,cursor:"pointer",fontSize:12,fontFamily:BD}} onMouseEnter={e => e.currentTarget.style.background=C.bg} onMouseLeave={e => e.currentTarget.style.background=""}>
                    <span style={{fontWeight:600,color:C.dk}}>{p.model}</span>
                    <span style={{color:C.gr}}>{p.color}</span>
                    <span style={{fontSize:9,color:C.gr,marginLeft:"auto"}}>{p.sku} · {p.col}</span>
                  </div>
                ))}
              </div>
            </> : <>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:C.bg,borderRadius:6,marginBottom:12}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontFamily:BD,fontWeight:700,color:C.dk}}>{ed.model} {ed.color}</div>
                  <div style={{fontSize:10,fontFamily:BD,color:C.gr}}>{ed.sku}</div>
                </div>
                <button onClick={() => setEd(p => ({...p, model:"", color:"", sku:""}))} style={{background:"none",border:"none",color:C.rd,cursor:"pointer",fontSize:12,fontFamily:BD}}>✕ Cambiar</button>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>Cantidad defectuosa</div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <button onClick={() => setEd(p => ({...p, quantity:Math.max(1,p.quantity-1)}))} style={{width:30,height:30,background:C.bg,border:"1px solid "+C.ln,borderRadius:4,cursor:"pointer",fontSize:14,color:C.dk}}>-</button>
                  <span style={{fontSize:18,fontFamily:BD,fontWeight:700,color:C.dk,minWidth:30,textAlign:"center"}}>{ed.quantity}</span>
                  <button onClick={() => setEd(p => ({...p, quantity:p.quantity+1}))} style={{width:30,height:30,background:C.bg,border:"1px solid "+C.ln,borderRadius:4,cursor:"pointer",fontSize:14,color:C.dk}}>+</button>
                </div>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("descripcionDefecto")}</div>
                <textarea value={ed.description||""} onChange={e => setEd(p => ({...p, description:e.target.value}))} rows={3} placeholder="Ej: Patilla torcida, lente rayada, color desigual..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
              </div>
              <Btn onClick={async () => { if (!ed.model) return; await dbAddDefective(ed); setModal(null); }}>{t("reportarDefecto")}</Btn>
            </>}
          </>}

          {modal === "newFaq" && <>
            {["fr","es","en","it"].map(l => (
              <div key={l} style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("questionLabel")} ({l.toUpperCase()})</div>
                <input value={(ed.q && ed.q[l]) || ""} onChange={e => setEd(p => ({...p, q:{...(p.q||{}), [l]:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4,marginTop:8}}>{t("reponseLabel")} ({l.toUpperCase()})</div>
                <textarea value={(ed.a && ed.a[l]) || ""} onChange={e => setEd(p => ({...p, a:{...(p.a||{}), [l]:e.target.value}}))} rows={2} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
              </div>
            ))}
            <Btn onClick={() => { if(ed.q && ed.q.fr){ const nf = {...ed, id:Date.now(), on:true}; setFaqs(p => [...p, nf]); dbSaveFaq(nf); setModal(null); }}} style={{width:"100%"}}>{t("enregistrer")}</Btn>
          </>}

          {/* EDIT FAQ */}
          {modal === "editFaq" && <>
            {["fr","es","en","it"].map(l => (
              <div key={l} style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("questionLabel")} ({l.toUpperCase()})</div>
                <input value={(ed.q && ed.q[l]) || ""} onChange={e => setEd(p => ({...p, q:{...(p.q||{}), [l]:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4,marginTop:8}}>{t("reponseLabel")} ({l.toUpperCase()})</div>
                <textarea value={(ed.a && ed.a[l]) || ""} onChange={e => setEd(p => ({...p, a:{...(p.a||{}), [l]:e.target.value}}))} rows={2} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
              </div>
            ))}
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={() => { setFaqs(p => p.map(f => f.id === ed.id ? {...ed} : f)); dbUpdateFaq(ed); setModal(null); }} style={{flex:1}}>{t("enregistrer")}</Btn>
              <Btn ghost onClick={() => { const tf={...ed,on:!ed.on}; setFaqs(p => p.map(f => f.id === tf.id ? {...f, on:tf.on} : f)); dbUpdateFaq(tf); setModal(null); }}>{ed.on ? t("desactiver") : t("userActif")}</Btn>
            </div>
          </>}

          {/* VIEW DISTRIBUTOR */}
          {modal === "viewDist" && <>
            <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:4}}>
              <div style={{width:36,height:36,borderRadius:18,background:C.bl+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,fontFamily:BD,color:C.bl}}>{ed.name?.[0]||"?"}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:16,fontFamily:DP,color:C.dk,fontWeight:600}}>{ed.co || ed.name}</div>
                <div style={{fontSize:11,fontFamily:BD,color:C.gr}}>{ed.name} · {ed.email} · {ed.commRate||15}%{ed.city?" · "+ed.city:""}{ed.country?" ("+ed.country+")":""}</div>
              </div>
              {role==="admin" && <button onClick={() => setEd(p => ({...p, _tab:"edit"}))} style={{fontSize:10,fontFamily:BD,color:C.bl,background:C.bl+"12",border:"1px solid "+C.bl+"30",borderRadius:4,padding:"6px 12px",cursor:"pointer",fontWeight:500}}>{t("editer")}</button>}
            </div>
            <div style={{display:"flex",gap:4,margin:"12px 0",borderBottom:"1px solid "+C.ln,overflowX:"auto"}}>
              {[["resume",t("resumeClient")],["clients",t("clients")],["orders",t("commandes")],...(role==="admin"?[["liquid",t("liquidaciones")],["edit",t("editer")]]:[]),["notes",t("notesDistrib")]].map(([v,l]) => (
                <button key={v} onClick={() => setEd(p => ({...p, _tab:v}))} style={{padding:"8px 14px",background:"none",border:"none",borderBottom:"2px solid "+((ed._tab||"resume")===v?C.dk:"transparent"),cursor:"pointer",fontSize:11,fontFamily:BD,fontWeight:(ed._tab||"resume")===v?600:400,color:(ed._tab||"resume")===v?C.dk:C.gr,whiteSpace:"nowrap"}}>{l}</button>
              ))}
            </div>

            {(ed._tab||"resume") === "resume" && <>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:8,marginBottom:16}}>
                {renderKPI(t("clients"), String(ed._dClients.length))}
                {renderKPI(t("commandes"), String(ed._dOrders.length))}
                {renderKPI(t("ventesTotal"), fmt(ed._dSales)+" €", C.gn)}
                {role === "admin" && renderKPI(t("commGeneree"), fmt(ed._dComm)+" €", C.bl)}
                {role === "admin" && renderKPI(t("commPayee"), fmt(ed._dPaid)+" €", C.gn)}
                {role === "admin" && renderKPI(t("commDue"), fmt(ed._dComm - ed._dPaid)+" €", ed._dComm - ed._dPaid > 0 ? C.yl : C.gn)}
              </div>
              <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:8}}>{t("dernieresCmd")}</div>
              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden",maxHeight:200,overflowY:"auto"}}>
                {ed._dOrders.slice(0,5).map((o,i) => (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",borderBottom:"1px solid "+C.bg2}}>
                    <span style={{fontSize:12,fontFamily:DP,color:C.dk,fontWeight:600}}>{o.id}</span>
                    <span style={{fontSize:11,fontFamily:BD,color:C.gr,flex:1}}>{o.client} · {o.date}</span>
                    <span style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600}}>{fmt(o.total)} €</span>
                    <Badge l={SL[o.status]} c={SC[o.status]} />
                  </div>
                ))}
                {ed._dOrders.length === 0 && <div style={{padding:20,textAlign:"center",fontSize:12,fontFamily:BD,color:C.gr2}}>—</div>}
              </div>
            </>}

            {ed._tab === "clients" && <>
              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>
                {ed._dClients.map((c,i) => {
                  const clOrds = ed._dOrders.filter(o => o.client === c.name);
                  const clTotal = clOrds.reduce((s,o) => s+o.total, 0);
                  return (
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderBottom:"1px solid "+C.bg2}}>
                      <div style={{flex:1}}><div style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:600}}>{c.name}</div><div style={{fontSize:10,fontFamily:BD,color:C.gr}}>{c.contact} · {c.city}</div></div>
                      <span style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600}}>{clOrds.length} cmd · {fmt(clTotal)} €</span>
                      <Badge l={c.status==="prospect"?t("prospect"):t("actif")} c={c.status==="prospect"?C.yl:C.gn} />
                    </div>
                  );
                })}
                {ed._dClients.length === 0 && <div style={{padding:20,textAlign:"center",fontSize:12,fontFamily:BD,color:C.gr2}}>—</div>}
              </div>
            </>}

            {ed._tab === "orders" && <>
              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden",maxHeight:350,overflowY:"auto"}}>
                {ed._dOrders.map((o,i) => (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderBottom:"1px solid "+C.bg2,cursor:"pointer"}} onClick={() => { setModal("viewOrd"); setEd({...o, idx:orders.indexOf(o)}); }}>
                    <span style={{fontSize:13,fontFamily:DP,color:C.dk,fontWeight:600}}>{o.id}</span>
                    <span style={{fontSize:11,fontFamily:BD,color:C.gr,flex:1}}>{o.client} · {o.date}</span>
                    <span style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600}}>{o.items} uds · {fmt(o.total)} €</span>
                    <Badge l={SL[o.status]} c={SC[o.status]} />
                    <Badge l={PL[o.pay]} c={PC[o.pay]} />
                  </div>
                ))}
                {ed._dOrders.length === 0 && <div style={{padding:20,textAlign:"center",fontSize:12,fontFamily:BD,color:C.gr2}}>—</div>}
              </div>
            </>}

            {ed._tab === "liquid" && <>
              <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginBottom:12}}>{t("noLiquidaciones")}</div>
              <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:14}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                  {renderKPI(t("commGeneree"), fmt(ed._dComm)+" €", C.bl)}
                  {renderKPI(t("commPayee"), fmt(ed._dPaid)+" €", C.gn)}
                  {renderKPI(t("commDue"), fmt(ed._dComm-ed._dPaid)+" €", C.yl)}
                </div>
              </div>
            </>}

            {ed._tab === "notes" && <>
              <textarea value={ed.distNotes||""} onChange={e => setEd(p => ({...p, distNotes:e.target.value}))} rows={6} placeholder="..." style={{width:"100%",padding:12,border:"1px solid "+C.ln,borderRadius:6,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical",lineHeight:1.6}} />
              <Btn onClick={() => { setPrivateNotes(p => ({...p, ["dist_"+ed.email]:ed.distNotes})); if(user) dbSavePrivateNote(user.email, "dist_"+ed.email, ed.distNotes||""); setModal(null); }} style={{width:"100%",marginTop:8}}>{t("enregistrer")}</Btn>
            </>}

            {ed._tab === "edit" && <>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 14px"}}>
                <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("contact")}</div><input value={ed.name||""} onChange={e => setEd(p => ({...p, name:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
                <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("entreprise")}</div><input value={ed.co||""} onChange={e => setEd(p => ({...p, co:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
                <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("email")}</div><input value={ed.email||""} disabled style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg+"80",color:C.gr,boxSizing:"border-box"}} /></div>
                <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("telephone")}</div><input value={ed.phone||""} onChange={e => setEd(p => ({...p, phone:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
                <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("ville")}</div><input value={ed.city||""} onChange={e => setEd(p => ({...p, city:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
                <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("pays")}</div><input value={ed.country||""} onChange={e => setEd(p => ({...p, country:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
                <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("commission")} %</div><input type="number" value={ed.commRate||""} onChange={e => setEd(p => ({...p, commRate:Number(e.target.value)}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
                <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("langue")}</div><select value={ed.lang||"fr"} onChange={e => setEd(p => ({...p, lang:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}}><option value="fr">Français</option><option value="es">Español</option><option value="en">English</option><option value="it">Italiano</option></select></div>
              </div>
              <div style={{fontSize:11,fontFamily:BD,fontWeight:600,color:C.dk,margin:"16px 0 8px"}}>{t("datosFacturacion")}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 14px"}}>
                <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>VAT / NIF</div><input value={ed.vatId||""} onChange={e => setEd(p => ({...p, vatId:e.target.value}))} placeholder="IT01234567890" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
                <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("adresse")}</div><input value={ed.address||""} onChange={e => setEd(p => ({...p, address:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
                <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>IBAN</div><input value={ed.iban||""} onChange={e => setEd(p => ({...p, iban:e.target.value}))} placeholder="IT60..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
                <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>BIC / SWIFT</div><input value={ed.bic||""} onChange={e => setEd(p => ({...p, bic:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              </div>
              <Btn onClick={() => { const upd = {...ed, origEmail:ed.email}; setUsers(p => p.map(u => u.email===ed.email?{...u,name:ed.name,co:ed.co,phone:ed.phone,city:ed.city,country:ed.country,commRate:ed.commRate,lang:ed.lang,notes:"VAT:"+( ed.vatId||"")+"\\nAddr:"+(ed.address||"")+"\\nIBAN:"+(ed.iban||"")+"\\nBIC:"+(ed.bic||"")}:u)); dbUpdateUser({...upd,notes:"VAT:"+(ed.vatId||"")+"\\nAddr:"+(ed.address||"")+"\\nIBAN:"+(ed.iban||"")+"\\nBIC:"+(ed.bic||"")}); setModal(null); }} style={{width:"100%",marginTop:14}}>{t("enregistrer")}</Btn>
            </>}
          </>}

          {/* NEW DISTRIBUTOR */}
          {modal === "newDist" && <>
            <div style={{fontSize:15,fontFamily:DP,fontWeight:600,color:C.dk,marginBottom:16}}>+ {t("distributeur")}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 14px"}}>
              <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("contact")} *</div><input value={ed.name||""} onChange={e => setEd(p => ({...p, name:e.target.value}))} placeholder="Marcelo Rossi" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("entreprise")} *</div><input value={ed.co||""} onChange={e => setEd(p => ({...p, co:e.target.value}))} placeholder="Ottica Milano" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("email")} *</div><input value={ed.email||""} onChange={e => setEd(p => ({...p, email:e.target.value}))} placeholder="marcelo@ottica.it" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("motDePasse")} *</div><input value={ed.pw||""} onChange={e => setEd(p => ({...p, pw:e.target.value}))} placeholder="min. 8" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("telephone")}</div><input value={ed.phone||""} onChange={e => setEd(p => ({...p, phone:e.target.value}))} placeholder="+39..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("ville")}</div><input value={ed.city||""} onChange={e => setEd(p => ({...p, city:e.target.value}))} placeholder="Milano" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("pays")}</div><input value={ed.country||""} onChange={e => setEd(p => ({...p, country:e.target.value}))} placeholder="IT" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("commission")} %</div><input type="number" value={ed.commRate||""} onChange={e => setEd(p => ({...p, commRate:e.target.value}))} placeholder="15" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("langue")}</div><select value={ed.lang||"fr"} onChange={e => setEd(p => ({...p, lang:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}}><option value="fr">Français</option><option value="es">Español</option><option value="en">English</option><option value="it">Italiano</option></select></div>
            </div>
            <div style={{fontSize:11,fontFamily:BD,fontWeight:600,color:C.dk,margin:"16px 0 8px"}}>{t("datosFacturacion")} ({t("nouveau")})</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 14px"}}>
              <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>VAT / NIF</div><input value={ed.vatId||""} onChange={e => setEd(p => ({...p, vatId:e.target.value}))} placeholder="IT01234567890" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("adresse")}</div><input value={ed.address||""} onChange={e => setEd(p => ({...p, address:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>IBAN</div><input value={ed.iban||""} onChange={e => setEd(p => ({...p, iban:e.target.value}))} placeholder="IT60..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              <div><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>BIC / SWIFT</div><input value={ed.bic||""} onChange={e => setEd(p => ({...p, bic:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
            </div>
            {loginErr && <div style={{fontSize:11,color:"#e74c3c",fontFamily:BD,marginTop:10}}>{loginErr}</div>}
            <Btn onClick={() => { if(!ed.name||!ed.email||!ed.pw){setLoginErr(t("errLogin"));return;} if(users.find(u=>u.email.toLowerCase()===ed.email.toLowerCase())){setLoginErr("Email exists");return;} const nu={email:ed.email,pw:ed.pw,role:"distributor",name:ed.name,co:ed.co,lang:ed.lang||"it",commRate:Number(ed.commRate)||15,active:true,phone:ed.phone,city:ed.city,country:ed.country,notes:"VAT:"+(ed.vatId||"")+"\\nAddr:"+(ed.address||"")+"\\nIBAN:"+(ed.iban||"")+"\\nBIC:"+(ed.bic||"")}; setUsers(p=>[...p,nu]); dbSaveUser(nu); setLoginErr(""); setModal(null); }} style={{width:"100%",marginTop:14}}>{t("enregistrer")}</Btn>
          </>}
          {/* ADD RECOMMENDATION MODAL */}
          {modal === "addRecommendation" && <>
            <div style={{fontSize:15,fontFamily:DP,fontWeight:600,color:C.dk,marginBottom:4}}>{t("agregarRec")}</div>
            <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginBottom:14}}>Selecciona los diseños que quieres recomendar a este cliente</div>
            <input placeholder="🔍 Buscar..." value={ed._recSearch||""} onChange={e => setEd(p => ({...p, _recSearch:e.target.value}))} style={{width:"100%",padding:"8px 12px",border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,marginBottom:12,boxSizing:"border-box"}} />
            <div style={{maxHeight:"50vh",overflowY:"auto",background:C.wh,border:"1px solid "+C.ln,borderRadius:6,padding:8}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:8}}>
                {products.filter(p => {
                  const inRecs = (recommendations[ed._recClient]||[]).includes(p.id);
                  if (inRecs) return false;
                  if (!ed._recSearch) return true;
                  const s = ed._recSearch.toLowerCase();
                  return p.model.toLowerCase().includes(s) || p.color.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s);
                }).slice(0,60).map(p => <div key={p.id} onClick={() => { dbAddRecommendation(ed._recClient, p.id); }} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden",cursor:"pointer",position:"relative"}}>
                  <div style={{height:80,background:C.wh,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                    {p.imageUrl ? <img src={p.imageUrl} style={{width:"100%",height:"100%",objectFit:"contain",padding:6}} /> : <span style={{fontSize:14,color:C.ln,fontFamily:DP}}>MINUË</span>}
                  </div>
                  <div style={{padding:"6px 8px",background:"#faf6f1"}}>
                    <div style={{fontSize:10,fontWeight:600,fontFamily:BD,color:C.dk}}>{p.model}</div>
                    <div style={{fontSize:9,fontFamily:BD,color:C.gr}}>{p.color}</div>
                    <div style={{fontSize:9,fontFamily:BD,color:C.bl,marginTop:4,fontWeight:600}}>+ Añadir</div>
                  </div>
                </div>)}
              </div>
            </div>
            <div style={{display:"flex",gap:8,marginTop:12}}>
              {role === "client" && ed.lines && ed.lines.length > 0 && <Btn onClick={() => {
                const newCart = {};
                ed.lines.forEach(l => {
                  const prod = products.find(p => p.model === l.model && p.color === l.color);
                  if (prod) newCart[prod.id] = (newCart[prod.id]||0) + l.qty;
                });
                setCart(newCart);
                setModal(null);
                setView("c-cart");
              }} style={{flex:1,background:CL.gn,borderColor:CL.gn}}>🔄 Repetir pedido</Btn>}
              <Btn onClick={() => setModal(null)} style={{flex:1}}>{t("fermer")}</Btn>
            </div>
          </>}

          {/* NEW PACKAGING */}
          {modal === "newPack" && <>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("packType")}</div>
              <select value={ed.type} onChange={e => setEd(p => ({...p, type:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                <option value="Étui">Étui / Funda</option><option value="Display">Display / Expositor</option><option value="Merchandising">Merchandising</option>
              </select>
            </div>
            {["fr","es","en","it"].map(l => (
              <div key={l} style={{marginBottom:10}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("nom")} ({l.toUpperCase()})</div>
                <input value={(ed.name&&ed.name[l])||""} onChange={e => setEd(p => ({...p, name:{...(p.name||{}), [l]:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4,marginTop:6}}>{t("packDesc")} ({l.toUpperCase()})</div>
                <textarea value={(ed.desc&&ed.desc[l])||""} onChange={e => setEd(p => ({...p, desc:{...(p.desc||{}), [l]:e.target.value}}))} rows={2} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
              </div>
            ))}
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>Image URL</div>
              <input value={ed.imageUrl||""} onChange={e => setEd(p => ({...p, imageUrl:e.target.value}))} placeholder="https://..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <Btn onClick={() => { const np = {...ed, id:Date.now(), on:true}; setPackItems(p => [...p, np]); dbSavePackaging(np); setModal(null); }} style={{width:"100%"}}>{t("enregistrer")}</Btn>
          </>}

          {/* EDIT PACKAGING */}
          {modal === "editPack" && <>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("packType")}</div>
              <select value={ed.type} onChange={e => setEd(p => ({...p, type:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                <option value="Étui">Étui / Funda</option><option value="Display">Display / Expositor</option><option value="Merchandising">Merchandising</option>
              </select>
            </div>
            {["fr","es","en","it"].map(l => (
              <div key={l} style={{marginBottom:10}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("nom")} ({l.toUpperCase()})</div>
                <input value={(ed.name&&ed.name[l])||""} onChange={e => setEd(p => ({...p, name:{...(p.name||{}), [l]:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4,marginTop:6}}>{t("packDesc")} ({l.toUpperCase()})</div>
                <textarea value={(ed.desc&&ed.desc[l])||""} onChange={e => setEd(p => ({...p, desc:{...(p.desc||{}), [l]:e.target.value}}))} rows={2} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
              </div>
            ))}
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>Image URL</div>
              <input value={ed.imageUrl||""} onChange={e => setEd(p => ({...p, imageUrl:e.target.value}))} placeholder="https://..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={() => { setPackItems(p => p.map(pk => pk.id === ed.id ? {...ed} : pk)); dbUpdatePackaging(ed); setModal(null); }} style={{flex:1}}>{t("enregistrer")}</Btn>
              <Btn ghost onClick={() => { const toggled = {...ed, on:!ed.on}; setPackItems(p => p.map(pk => pk.id === ed.id ? toggled : pk)); dbUpdatePackaging(toggled); setModal(null); }}>{ed.on ? t("desactiver") : t("userActif")}</Btn>
              <Btn ghost onClick={() => askConfirm(t("confirmarEliminar"), () => { setPackItems(p => p.filter(pk => pk.id !== ed.id)); dbDeletePackaging(ed.id); setModal(null); })} style={{color:C.rd,borderColor:C.rd}}>✕</Btn>
            </div>
          </>}

          {/* NEW TASK */}
          {modal === "newProspect" && <>
            <div style={{fontSize:15,fontFamily:DP,fontWeight:600,color:C.dk,marginBottom:16}}>🎯 {ed._editing ? (t("modifier")||"Editar") : t("nuevoProspecto")}</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {role === "admin" && !ed._byDist && <div><div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:4,fontWeight:600}}>DISTRIBUIDOR *</div>
                <select value={ed.distributor||""} onChange={e => setEd(p => ({...p, distributor:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  {users.filter(u => u.role === "distributor").map(u => <option key={u.email} value={u.co}>{u.co} ({u.name})</option>)}
                </select>
              </div>}
              <div><div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:4,fontWeight:600}}>{t("nomBoutique")||"NOMBRE"} *</div><input value={ed.name||""} onChange={e => setEd(p => ({...p, name:e.target.value}))} placeholder="Óptica Bella Vista" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:4,fontWeight:600}}>{t("ville")||"CIUDAD"}</div><input value={ed.city||""} onChange={e => setEd(p => ({...p, city:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
                <div><div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:4,fontWeight:600}}>{t("pays")||"PAÍS"}</div><input value={ed.country||""} onChange={e => setEd(p => ({...p, country:e.target.value}))} placeholder="IT" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:4,fontWeight:600}}>EMAIL</div><input value={ed.email||""} onChange={e => setEd(p => ({...p, email:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
                <div><div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:4,fontWeight:600}}>{t("telephone")||"TELÉFONO"}</div><input value={ed.phone||""} onChange={e => setEd(p => ({...p, phone:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:4,fontWeight:600}}>WEB</div><input value={ed.web||""} onChange={e => setEd(p => ({...p, web:e.target.value}))} placeholder="boutique.com" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
                <div><div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:4,fontWeight:600}}>INSTAGRAM</div><input value={ed.instagram||""} onChange={e => setEd(p => ({...p, instagram:e.target.value}))} placeholder="@boutique" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              </div>
              {(role === "admin") && <div><div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:4,fontWeight:600}}>{t("notaMinue").toUpperCase()}</div><textarea value={ed.noteAdmin||""} onChange={e => setEd(p => ({...p, noteAdmin:e.target.value}))} rows={2} placeholder="Contactar de mi parte, conocí al dueño en SILMO..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} /></div>}
            </div>
            <Btn disabled={!ed.name || !ed.distributor} onClick={async () => {
              if (ed._editing) { const np = {...ed}; delete np._editing; delete np._pDist; setProspects(x => x.map(y => y.id===ed.id?np:y)); dbUpdateProspect(np); toast(t("borradorGuardado")||"Guardado"); }
              else { const tempId = "tmp-"+Date.now(); const np = {id:tempId, distributor:ed.distributor, name:ed.name, city:ed.city||"", country:ed.country||"", email:ed.email||"", phone:ed.phone||"", web:ed.web||"", instagram:ed.instagram||"", noteAdmin:ed.noteAdmin||"", noteDist:ed.noteDist||"", stage:"nuevo"}; setProspects(x => [np, ...x]); const saved = await dbSaveProspect(np); if (saved) setProspects(x => x.map(y => y.id===tempId?saved:y)); toast(t("prospectoCreado")); }
              setModal(null);
            }} style={{width:"100%",marginTop:14}}>{t("enregistrer")}</Btn>
          </>}

          {modal === "newFixedCost" && <>
            <div style={{fontSize:15,fontFamily:DP,fontWeight:600,color:C.dk,marginBottom:16}}>🏢 Nuevo coste fijo</div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div><div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:4,fontWeight:600}}>NOMBRE *</div><input value={ed.name||""} onChange={e => setEd(p => ({...p, name:e.target.value}))} placeholder="ej: Alquiler almacén, Vercel, Gestoría..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              <div><div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:4,fontWeight:600}}>CATEGORÍA</div>
                <select value={ed.category||"fijos"} onChange={e => setEd(p => ({...p, category:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  <option value="fijos">Fijos (alquiler, suministros, seguros)</option>
                  <option value="tecnologia">Tecnología (SaaS, dominio, servidor)</option>
                  <option value="personal">Personal (salarios, freelancers)</option>
                  <option value="marketing">Marketing (ads, ferias)</option>
                  <option value="operacion">Operación</option>
                  <option value="impuestos">Impuestos</option>
                  <option value="otros">Otros</option>
                </select>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:4,fontWeight:600}}>IMPORTE (€) *</div><input type="number" step="0.01" value={ed.amount||""} onChange={e => setEd(p => ({...p, amount:parseFloat(e.target.value)||0}))} placeholder="0.00" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
                <div><div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:4,fontWeight:600}}>FRECUENCIA</div>
                  <select value={ed.frequency||"monthly"} onChange={e => setEd(p => ({...p, frequency:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                    <option value="monthly">Mensual</option>
                    <option value="quarterly">Trimestral</option>
                    <option value="yearly">Anual</option>
                  </select>
                </div>
              </div>
            </div>
            <Btn disabled={!ed.name || !ed.amount} onClick={async () => { const tempId = Date.now(); const nf = {id:tempId, name:ed.name, category:ed.category||"fijos", amount:ed.amount, frequency:ed.frequency||"monthly"}; setFixedCosts(p => [...p, nf]); const dbId = await dbSaveFixedCost(nf); if (dbId) setFixedCosts(p => p.map(x => x.id===tempId ? {...x, id:dbId} : x)); setModal(null); }} style={{width:"100%",marginTop:16}}>Guardar coste fijo</Btn>
          </>}

          {modal === "newTask" && <>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("titreTache")}</div>
              <input value={ed.title||""} onChange={e => setEd(p => ({...p, title:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("descTache")}</div>
              <textarea value={ed.desc||""} onChange={e => setEd(p => ({...p, desc:e.target.value}))} rows={2} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 10px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("echeance")}</div>
                <input type="date" value={ed.dueDate||""} onChange={e => setEd(p => ({...p, dueDate:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("assignee")}</div>
                <input value={ed.assignee||""} onChange={e => setEd(p => ({...p, assignee:e.target.value}))} placeholder="Alejandro, Marc..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:"0 10px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("priorite")}</div>
                <select value={ed.priority||"moyenne"} onChange={e => setEd(p => ({...p, priority:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  <option value="haute">{t("haute")}</option><option value="moyenne">{t("moyenne")}</option><option value="basse">{t("basse")}</option>
                </select>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("area")}</div>
                <select value={ed.area||"commercial"} onChange={e => setEd(p => ({...p, area:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  {["commercial","finances","marketing","produits","clientsArea","logistique","defectos","proveedor","admin"].map(a => <option key={a} value={a}>{t(a)}</option>)}
                </select>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>Status</div>
                <select value={ed.status||"aFaire"} onChange={e => setEd(p => ({...p, status:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  <option value="aFaire">{t("aFaire")}</option><option value="enCours">{t("enCours")}</option><option value="fait">{t("fait")}</option>
                </select>
              </div>
            </div>
            <Btn onClick={() => { if(ed.title){ setTasks(p => [...p, {...ed, id:p.length+10, date:new Date().toLocaleDateString("fr-FR")}]); dbSaveTask(ed); setModal(null); }}} style={{width:"100%"}}>{t("enregistrer")}</Btn>
          </>}

          {/* EDIT TASK */}
          {modal === "editTask" && <>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("titreTache")}</div>
              <input value={ed.title||""} onChange={e => setEd(p => ({...p, title:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("descTache")}</div>
              <textarea value={ed.desc||""} onChange={e => setEd(p => ({...p, desc:e.target.value}))} rows={2} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 10px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("echeance")}</div>
                <input type="date" value={ed.dueDate||""} onChange={e => setEd(p => ({...p, dueDate:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("assignee")}</div>
                <input value={ed.assignee||""} onChange={e => setEd(p => ({...p, assignee:e.target.value}))} placeholder="Alejandro, Marc..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:"0 10px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("priorite")}</div>
                <select value={ed.priority||"moyenne"} onChange={e => setEd(p => ({...p, priority:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  <option value="haute">{t("haute")}</option><option value="moyenne">{t("moyenne")}</option><option value="basse">{t("basse")}</option>
                </select>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("area")}</div>
                <select value={ed.area||"commercial"} onChange={e => setEd(p => ({...p, area:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  {["commercial","finances","marketing","produits","clientsArea","logistique","defectos","proveedor","admin"].map(a => <option key={a} value={a}>{t(a)}</option>)}
                </select>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>Status</div>
                <select value={ed.status||"aFaire"} onChange={e => setEd(p => ({...p, status:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  <option value="aFaire">{t("aFaire")}</option><option value="enCours">{t("enCours")}</option><option value="fait">{t("fait")}</option>
                </select>
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={() => { setTasks(p => p.map(tk => tk.id === ed.id ? {...ed} : tk)); dbUpdateTask(ed); setModal(null); }} style={{flex:1}}>{t("enregistrer")}</Btn>
              <Btn ghost onClick={() => { setTasks(p => p.filter(tk => tk.id !== ed.id)); dbDeleteTask(ed.id); setModal(null); }} style={{color:C.rd,borderColor:C.rd}}>{t("eliminarTarea")}</Btn>
            </div>
          </>}
        </div>
      </div>
    );
  };

  /* ═══ PROMO CARD RENDERER ═══ */
  const renderPromoCard = (p, i, canEdit) => (
    <div key={i} style={{background:C.wh,border:"1px solid "+(p.on?C.gn+"40":C.ln),borderRadius:6,padding:22,opacity:p.on?1:0.5,cursor:canEdit?"pointer":"default"}} onClick={() => { if(canEdit){ setModal("editPromo"); setEd({...p}); }}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{fontSize:15,fontWeight:500,fontFamily:DP,color:C.dk}}>{p.name}</span>
        <Badge l={p.on?t("active"):t("inactive")} c={p.on?C.gn:C.gr} />
      </div>
      <div style={{fontSize:24,fontWeight:300,fontFamily:DP,color:C.gn,marginBottom:6}}>{p.type==="percent"?"-"+p.disc+" %":t("cadeau")}</div>
      <div style={{fontSize:11,color:C.gr,fontFamily:BD}}>{(p.cond && p.cond[lang]) || (p.cond && p.cond.fr) || ""}</div>
      {canEdit && <div style={{display:"flex",gap:4,marginTop:8,flexWrap:"wrap"}}>{(p.visible||[]).map(v => <Badge key={v} l={v==="distributor"?t("distributeur"):t("client")} c={v==="distributor"?C.bl:C.gn} />)}{p.targetClients && p.targetClients.length > 0 && <span style={{fontSize:9,fontFamily:BD,color:C.bl,padding:"2px 6px",background:C.bl+"15",borderRadius:3}}>{p.targetClients.join(", ")}</span>}</div>}
    </div>
  );

  /* ═══ MAIN RENDER ═══ */
  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:BD,paddingBottom:70}}>
      {renderNav()}

      {/* NOTIF OVERLAY */}
      {notifOpen && <div style={{position:"fixed",inset:0,zIndex:90}} onClick={() => setNotifOpen(false)} />}
      {moreOpen && <div style={{position:"fixed",inset:0,zIndex:130}} onClick={() => setMoreOpen(false)} />}

      {/* PROFILE POPUP */}
      {profileOpen && <div style={{position:"fixed",inset:0,zIndex:180}} onClick={() => setProfileOpen(false)}>
        <div style={{position:"absolute",top:52,right:16,width:"min(340px, 85vw)",background:C.wh,borderRadius:8,border:"1px solid "+C.ln,boxShadow:"0 8px 30px rgba(24,51,47,0.12)",overflow:"hidden"}} onClick={e => e.stopPropagation()}>
          <div style={{padding:"20px 20px 16px",background:darkMode?"#1e2d29":CL.dk,color:"#f8efe6"}}>
            <div style={{fontSize:18,fontFamily:DP,fontWeight:500}}>{user.name}</div>
            <div style={{fontSize:11,fontFamily:BD,opacity:0.6,marginTop:2}}>{user.email}</div>
            <div style={{marginTop:8,display:"flex",gap:6,alignItems:"center"}}><Badge l={role==="admin"?"Admin":role==="team"?t("employe"):role==="distributor"?t("distributeur"):t("client")} c={role==="admin"?"#96a5a1":role==="team"?"#a8c8e8":role==="distributor"?C.bl:C.gn} />{role === "client" && activeClient && activeClient.status === "vip" && <span style={{fontSize:9,fontFamily:BD,fontWeight:800,color:"#d4a030",background:"linear-gradient(135deg,#fdf6e3,#f5ecd8)",padding:"3px 10px",borderRadius:4,letterSpacing:2,border:"1px solid #d4a03050"}}>★ VIP</span>}</div>
          </div>
          <div style={{padding:"14px 20px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 12px"}}>
              <div>
                <div style={{fontSize:9,color:C.gr,fontFamily:BD,marginBottom:2,textTransform:"uppercase"}}>{t("entreprise")}</div>
                <div style={{fontSize:12,fontFamily:BD,color:C.dk}}>{user.co || "—"}</div>
              </div>
              <div>
                <div style={{fontSize:9,color:C.gr,fontFamily:BD,marginBottom:2,textTransform:"uppercase"}}>{t("langue")}</div>
                <div style={{fontSize:12,fontFamily:BD,color:C.dk}}>{(user.lang||"fr").toUpperCase()}</div>
              </div>
              {user.city && <div>
                <div style={{fontSize:9,color:C.gr,fontFamily:BD,marginBottom:2,textTransform:"uppercase"}}>{t("ville")}</div>
                <div style={{fontSize:12,fontFamily:BD,color:C.dk}}>{user.city}{user.country ? " ("+user.country+")" : ""}</div>
              </div>}
              {user.phone && <div>
                <div style={{fontSize:9,color:C.gr,fontFamily:BD,marginBottom:2,textTransform:"uppercase"}}>{t("telephone")}</div>
                <div style={{fontSize:12,fontFamily:BD,color:C.dk}}>{user.phone}</div>
              </div>}
            </div>
            <div style={{borderTop:"1px solid "+C.ln,marginTop:12,paddingTop:12,display:"flex",gap:8}}>
              {role !== "admin" && <Btn small ghost onClick={() => { setProfileOpen(false); setView(role==="team"?"e-account":role==="distributor"?"d-account":"c-account"); }}>{t("monCompte")}</Btn>}
              <Btn small ghost onClick={() => { setProfileOpen(false); setUser(null); setCart({}); setLoginEmail(""); setLoginPw(""); try { localStorage.removeItem("minue_session"); localStorage.removeItem("minue_view"); } catch(e) { console.log('DB error:', e); } }} style={{color:C.rd,borderColor:C.rd}}>{t("deconnexion")}</Btn>
            </div>
          </div>
        </div>
      </div>}
      {renderModal()}

      {/* CLIENT VIEWS */}
      {/* CLIENT HOME */}
      {view === "c-home" && <div>
        {/* HERO GREETING */}
        <div style={{padding:"min(44px, 9vw) min(24px, 4vw) min(32px, 6vw)",background:darkMode?"linear-gradient(135deg,#141c1a,#1e2d29)":"linear-gradient(135deg,"+CL.dk+" 0%,#1d4435 60%,"+CL.dk+" 100%)",color:darkMode?"#e8dfd6":CL.bg,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:"-40%",right:"-10%",width:380,height:380,borderRadius:"50%",background:"radial-gradient(circle, rgba(212,160,48,0.14) 0%, transparent 70%)",pointerEvents:"none"}} />
          <div style={{position:"absolute",bottom:"-50%",left:"-5%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle, rgba(248,239,230,0.06) 0%, transparent 70%)",pointerEvents:"none"}} />
          <div style={{position:"relative"}}>
            <div style={{fontSize:"min(30px, 6.5vw)",fontFamily:DP,fontWeight:400,marginBottom:6,letterSpacing:0.5}}>{t("bienvenida")}, {user.name} ✦</div>
            {activeClient && activeClient.status === "vip" && <div style={{marginBottom:8}}><span style={{fontSize:10,fontFamily:BD,fontWeight:800,color:"#d4a030",background:"linear-gradient(135deg,#d4a03015,#c4903a15)",padding:"4px 12px",borderRadius:5,letterSpacing:2,border:"1px solid #d4a03030"}}>★ VIP</span></div>}
            <div style={{fontSize:13,fontFamily:BD,color:"rgba(248,239,230,0.7)",maxWidth:500,lineHeight:1.5}}>{t("bienvenidaSub")}</div>
            <Btn onClick={() => setView("c-cat")} style={{marginTop:16,background:darkMode?"#e8dfd6":CL.bg,color:darkMode?"#141c1a":CL.dk,border:"none"}}>{t("descubrirCol")} →</Btn>
          </div>
        </div>

        {/* ORDER NOTIFICATIONS */}
        <div style={{padding:"20px min(24px, 4vw)"}}>

          {/* 🔔 BACK IN STOCK (waitlist hits) */}
          {(() => {
            const backInStock = productAlerts.filter(a => a.client_email === user.email).map(a => { const p = products.find(x => String(x.id) === String(a.product_id) && x.active !== false && x.stock > 0); return p ? {alert:a, p} : null; }).filter(Boolean);
            return backInStock.length > 0 ? <div style={{background:"linear-gradient(135deg,"+CL.gn+"10,"+CL.gn+"04)",border:"1.5px solid "+CL.gn+"45",borderRadius:14,padding:"16px 18px",marginBottom:18}}>
              <div style={{fontSize:13,fontFamily:BD,fontWeight:700,color:CL.gn,marginBottom:10}}>🎉 {t("haVuelto")}</div>
              <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:4}}>
                {backInStock.map(({alert, p}) => <div key={alert.id} style={{minWidth:170,background:C.wh,border:"1px solid "+C.ln,borderRadius:10,padding:10,flexShrink:0}}>
                  <div style={{height:80,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",marginBottom:6}}>{p.imageUrl ? <img src={p.imageUrl} style={{width:"100%",height:"100%",objectFit:"contain",transform:"scale(1.15)"}} /> : <span style={{fontFamily:DP,color:C.ln}}>MINUË</span>}</div>
                  <div style={{fontSize:12,fontFamily:BD,fontWeight:600,color:C.dk}}>{p.model}</div>
                  <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:8}}>{p.color}</div>
                  <div style={{display:"flex",gap:5}}>
                    <button onClick={() => { addToCart(p.id, 2); dbRemoveAlert(alert.id); toast(t("anadidoAlCarrito")); }} style={{flex:1,padding:"6px 0",background:C.dk,color:C.bg,border:"none",borderRadius:6,fontSize:10,fontFamily:BD,fontWeight:600,cursor:"pointer"}}>+ {t("panier")}</button>
                    <button onClick={() => dbRemoveAlert(alert.id)} style={{padding:"6px 9px",background:"transparent",color:C.gr2,border:"1px solid "+C.ln,borderRadius:6,fontSize:10,cursor:"pointer"}}>✕</button>
                  </div>
                </div>)}
              </div>
            </div> : null;
          })()}

          {/* ✨ NEW SINCE LAST VISIT */}
          {(() => {
          const activeNews = news.filter(n => n.on).sort((a,b) => (b.pinned?1:0)-(a.pinned?1:0)).slice(0,3);
          if (activeNews.length === 0) return null;
          return <div style={{padding:"16px min(24px,4vw) 0"}}>
            <div style={{fontSize:14,fontFamily:DP,fontWeight:600,color:C.dk,marginBottom:10}}>📣 {t("novedadesTendencias")}</div>
            <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8,WebkitOverflowScrolling:"touch"}}>
              {activeNews.map(n => <div key={n.id} onClick={() => n.url ? window.open(n.url,"_blank") : setView(role==="distributor"?"d-news":"c-news")} style={{minWidth:240,maxWidth:300,flexShrink:0,background:"linear-gradient(135deg,"+CL.dk+","+"#1d4435)",borderRadius:14,padding:"16px 18px",cursor:"pointer",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:-30,right:-30,width:110,height:110,borderRadius:"50%",background:"radial-gradient(circle, rgba(196,149,106,0.25), transparent 70%)"}} />
                {n.pinned && <span style={{fontSize:8,fontFamily:BD,fontWeight:800,color:"#c4956a",letterSpacing:1.5,textTransform:"uppercase"}}>★ {t("nuevo")}</span>}
                <div style={{fontSize:14,fontFamily:DP,fontWeight:600,color:"#f8efe6",marginTop:4,lineHeight:1.3}}>{(n.title&&n.title[lang])||(n.title&&n.title.fr)||""}</div>
                <div style={{fontSize:10,fontFamily:BD,color:"#f8efe690",marginTop:6,lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{(n.content&&n.content[lang])||(n.content&&n.content.fr)||""}</div>
                <div style={{fontSize:9,fontFamily:BD,color:"#c4956a",marginTop:8,fontWeight:600}}>{n.date} →</div>
              </div>)}
            </div>
          </div>;
        })()}

        {(() => {
            let seenMax = 0;
            try { seenMax = parseInt(localStorage.getItem("minue_seenmax_"+user.email)) || 0; } catch(e) {}
            const maxId = products.reduce((m,p) => Math.max(m, Number(p.id)||0), 0);
            const newSince = seenMax > 0 ? products.filter(p => p.active !== false && Number(p.id) > seenMax).slice(0,8) : [];
            // Update seen marker (after computing)
            try { if (maxId > 0) localStorage.setItem("minue_seenmax_"+user.email, String(maxId)); } catch(e) {}
            return newSince.length > 0 ? <div style={{marginBottom:18}}>
              <div style={{fontSize:14,fontFamily:DP,fontWeight:600,color:C.dk,marginBottom:10}}>✨ {t("nuevosDesdeVisita")}</div>
              <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:4}}>
                {newSince.map(p => <div key={p.id} onClick={() => { setView("c-cat"); setFilter(p.model); }} style={{minWidth:150,background:C.wh,border:"1px solid "+C.ln,borderRadius:10,padding:10,flexShrink:0,cursor:"pointer",position:"relative"}}>
                  <span style={{position:"absolute",top:8,left:8,fontSize:8,fontFamily:BD,fontWeight:700,color:"#fff",background:"#8e44ad",padding:"2px 7px",borderRadius:3,letterSpacing:0.5,zIndex:1}}>{t("nuevo").toUpperCase()}</span>
                  <div style={{height:80,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",marginBottom:6}}>{p.imageUrl ? <img src={p.imageUrl} style={{width:"100%",height:"100%",objectFit:"contain",transform:"scale(1.15)"}} /> : <span style={{fontFamily:DP,color:C.ln,fontSize:18}}>MINUË</span>}</div>
                  <div style={{fontSize:12,fontFamily:BD,fontWeight:600,color:C.dk}}>{p.model}</div>
                  <div style={{fontSize:10,fontFamily:BD,color:C.gr}}>{p.color}</div>
                </div>)}
              </div>
            </div> : null;
          })()}

          {/* 🔄 TIME TO REORDER */}
          {(() => {
            const myO = orders.filter(o => (o.client === user.co || o.client === user.name) && o.dist !== "Faire");
            if (myO.length === 0) return null;
            const last = myO[0];
            const parts = (last.date||"").split("/");
            const lastTs = parts.length===3 ? new Date(parts[2]+"-"+parts[1].padStart(2,"0")+"-"+parts[0].padStart(2,"0")).getTime() : 0;
            const days = lastTs ? Math.floor((Date.now()-lastTs)/86400000) : 0;
            if (days < 45) return null;
            return <div style={{background:C.wh,border:"1.5px solid #d4a03050",borderRadius:14,padding:"18px 20px",marginBottom:18,display:"flex",alignItems:"center",gap:14,flexWrap:"wrap",boxShadow:"0 2px 14px rgba(212,160,48,0.08)"}}>
              <div style={{fontSize:30}}>🔄</div>
              <div style={{flex:1,minWidth:200}}>
                <div style={{fontSize:14,fontFamily:DP,fontWeight:600,color:C.dk}}>{t("tocaReponer")}</div>
                <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginTop:3,lineHeight:1.5}}>{t("tocaReponerSub").replace("%d",days).replace("%n",last.items)}</div>
              </div>
              <button onClick={() => { const nc = {}; (last.lines||[]).forEach(l => { const p = products.find(x => (x.sku && l.sku && x.sku === l.sku) || (x.model === l.model && x.color === l.color)); if (p && p.active !== false) nc[p.id] = (nc[p.id]||0) + l.qty; }); if (Object.keys(nc).length > 0) { setCart(nc); setView("c-cart"); toast(t("pedidoCargado")); } else { toast(t("modelosNoDisponibles"),"info"); } }} style={{padding:"12px 22px",background:"linear-gradient(135deg,#c4956a,#d4a030)",color:C.dk,border:"none",borderRadius:10,fontSize:12,fontFamily:BD,fontWeight:700,cursor:"pointer",boxShadow:"0 3px 12px rgba(212,160,48,0.3)"}}>{t("repetirUltimoPedido")} →</button>
            </div>;
          })()}

          {/* PAYMENT ACTION REQUIRED */}
          {(() => {
            const pendingPayments = orders.filter(o => (o.client === user.co || o.client === user.name) && o.payMethod && o.pay !== "paid");
            return pendingPayments.length > 0 ? <div style={{marginBottom:20,padding:"18px 22px",background:"linear-gradient(135deg,#fff4cc,#ffe999)",border:"1px solid #f0a020",borderRadius:10,display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
              <div style={{fontSize:28}}>💳</div>
              <div style={{flex:1,minWidth:200}}>
                <div style={{fontSize:14,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:2}}>{pendingPayments.length === 1 ? t("pagoPendiente") : pendingPayments.length+" "+t("pagosPendientes")}</div>
                <div style={{fontSize:11,fontFamily:BD,color:C.dk,lineHeight:1.5}}>{pendingPayments.length === 1 ? pendingPayments[0].id+" · "+fmt(pendingPayments[0].total)+"€ — "+(pendingPayments[0].payMethod==="card"?"💳 "+t("pagarAhora"):pendingPayments[0].payMethod==="sepa"?"SEPA":pendingPayments[0].payMethod==="transfer"?"Transferencia":pendingPayments[0].payMethod==="deferred"?"Aplazado":"Fraccionado") : t("revisaPedidos")}</div>
              </div>
              <button onClick={() => setView("c-ord")} style={{padding:"10px 18px",background:"#18332f",color:"#fff",border:"none",borderRadius:6,fontSize:11,fontFamily:BD,fontWeight:600,cursor:"pointer"}}>{t("verPedido")} →</button>
            </div> : null;
          })()}
          {(() => {
            const myOrders = orders.filter(o => (o.client === user.co || o.client === user.name) && o.dist !== "Faire");
            const totalUnits = myOrders.reduce((s,o) => s+o.items, 0);
            const totalSpent = myOrders.reduce((s,o) => s+o.total, 0);
            const basePrice = 26.90;
            const savings = (totalUnits * basePrice) - totalSpent;
            const tiers = [[10,22.90],[20,19.90],[30,18.90],[40,17.90]];
            const next = tiers.find(([min]) => totalUnits < min);
            const pendingPay = myOrders.filter(o => o.pay === "pending" || o.pay === "due");
            const recentPending = pendingPay.find(o => { if(!o.date) return false; const [d,m,y] = o.date.split("/"); const orderDate = new Date(y, m-1, d); return (new Date() - orderDate) < 7*86400000; });

            return <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12,marginBottom:24}}>
              {/* Next tier progress */}
              {next && customPrice === 0 && priceEssential === 0 && priceIcons === 0 && <div style={{background:"linear-gradient(135deg,"+CL.gn+"12,"+CL.gn+"06)",border:"1px solid "+CL.gn+"30",borderRadius:10,padding:"16px 18px"}}>
                <div style={{fontSize:9,fontFamily:BD,color:CL.gn,letterSpacing:1,fontWeight:600,marginBottom:4}}>{t("proximoTramoLbl")}</div>
                <div style={{fontSize:22,fontFamily:DP,fontWeight:300,color:C.dk,marginBottom:6}}>{next[0]-totalUnits} uds</div>
                <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginBottom:10,lineHeight:1.4}}>{t("paraPrecio")} <span style={{fontWeight:700,color:CL.gn}}>{fmt(next[1])} €{t("porUd")}</span></div>
                <div style={{height:6,background:CL.gn+"15",borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:Math.min(100,(totalUnits/next[0])*100)+"%",background:CL.gn,borderRadius:3}} />
                </div>
                <button onClick={() => setView("c-cat")} style={{marginTop:10,width:"100%",padding:"7px 12px",background:CL.gn,color:"#fff",border:"none",borderRadius:5,fontSize:10,fontFamily:BD,fontWeight:600,cursor:"pointer"}}>{t("seguirComprando")} →</button>
              </div>}
              
              {/* Savings */}
              {savings > 0 && <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:10,padding:"16px 18px"}}>
                <div style={{fontSize:9,fontFamily:BD,color:C.gr,letterSpacing:1,fontWeight:600,marginBottom:4}}>{t("hasAhorrado")}</div>
                <div style={{fontSize:22,fontFamily:DP,fontWeight:300,color:CL.gn,marginBottom:6}}>{fmt(savings)} €</div>
                <div style={{fontSize:11,fontFamily:BD,color:C.gr,lineHeight:1.4}}>{t("vsRetail")}<br/>{t("enUnidadesCompradas").replace("%n",String(totalUnits))}</div>
              </div>}

              {/* Pronto pago opportunity */}
              {recentPending && <div style={{background:"linear-gradient(135deg,#f0a020 08,#f0a02004)",border:"1px solid #f0a02030",borderRadius:10,padding:"16px 18px"}}>
                <div style={{fontSize:9,fontFamily:BD,color:"#c47a00",letterSpacing:1,fontWeight:600,marginBottom:4}}>{t("prontoPagoLbl")}</div>
                <div style={{fontSize:22,fontFamily:DP,fontWeight:300,color:C.dk,marginBottom:6}}>−{fmt(recentPending.total * 0.03)} €</div>
                <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginBottom:10,lineHeight:1.4}}>{t("prontoPagoDesc").replace("%id", recentPending.id)}</div>
                <button onClick={() => { setModal("viewOrd"); setEd({...recentPending}); }} style={{width:"100%",padding:"7px 12px",background:"#f0a020",color:"#fff",border:"none",borderRadius:5,fontSize:10,fontFamily:BD,fontWeight:600,cursor:"pointer"}}>{t("verPedido")} →</button>
              </div>}
            </div>;
          })()}

          {orders.filter(o => (o.client === user.co || o.client === user.name)).length > 0 && <>
            <div style={{fontSize:18,fontFamily:DP,color:C.dk,fontWeight:500,marginBottom:14}}>{t("notifTitre")}</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:28}}>
              {orders.filter(o => (o.client === user.co || o.client === user.name)).slice(0,3).map((o,i) => (
                <div key={i} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={() => { setModal("viewOrd"); setEd({...o, idx:orders.indexOf(o)}); }}>
                  <div style={{background:C.dk+"08",borderRadius:6,padding:"6px 10px"}}>
                    <span style={{fontSize:15,fontFamily:BD,color:C.dk,fontWeight:700,letterSpacing:0.5}}>{o.id}</span>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:500}}>{o.items} {t("unites")} · {fmt(o.total)} €</div>
                    <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:2}}>{o.date}</div>
                  </div>
                  <Badge l={SL[o.status]} c={SC[o.status]} />
                  {o.track && <a href={o.trackUrl||"#"} target="_blank" rel="noreferrer" style={{fontSize:10,fontFamily:BD,color:C.bl,textDecoration:"none",background:C.bl+"10",padding:"4px 8px",borderRadius:4}} onClick={e => e.stopPropagation()}>📦 Track</a>}
                </div>
              ))}
            </div>
          </>}

          {/* TOP VENTAS MARCA */}
          <div style={{fontSize:18,fontFamily:DP,color:C.dk,fontWeight:500,marginBottom:14}}>🔥 {t("topVentas")}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginBottom:24}}>
            {(() => { const sold = {}; orders.forEach(o => (o.lines||[]).forEach(l => { sold[l.model+"|"+l.color] = (sold[l.model+"|"+l.color]||0) + (l.qty||0); })); const topSkus = Object.entries(sold).sort((a,b) => b[1]-a[1]).slice(0,8).map(([k,qty]) => ({k,qty})); const topProds = topSkus.map(({k,qty}) => { const [m,c] = k.split("|"); const p = products.find(x => x.model === m && x.color === c && (role==="admin"||role==="team"||x.active!==false)); return p ? {p,qty} : null; }).filter(Boolean); const display = topProds.length > 0 ? topProds : products.filter(p => (p.tags||[]).includes("top") && (role==="admin"||role==="team"||p.active!==false)).slice(0,8).map(p => ({p,qty:0})); return display.map(({p,qty},i) => (
              <div key={p.id} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,overflow:"hidden",cursor:"pointer",position:"relative"}} onClick={() => { const mg = {model:p.model,col:p.col,colors:products.filter(x=>x.model===p.model),tags:new Set(p.tags||[])}; setSelectedModel(mg); setSelectedColorIdx(mg.colors.findIndex(c=>c.id===p.id)||0); setModal("viewModel"); }}>
                <div style={{position:"absolute",top:6,left:6,width:22,height:22,borderRadius:11,background:C.dk,color:C.bg,fontSize:10,fontWeight:700,fontFamily:BD,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1}}>{i+1}</div>
                <div style={{height:120,background:C.wh,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                  {p.imageUrl ? <img src={p.imageUrl} style={{width:"100%",height:"100%",objectFit:"contain",padding:6}} /> : <span style={{fontSize:20,color:C.ln,fontFamily:DP}}>MINUË</span>}
                </div>
                <div style={{padding:"8px 10px",background:"#faf6f1"}}>
                  <div style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>{p.model}</div>
                  <div style={{fontSize:10,fontFamily:BD,color:C.gr}}>{p.color}</div>
                  {qty > 0 && <div style={{fontSize:9,fontFamily:BD,color:C.gn,marginTop:2,fontWeight:600}}>{qty} vendidos</div>}
                </div>
              </div>
            )); })()}
          </div>

          {/* TOP DEL MES */}
          {(() => { const now = new Date(); const monthStart = new Date(now.getFullYear(),now.getMonth(),1).toLocaleDateString("fr-FR"); const monthOrders = orders.filter(o => { const d = o.date?.split("/"); return d && d.length === 3 && parseInt(d[1]) === now.getMonth()+1 && parseInt(d[2]) === now.getFullYear(); }); const sold = {}; monthOrders.forEach(o => (o.lines||[]).forEach(l => { sold[l.model+"|"+l.color] = (sold[l.model+"|"+l.color]||0) + (l.qty||0); })); const top = Object.entries(sold).sort((a,b) => b[1]-a[1]).slice(0,6).map(([k,qty]) => { const [m,c] = k.split("|"); return {p:products.find(x=>x.model===m&&x.color===c),qty}; }).filter(x=>x.p); return top.length > 0 ? <>
            <div style={{fontSize:18,fontFamily:DP,color:C.dk,fontWeight:500,marginBottom:14}}>📈 Top del mes</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginBottom:24}}>
              {top.map(({p,qty},i) => (
                <div key={p.id} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"12px 14px",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={() => { const mg = {model:p.model,col:p.col,colors:products.filter(x=>x.model===p.model),tags:new Set(p.tags||[])}; setSelectedModel(mg); setSelectedColorIdx(0); setModal("viewModel"); }}>
                  <div style={{width:44,height:44,borderRadius:6,background:C.wh,border:"1px solid "+C.ln,overflow:"hidden",flexShrink:0}}>
                    {p.imageUrl ? <img src={p.imageUrl} style={{width:"100%",height:"100%",objectFit:"contain"}} /> : null}
                  </div>
                  <div>
                    <div style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>{p.model}</div>
                    <div style={{fontSize:10,fontFamily:BD,color:C.gr}}>{p.color}</div>
                    <div style={{fontSize:10,fontFamily:BD,color:C.gn,fontWeight:600}}>{qty} uds</div>
                  </div>
                </div>
              ))}
            </div>
          </> : null; })()}

          {/* RECOMMENDATIONS FROM ADMIN */}
          {(() => { const myRecs = recommendations[user.email]||[]; const recProds = myRecs.map(id => products.find(p => p.id === id)).filter(p => p && p.active !== false); return recProds.length > 0 ? <>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div style={{fontSize:18,fontFamily:DP,color:C.dk,fontWeight:500}}>✨ {t("diseñosRecomendados")}</div>
              <span style={{fontSize:10,fontFamily:BD,color:C.gr}}>Seleccionado para ti por Minuë</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10,marginBottom:24}}>
              {recProds.map(p => <div key={p.id} style={{background:"linear-gradient(135deg,"+C.dk+"05,"+C.gn+"08)",border:"1px solid "+C.gn+"30",borderRadius:8,overflow:"hidden",position:"relative",cursor:"pointer"}} onClick={() => { const mg = {model:p.model,col:p.col,colors:products.filter(x=>x.model===p.model),tags:new Set(p.tags||[])}; setSelectedModel(mg); setSelectedColorIdx(mg.colors.findIndex(c=>c.id===p.id)||0); setModal("viewModel"); }}>
                <div style={{position:"absolute",top:6,left:6,fontSize:8,fontFamily:BD,fontWeight:700,color:"#fff",background:C.gn,padding:"2px 8px",borderRadius:3,letterSpacing:0.5,zIndex:1}}>✨ PARA TI</div>
                <div style={{height:110,background:C.wh,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                  {p.imageUrl ? <img src={p.imageUrl} style={{width:"100%",height:"100%",objectFit:"contain",padding:8}} /> : <span style={{fontSize:24,fontFamily:DP,color:C.ln}}>MINUË</span>}
                </div>
                <div style={{padding:"10px 12px",background:"#faf6f1"}}>
                  <div style={{fontSize:13,fontWeight:600,fontFamily:DP,color:C.dk}}>{p.model}</div>
                  <div style={{fontSize:10,fontFamily:BD,color:C.gr}}>{p.color}</div>
                </div>
              </div>)}
            </div>
          </> : null; })()}

          {/* STORE GUIDE - How Minuë B2B works */}
          <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:10,marginBottom:18,overflow:"hidden"}}>
            <button onClick={() => setStoreGuideOpen(!storeGuideOpen)} style={{width:"100%",padding:"14px 18px",background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:10,textAlign:"left"}}>
              <div style={{fontSize:20}}>📖</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontFamily:BD,fontWeight:700,color:C.dk}}>{t("guiaParaTiendas")}</div>
                <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:2}}>{storeGuideOpen ? t("ocultarGuia") : t("verGuia")}</div>
              </div>
              <span style={{fontSize:18,color:C.gr,transform:storeGuideOpen?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▾</span>
            </button>
            {storeGuideOpen && <div style={{padding:"4px 18px 18px",borderTop:"1px solid "+C.bg2}}>
              {[
                ["1",t("guiaTienda1Titulo"),t("guiaTienda1Desc"),"🔍"],
                ["2",t("guiaTienda2Titulo"),t("guiaTienda2Desc"),"🛒"],
                ["3",t("guiaTienda3Titulo"),t("guiaTienda3Desc"),"💳"],
                ["4",t("guiaTienda4Titulo"),t("guiaTienda4Desc"),"📦"]
              ].map(([n,title,desc,emo]) => <div key={n} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:"1px solid "+C.bg2}}>
                <div style={{width:28,height:28,borderRadius:14,background:CL.gn+"20",color:CL.gn,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontFamily:BD,fontWeight:700,flexShrink:0}}>{n}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontFamily:BD,fontWeight:700,color:C.dk,marginBottom:3}}>{emo} {title}</div>
                  <div style={{fontSize:11,fontFamily:BD,color:C.gr,lineHeight:1.5}}>{desc}</div>
                </div>
              </div>)}
            </div>}
          </div>

          {/* MARKET INSIGHTS - rotating motivational stats */}
          {(() => { const activeInsights = (insights||[]).filter(i => i.on); if (activeInsights.length === 0) return null; return <div style={{marginBottom:24}}>
            <div style={{fontSize:14,fontFamily:DP,color:C.dk,fontWeight:500,marginBottom:12}}>💡 {t("insightsTitle")}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12}}>
              {activeInsights.map(ins => <div key={ins.id} style={{background:"linear-gradient(135deg,"+CL.dk+"05,"+CL.gn+"08)",border:"1px solid "+CL.gn+"25",borderRadius:10,padding:"16px 18px",display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{fontSize:30,flexShrink:0,lineHeight:1}}>{ins.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:11,fontFamily:BD,color:CL.gn,letterSpacing:0.5,fontWeight:700,marginBottom:4,textTransform:"uppercase"}}>{(ins.title&&ins.title[lang])||ins.title?.es||""}</div>
                  <div style={{fontSize:12,fontFamily:BD,color:C.dk,lineHeight:1.5}}>{(ins.text&&ins.text[lang])||ins.text?.es||""}</div>
                </div>
              </div>)}
            </div>
          </div>; })()}

          {/* COMPRAR DE NUEVO - quick reorder with direct add to cart */}
          {(() => { const myOrders = orders.filter(o => (o.client === user.co || o.client === user.name) && o.dist !== "Faire"); const mySold = {}; myOrders.forEach(o => (o.lines||[]).forEach(l => { const k = l.model+"|"+l.color; if(!mySold[k]) mySold[k] = {qty:0, lastDate:o.date}; mySold[k].qty += (l.qty||0); })); const myTop = Object.entries(mySold).sort((a,b) => b[1].qty-a[1].qty).slice(0,6); const myTopProds = myTop.map(([k,d]) => { const [m,c] = k.split("|"); const p = products.find(x => x.model === m && x.color === c && x.active !== false); return p ? {p,qty:d.qty,lastDate:d.lastDate} : null; }).filter(Boolean); return myTopProds.length > 0 ? <>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div style={{fontSize:18,fontFamily:DP,color:C.dk,fontWeight:500}}>🔄 Comprar de nuevo</div>
              <span style={{fontSize:10,fontFamily:BD,color:C.gr}}>Tus modelos más pedidos</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10,marginBottom:24}}>
              {myTopProds.map(({p,qty,lastDate}) => {
                const inCart = cart[p.id]||0;
                const suggestedQty = Math.max(1, Math.round(qty/Math.max(1,myOrders.length)));
                return <div key={p.id} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,overflow:"hidden",position:"relative"}}>
                  <div style={{height:110,background:C.wh,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",cursor:"pointer"}} onClick={() => { const mg = {model:p.model,col:p.col,colors:products.filter(x=>x.model===p.model),tags:new Set(p.tags||[])}; setSelectedModel(mg); setSelectedColorIdx(mg.colors.findIndex(c=>c.id===p.id)||0); setModal("viewModel"); }}>
                    {p.imageUrl ? <img src={p.imageUrl} style={{width:"100%",height:"100%",objectFit:"contain",padding:8}} /> : <span style={{fontSize:24,fontFamily:DP,color:C.ln}}>MINUË</span>}
                    {inCart > 0 && <span style={{position:"absolute",top:6,right:6,fontSize:9,fontFamily:BD,color:C.bg,background:C.gn,padding:"2px 8px",borderRadius:10}}>x{inCart}</span>}
                  </div>
                  <div style={{padding:"10px 12px",background:"#faf6f1"}}>
                    <div style={{fontSize:13,fontWeight:500,fontFamily:DP,color:C.dk}}>{p.model}</div>
                    <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:2}}>{p.color}</div>
                    <div style={{fontSize:9,fontFamily:BD,color:C.gr2,marginBottom:8}}>Pediste {qty} uds</div>
                    <button onClick={() => addToCart(p.id, suggestedQty)} style={{width:"100%",padding:"7px 0",background:C.dk,color:C.bg,border:"none",fontSize:10,cursor:"pointer",fontFamily:BD,borderRadius:4,fontWeight:600}}>+ {suggestedQty} ud{suggestedQty>1?"s":""} 🛒</button>
                  </div>
                </div>;
              })}
            </div>
          </> : null; })()}

          {/* LATEST NEWS */}
          {news.filter(n => n.on).length > 0 && <>
            <div style={{fontSize:18,fontFamily:DP,color:C.dk,fontWeight:500,marginBottom:14}}>{t("dernieresNouv")}</div>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:28}}>
              {news.filter(n => n.on).slice(0,2).map((n,i) => (
                <div key={i} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
                  <div>
                    <div style={{fontSize:14,fontFamily:BD,color:C.dk,fontWeight:600}}>{(n.title&&n.title[lang])||n.title?.fr||""}</div>
                    <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginTop:4,lineHeight:1.4}}>{((n.content&&n.content[lang])||n.content?.fr||"").substring(0,120)}{((n.content&&n.content[lang])||"").length>120?"...":""}</div>
                  </div>
                  {n.url && <a href={n.url} target="_blank" rel="noreferrer" style={{fontSize:11,fontFamily:BD,color:C.gn,whiteSpace:"nowrap",textDecoration:"none",fontWeight:600}}>→</a>}
                </div>
              ))}
            </div>
          </>}

          {/* ACTIVE PROMOS */}
          {promos.filter(p => p.on && (p.visible||[]).includes("client") && (!p.targetClients || p.targetClients.length === 0 || p.targetClients.includes(user.co))).length > 0 && <>
            <div style={{fontSize:18,fontFamily:DP,color:C.dk,fontWeight:500,marginBottom:14}}>{t("promosActives")}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
              {promos.filter(p => p.on && (p.visible||[]).includes("client") && (!p.targetClients || p.targetClients.length === 0 || p.targetClients.includes(user.co))).slice(0,3).map((p,i) => renderPromoCard(p, i, false))}
            </div>
          </>}
        </div>
      </div>}

      {view === "c-cat" && <Sec title={t("collSS26")} sub={t("collSub")} right={<input placeholder={t("rechercher")} value={filter} onChange={e => setFilter(e.target.value)} style={{padding:"8px 14px",border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.wh,color:C.dk,width:"min(200px, 40vw)"}} />}>
        <div style={{display:"flex",gap:6,marginBottom:10,alignItems:"center",flexWrap:"wrap"}}>
          {[["all","Tout"],["Essential","Essential"],["Icons","Icons"],["Acetato","Acetato"]].map(([v,l]) => (
            <button key={v} onClick={() => { setColFilter(v); setFavFilter(false); }} style={{padding:"5px 14px",background:colFilter===v&&!favFilter?C.dk:"transparent",color:colFilter===v&&!favFilter?C.bg:C.gr,border:"1px solid "+(colFilter===v&&!favFilter?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:500,borderRadius:20}}>{l}</button>
          ))}
          {favs.length > 0 && <button onClick={() => setFavFilter(!favFilter)} style={{padding:"5px 12px",background:favFilter?"#6b4c3b":"transparent",color:favFilter?"#fff":"#6b4c3b",border:"1px solid "+(favFilter?"#6b4c3b":C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:500,borderRadius:20,display:"flex",alignItems:"center",gap:4}}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill={favFilter?"#fff":"#6b4c3b"} stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> {favs.length}
          </button>}
          <span style={{flex:1}} />
          <button onClick={() => setFilterPanel(filterPanel==="shape"?null:"shape")} style={{padding:"5px 12px",background:filterPanel==="shape"?C.dk:shapeFilter!=="all"?C.dk+"15":"transparent",color:filterPanel==="shape"?C.bg:shapeFilter!=="all"?C.dk:C.gr,border:"1px solid "+(filterPanel==="shape"||shapeFilter!=="all"?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,borderRadius:20,display:"flex",alignItems:"center",gap:4}}>
            {t("forme")}{shapeFilter!=="all"&&<span style={{width:6,height:6,borderRadius:3,background:filterPanel==="shape"?C.bg:C.dk}} />}
          </button>
          <button onClick={() => setFilterPanel(filterPanel==="color"?null:"color")} style={{padding:"5px 12px",background:filterPanel==="color"?C.dk:colorFilter!=="all"?C.dk+"15":"transparent",color:filterPanel==="color"?C.bg:colorFilter!=="all"?C.dk:C.gr,border:"1px solid "+(filterPanel==="color"||colorFilter!=="all"?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,borderRadius:20,display:"flex",alignItems:"center",gap:4}}>
            {t("couleur")}{colorFilter!=="all"&&<span style={{width:6,height:6,borderRadius:3,background:filterPanel==="color"?C.bg:C.dk}} />}
          </button>
        </div>
        {filterPanel==="shape"&&<div style={{display:"flex",gap:4,marginBottom:10,flexWrap:"wrap",padding:"10px 14px",background:C.wh,borderRadius:6,border:"1px solid "+C.ln}}>
          {[["all","toutes"],["ronde","ronde"],["carree","carree"],["catEye","catEye"],["rectangulaire","rectangulaire"],["aviateur","aviateur"],["oversize","oversize"],["geometrique","geometrique"]].map(([v,k]) => (
            <button key={v} onClick={() => { setShapeFilter(v); if(v!=="all") setFilterPanel(null); }} style={{padding:"5px 12px",background:shapeFilter===v?C.dk:"transparent",color:shapeFilter===v?C.bg:C.dk,border:"1px solid "+(shapeFilter===v?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,borderRadius:20}}>{v==="all"?t("toutes"):t(k)}</button>
          ))}
        </div>}
        {filterPanel==="color"&&<div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap",padding:"10px 14px",background:C.wh,borderRadius:6,border:"1px solid "+C.ln,alignItems:"center"}}>
          <button onClick={() => { setColorFilter("all"); setFilterPanel(null); }} style={{padding:"4px 10px",background:colorFilter==="all"?C.dk:"transparent",color:colorFilter==="all"?C.bg:C.gr,border:"1px solid "+(colorFilter==="all"?C.dk:C.ln),cursor:"pointer",fontSize:9,fontFamily:BD,borderRadius:20}}>{t("tous")}</button>
          {[["noir","#1a1a1a"],["careyCol","#8B6914"],["marron","#7B4B2A"],["vert","#2d6b4f"],["dore","#C5A55A"],["rose","#D4839A"],["bleu","#3B6B9E"],["rougeVin","#722f37"],["orangeCol","#D4763A"],["cremeNude","#E8D5C0"],["gris","#8C8C8C"],["transparentCol","#f5f5f5"],["multicolore","conic-gradient(#e74c3c,#f1c40f,#2ecc71,#3498db,#e74c3c)"]].map(([v,bg]) => (
            <button key={v} onClick={() => { setColorFilter(v); setFilterPanel(null); }} title={t(v)} style={{width:26,height:26,borderRadius:13,background:bg,border:colorFilter===v?"3px solid "+C.dk:"2px solid "+C.ln,cursor:"pointer",boxShadow:colorFilter===v?"0 0 0 2px "+C.bg+", 0 0 0 4px "+C.dk:"none",padding:0}} />
          ))}
        </div>}
        {essentialCount > 0 && customPrice === 0 && renderTierBar()}
        {renderModelCatalog()}
      </Sec>}

      {view === "c-cart" && <Sec title={t("panier")} right={cartEntries.length > 0 ? <Btn small ghost onClick={() => askConfirm(t("confirmVaciarCarrito"), () => { setCart({}); setCartNotes(""); setFundaPref([]); setPreferredDate(""); setShippingAddr("saved"); setNewShipAddr({street:"",city:"",zip:"",country:""}); setCartPayMethod(""); try { localStorage.removeItem("minue_cart_"+user.email); } catch(e){} toast(t("carritoVaciado")); })} style={{color:C.rd,borderColor:C.rd+"60"}}>🗑 Vaciar carrito</Btn> : null}>
        {/* SAVED DRAFTS */}
        {(() => { let drafts = savedCarts; if(!drafts || drafts.length === 0) { try { drafts = JSON.parse(localStorage.getItem("minue_drafts_"+user.email) || "[]"); if(drafts.length > 0 && (!savedCarts || savedCarts.length === 0)) setSavedCarts(drafts); } catch(e) { drafts = []; } } return drafts && drafts.length > 0 ? <div style={{marginBottom:18,padding:"14px 16px",background:"#fff8e6",border:"1px solid #f0a020"+"30",borderRadius:8}}>
          <div style={{fontSize:12,fontFamily:BD,fontWeight:600,color:C.dk,marginBottom:8}}>{t("borradoresGuardados")} ({drafts.length})</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {drafts.slice(0,5).map(d => <div key={d.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:C.wh,borderRadius:5,fontSize:11,fontFamily:BD}}>
              <span style={{flex:1}}>{d.date} · {d.items} {t("unites")} · {fmt(d.total)} €</span>
              <button onClick={() => { setCart(d.cart||{}); setCartNotes(d.notes||""); setFundaPref(d.fundaPref||[]); setPreferredDate(d.preferredDate||""); setShippingAddr(d.shippingAddr||"saved"); setNewShipAddr(d.newShipAddr||{street:"",city:"",zip:"",country:""}); }} style={{padding:"5px 10px",background:C.dk,color:C.bg,border:"none",borderRadius:3,fontSize:10,fontFamily:BD,cursor:"pointer"}}>{t("recuperar")}</button>
              <button onClick={() => { const newDrafts = drafts.filter(x => x.id !== d.id); setSavedCarts(newDrafts); try { localStorage.setItem("minue_drafts_"+user.email, JSON.stringify(newDrafts)); } catch(e){} }} style={{padding:"5px 8px",background:"transparent",color:C.rd,border:"1px solid "+C.rd+"40",borderRadius:3,fontSize:10,fontFamily:BD,cursor:"pointer"}}>×</button>
            </div>)}
          </div>
        </div> : null; })()}
        {cartEntries.length === 0
          ? <div style={{textAlign:"center",padding:40,fontFamily:BD,color:C.gr}}><p>{t("panierVide")}</p><Btn onClick={() => setView("c-cat")}>{t("voirCat")}</Btn></div>
          : <div style={{maxWidth:800,margin:"0 auto"}}>
              {customPrice > 0 && <div style={{background:"#f0f6fa",border:"1px solid "+C.bl+"30",borderRadius:6,padding:"10px 14px",marginBottom:14,fontSize:11,fontFamily:BD,color:C.bl,fontWeight:500}}>{t("prixFixeClient")}: {fmt(customPrice)} €/{t("unites")}</div>}
              {customPrice === 0 && renderTierBar()}
              {customPrice === 0 && essentialCount > 0 && nextTier && <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:"8px 14px",marginBottom:14,fontSize:11,fontFamily:BD,color:C.gr,lineHeight:1.5}}>{t("astucePrix")}</div>}
              {cartEntries.map(([id, q]) => { const p = products.find(x => String(x.id) === String(id)); if (!p) return null; const itemPrice = p.col === "Acetato" ? p.fixedPrice : essentialUnitPrice; return (
                <div key={id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid "+C.bg2}}>
                  <div><div style={{fontSize:14,fontWeight:500,fontFamily:DP,color:C.dk}}>{p.model}</div><div style={{fontSize:11,color:C.gr,fontFamily:BD}}>{p.color} {p.col === "Acetato" ? <span style={{fontSize:9,color:"#7a5c3a",background:"#e8d5c0",padding:"1px 5px",borderRadius:2,marginLeft:4}}>Acetato</span> : ""}</div></div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:11,fontFamily:BD,color:C.gr}}>{fmt(itemPrice)} €</span>
                    <button onClick={() => updateQty(+id, q-1)} style={{width:26,height:26,background:C.bg,border:"1px solid "+C.ln,cursor:"pointer",borderRadius:3,color:C.dk,fontFamily:BD}}>-</button>
                    <span style={{fontSize:13,fontFamily:BD,minWidth:22,textAlign:"center"}}>{q}</span>
                    <button onClick={() => updateQty(+id, q+1)} style={{width:26,height:26,background:C.bg,border:"1px solid "+C.ln,cursor:"pointer",borderRadius:3,color:C.dk,fontFamily:BD}}>+</button>
                    <span style={{fontSize:13,fontFamily:BD,fontWeight:600,minWidth:65,textAlign:"right"}}>{fmt(itemPrice*q)} €</span>
                  </div>
                </div>
              ); })}

              {/* CART SUMMARY - sticky preview */}
              <div style={{background:"linear-gradient(135deg,"+C.dk+"06,"+C.gn+"08)",border:"2px solid "+C.dk+"15",borderRadius:10,padding:"16px 20px",marginTop:14,marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                  <div>
                    <div style={{fontSize:10,fontFamily:BD,color:C.gr,letterSpacing:1,fontWeight:600,textTransform:"uppercase"}}>{t("resumenPedido")}</div>
                    <div style={{fontSize:12,fontFamily:BD,color:C.gr,marginTop:2}}>{cartCount} {t("unites")}{essentialCount > 0 && acetatoCount > 0 && " · "+essentialCount+" Essential / Icons + "+acetatoCount+" Acetato"}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:10,fontFamily:BD,color:C.gr}}>{t("totalHT")}</div>
                    <div style={{fontSize:28,fontFamily:DP,fontWeight:400,color:C.dk,lineHeight:1}}>{fmt(finalTotal)} €</div>
                    {earlyPay && earlyPaySaving > 0 && <div style={{fontSize:10,fontFamily:BD,color:C.gn,marginTop:2,fontWeight:600}}>✓ -{fmt(earlyPaySaving)} € {t("prontoPago").toLowerCase()}</div>}
                  </div>
                </div>
              </div>

              {/* FUNDA COLOR SELECTOR - MULTIPLE */}
              {(() => {
                const fundas = [["fundaCrema","Crema","#f0e8d9"],["fundaPistacho","Pistacho","#a8c89a"],["fundaBabyBlue","Baby Blue","#a8c8d4"],["fundaYellowAmalfi","Amalfi","#f0d878"],["fundaNaranja","Naranja","#e89858"]];
                return <div style={{borderTop:"1px solid "+C.bg2,padding:"16px 0",marginTop:8}}>
                  <div style={{fontSize:12,fontFamily:BD,fontWeight:600,color:C.dk,marginBottom:4}}>🎁 {t("fundasPreferidos")}</div>
                  <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:10}}>{t("fundasDesc")}</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {fundas.map(([k,label,color]) => {
                      const stock = packStock[k]||0;
                      const isAvail = stock > 0;
                      const isSelected = (fundaPref||[]).includes(k);
                      return <button key={k} onClick={() => { if(!isAvail) return; setFundaPref(p => (p||[]).includes(k) ? p.filter(x => x !== k) : [...(p||[]), k]); }} disabled={!isAvail} style={{padding:"10px 14px",background:isSelected?C.dk:C.wh,color:isSelected?C.bg:isAvail?C.dk:C.gr2,border:"2px solid "+(isSelected?C.dk:isAvail?C.ln:C.ln+"60"),borderRadius:8,cursor:isAvail?"pointer":"not-allowed",fontSize:11,fontFamily:BD,fontWeight:isSelected?700:500,display:"flex",alignItems:"center",gap:8,opacity:isAvail?1:0.5}}>
                        <div style={{width:18,height:18,borderRadius:9,background:color,border:"1px solid "+C.ln,flexShrink:0}}></div>
                        <span>{label}</span>
                        {isSelected && <span style={{fontSize:11,fontWeight:700}}>✓</span>}
                        {!isAvail && <span style={{fontSize:8,color:C.rd,fontWeight:600}}>{t("sinStockBtn")}</span>}
                      </button>;
                    })}
                  </div>
                  {(fundaPref||[]).length > 0 && <div style={{marginTop:8,fontSize:10,fontFamily:BD,color:C.gr,fontStyle:"italic"}}>{t("coloresSeleccionados").replace("%n",String((fundaPref||[]).length))}</div>}
                </div>;
              })()}

              {/* SHIPPING ADDRESS */}
              <div style={{borderTop:"1px solid "+C.bg2,padding:"16px 0"}}>
                <div style={{fontSize:12,fontFamily:BD,fontWeight:600,color:C.dk,marginBottom:8}}>📍 {t("direccionEnvio")}</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
                  <button onClick={() => setShippingAddr("saved")} style={{padding:"8px 14px",background:shippingAddr==="saved"?C.dk:C.wh,color:shippingAddr==="saved"?C.bg:C.dk,border:"2px solid "+(shippingAddr==="saved"?C.dk:C.ln),borderRadius:6,cursor:"pointer",fontSize:11,fontFamily:BD,fontWeight:shippingAddr==="saved"?700:500}}>{t("miDireccion")}</button>
                  <button onClick={() => setShippingAddr("new")} style={{padding:"8px 14px",background:shippingAddr==="new"?C.dk:C.wh,color:shippingAddr==="new"?C.bg:C.dk,border:"2px solid "+(shippingAddr==="new"?C.dk:C.ln),borderRadius:6,cursor:"pointer",fontSize:11,fontFamily:BD,fontWeight:shippingAddr==="new"?700:500}}>{t("nuevaDireccion")}</button>
                </div>
                {shippingAddr === "saved" && (() => {
                  const ac = activeClient;
                  if (!ac) return <div style={{padding:"12px 14px",background:"#fff8e6",border:"1px solid #f0a02050",borderRadius:6,fontSize:11,fontFamily:BD,color:"#c47a00"}}>⚠ {t("sinDireccionGuardada")||"Aún no tienes una dirección guardada. Ve a tu perfil para añadirla, o elige \"Nueva dirección\"."}</div>;
                  const shStreet = ac.shippingAddress || ac.address || "";
                  const shCity = ac.shippingCity || ac.city || "";
                  const shPostal = ac.shippingPostal || ac.postalCode || "";
                  const shCountry = ac.shippingCountry || ac.country || "";
                  const hasFullAddress = shStreet && shCity;
                  if (!hasFullAddress) return <div style={{padding:"12px 14px",background:"#fff8e6",border:"1px solid #f0a02050",borderRadius:6,fontSize:11,fontFamily:BD,color:"#c47a00",lineHeight:1.5}}>⚠ Tu dirección guardada está incompleta ({[shStreet,shPostal,shCity,shCountry].filter(Boolean).join(", ")||"vacía"}).<br/>Ve a <button onClick={() => setView("c-account")} style={{background:"none",border:"none",color:C.bl,textDecoration:"underline",cursor:"pointer",padding:0,fontFamily:BD,fontSize:11,fontWeight:600}}>tu perfil</button> para completarla, o usa "Nueva dirección".</div>;
                  return <div style={{padding:"12px 14px",background:C.bg,border:"1px solid "+C.ln,borderRadius:6,fontSize:11,fontFamily:BD,color:C.dk,lineHeight:1.6}}>
                    <div style={{fontWeight:700,color:C.dk,marginBottom:4,fontSize:12}}>{ac.companyName||ac.name||user.co}</div>
                    {ac.contact && <div style={{color:C.gr2,fontSize:10}}>A/A: {ac.contact}</div>}
                    <div style={{color:C.dk,marginTop:4}}>{shStreet}</div>
                    <div style={{color:C.dk}}>{shPostal} {shCity}</div>
                    <div style={{color:C.gr}}>{shCountry}</div>
                    {ac.phone && <div style={{color:C.gr,fontSize:10,marginTop:4}}>📞 {ac.phone}</div>}
                    <div style={{marginTop:8,paddingTop:8,borderTop:"1px solid "+C.ln}}>
                      <button onClick={() => setView("c-account")} style={{background:"none",border:"none",color:C.bl,cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:600,padding:0,textDecoration:"underline"}}>✎ Editar mi dirección guardada</button>
                    </div>
                  </div>;
                })()}
                {shippingAddr === "new" && <>
                  <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:8}}>💡 Esta dirección se usará solo para este pedido. No reemplaza la guardada en tu perfil.</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <input value={newShipAddr.street} onChange={e => setNewShipAddr(p => ({...p, street:e.target.value}))} placeholder={t("calleNum")} style={{padding:9,border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,gridColumn:"1/-1",boxSizing:"border-box"}} />
                    <input value={newShipAddr.zip} onChange={e => setNewShipAddr(p => ({...p, zip:e.target.value}))} placeholder={t("codigoPostal")} style={{padding:9,border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                    <input value={newShipAddr.city} onChange={e => setNewShipAddr(p => ({...p, city:e.target.value}))} placeholder={t("ciudadInput")} style={{padding:9,border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                    <input value={newShipAddr.country} onChange={e => setNewShipAddr(p => ({...p, country:e.target.value}))} placeholder={t("paisInput")} style={{padding:9,border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,gridColumn:"1/-1",boxSizing:"border-box"}} />
                  </div>
                  {activeClient && (activeClient.shippingAddress || activeClient.address) && <button onClick={() => { const ac = activeClient; setNewShipAddr({street:ac.shippingAddress||ac.address||"",zip:ac.shippingPostal||ac.postalCode||"",city:ac.shippingCity||ac.city||"",country:ac.shippingCountry||ac.country||""}); }} style={{marginTop:8,padding:"6px 12px",background:"transparent",border:"1px dashed "+C.ln,borderRadius:4,fontSize:10,fontFamily:BD,color:C.gr,cursor:"pointer"}}>↩ Copiar desde mi dirección guardada</button>}
                </>}
              </div>

              {/* PREFERRED DELIVERY DATE */}
              <div style={{borderTop:"1px solid "+C.bg2,padding:"16px 0"}}>
                <div style={{fontSize:12,fontFamily:BD,fontWeight:600,color:C.dk,marginBottom:4}}>📅 {t("fechaPreferente")} <span style={{fontSize:10,color:C.gr,fontWeight:400}}>({t("opcional")})</span></div>
                <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:6}}>{t("fechaPreferenteDesc")}</div>
                <div style={{fontSize:10,fontFamily:BD,color:"#c47a00",background:"#fff8e6",border:"1px solid #f0a02030",padding:"6px 10px",borderRadius:4,marginBottom:8,display:"inline-block"}}>{t("envioMinimoInfo")}</div>
                <div>
                  <input type="date" value={preferredDate} min={(() => { const d = new Date(); let added = 0; while (added < 5) { d.setDate(d.getDate()+1); if (d.getDay() !== 0 && d.getDay() !== 6) added++; } return d.toISOString().split("T")[0]; })()} onChange={e => setPreferredDate(e.target.value)} style={{padding:9,border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",minWidth:200}} />
                </div>
              </div>

              {/* NOTES */}
              <div style={{borderTop:"1px solid "+C.bg2,padding:"16px 0"}}>
                <div style={{fontSize:12,fontFamily:BD,fontWeight:600,color:C.dk,marginBottom:4}}>{t("notasPara")} <span style={{fontSize:10,color:C.gr,fontWeight:400}}>({t("opcional")})</span></div>
                <textarea value={cartNotes} onChange={e => setCartNotes(e.target.value)} rows={2} placeholder={t("notasPlaceholder")} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
              </div>

              <div style={{borderTop:"2px solid "+C.dk,marginTop:12,paddingTop:16}}>
                {essentialCount > 0 && <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontFamily:BD,fontSize:12,color:C.gr}}>Essential: {essentialCount} {t("unites")} x {fmt(essentialUnitPrice)} €</span><span style={{fontFamily:BD,fontSize:12}}>{fmt(essentialTotal)} €</span></div>}
                {acetatoCount > 0 && <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontFamily:BD,fontSize:12,color:"#7a5c3a"}}>Acetato: {acetatoCount} {t("unites")}</span><span style={{fontFamily:BD,fontSize:12}}>{fmt(acetatoTotal)} €</span></div>}
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontFamily:BD,fontSize:12,color:C.dk,fontWeight:600}}>{t("totalHT")}</span><span style={{fontFamily:BD,fontSize:13,fontWeight:600}}>{fmt(cartTotal)} €</span></div>
                {earlyPay && <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontFamily:BD,fontSize:12,color:C.gn}}>{t("prontoPago")}</span><span style={{fontFamily:BD,fontSize:12,color:C.gn}}>-{fmt(earlyPaySaving)} €</span></div>}
                {cartCount >= 20 && <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontFamily:BD,fontSize:12,color:C.gn}}>{t("envoi")}</span><span style={{fontFamily:BD,fontSize:12,color:C.gn,fontWeight:600}}>{t("gratuit")}</span></div>}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",padding:"12px 0",flexWrap:"wrap",gap:10}}>
                  <div>
                    <div style={{fontSize:10,color:C.gr,fontFamily:BD}}>{t("totalHT")}</div>
                    <div style={{fontSize:30,fontWeight:300,fontFamily:DP,color:C.dk}}>{fmt(finalTotal)} €</div>
                  </div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    <button onClick={() => { const draft = {id:Date.now(),date:new Date().toLocaleDateString("es-ES"),time:new Date().toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"}),cart:{...cart},notes:cartNotes,fundaPref:[...(fundaPref||[])],preferredDate,shippingAddr,newShipAddr:{...newShipAddr},total:finalTotal,items:cartCount}; setSavedCarts(p => [draft, ...(p||[])]); try { localStorage.setItem("minue_drafts_"+user.email, JSON.stringify([draft, ...(savedCarts||[])])); } catch(e){} toast(t("borradorGuardado")); }} style={{padding:"10px 16px",background:"transparent",color:C.dk,border:"1px solid "+C.dk,fontSize:11,fontFamily:BD,fontWeight:500,borderRadius:4,cursor:"pointer"}}>{t("guardarBorrador")}</button>
                    <Btn onClick={doOrder}>{t("passerCmd")}</Btn>
                  </div>
                </div>
              </div>
            </div>
        }
        {submitted && <div style={{position:"fixed",inset:0,background:"rgba(24,51,47,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}}><div style={{background:C.wh,padding:"40px 50px",textAlign:"center",borderRadius:8}}><div style={{fontSize:32,color:C.gn}}>OK</div><div style={{fontSize:18,fontFamily:DP,color:C.dk,marginTop:8}}>{t("cmdEnvoyee")}</div></div></div>}
      </Sec>}

      {view === "c-ord" && <Sec title={t("mesCmd")}>
        {(() => { const myOrders = orders.filter(o => o.client === user.co || o.client === user.name); return myOrders.length === 0 ? <div style={{textAlign:"center",padding:40}}><div style={{fontSize:40,marginBottom:12}}>📦</div><div style={{fontSize:14,fontFamily:BD,color:C.gr}}>{t("aucuneCmd")}</div><Btn onClick={() => setView("c-cat")} style={{marginTop:16}}>{t("descubrirCol")} →</Btn></div> :
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {/* KPI summary */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:8,marginBottom:8}}>
            <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"12px 10px",textAlign:"center"}}><div style={{fontSize:22,fontWeight:300,fontFamily:DP,color:C.dk}}>{myOrders.length}</div><div style={{fontSize:9,fontFamily:BD,color:C.gr}}>{t("commandes")}</div></div>
            <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"12px 10px",textAlign:"center"}}><div style={{fontSize:22,fontWeight:300,fontFamily:DP,color:C.dk}}>{myOrders.reduce((s,o)=>s+o.items,0)}</div><div style={{fontSize:9,fontFamily:BD,color:C.gr}}>{t("unites")}</div></div>
            <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"12px 10px",textAlign:"center"}}><div style={{fontSize:22,fontWeight:300,fontFamily:DP,color:C.gn}}>{fmt(myOrders.reduce((s,o)=>s+o.total,0))} €</div><div style={{fontSize:9,fontFamily:BD,color:C.gr}}>Total</div></div>
          </div>
          {/* Order cards */}
          {myOrders.map((o,i) => {
            const steps = ["confirmed","preparing","shipped","delivered"];
            const currentStep = steps.indexOf(o.status);
            return <div key={i} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:10,overflow:"hidden",cursor:"pointer"}} onClick={() => { setModal("viewOrd"); setEd({...o}); }}>
              <div style={{padding:"16px 18px",display:"flex",alignItems:"center",gap:14}}>
                <div style={{background:C.dk+"08",borderRadius:8,padding:"10px 14px",textAlign:"center",flexShrink:0}}>
                  <div style={{fontSize:15,fontFamily:BD,color:C.dk,fontWeight:700}}>{o.id}</div>
                  <div style={{fontSize:9,fontFamily:BD,color:C.gr,marginTop:2}}>{o.date}</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontFamily:BD,color:C.dk,fontWeight:600}}>{o.items} {t("unites")} · {fmt(o.total)} €</div>
                  <div style={{display:"flex",gap:6,marginTop:6}}><Badge l={SL[o.status]} c={SC[o.status]} /><Badge l={PL[o.pay]} c={PC[o.pay]} /></div>
                </div>
                {o.track && <a href={o.trackUrl||"#"} target="_blank" rel="noreferrer" style={{fontSize:10,fontFamily:BD,color:C.bl,textDecoration:"none",background:C.bl+"10",padding:"6px 12px",borderRadius:6,fontWeight:500}} onClick={e => e.stopPropagation()}>📦 Track</a>}
                <span style={{fontSize:12,color:C.gr}}>→</span>
              </div>
              {/* Progress bar */}
              <div style={{padding:"0 18px 14px",display:"flex",alignItems:"center",gap:0}}>
                {steps.map((s,si) => <div key={s} style={{display:"flex",alignItems:"center",flex:si<3?"1":"0 0 auto"}}>
                  <div style={{width:20,height:20,borderRadius:10,background:si<=currentStep?SC[s]||C.gn:C.ln+"60",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {si<=currentStep && <span style={{fontSize:8,color:"#fff"}}>✓</span>}
                  </div>
                  {si<3 && <div style={{flex:1,height:2,background:si<currentStep?SC[steps[si+1]]||C.gn:C.ln+"40"}} />}
                </div>)}
              </div>
              <div style={{padding:"0 18px 10px",display:"flex",justifyContent:"space-between"}}>
                {steps.map((s,si) => <span key={s} style={{fontSize:7,fontFamily:BD,color:si<=currentStep?C.dk:C.gr2,fontWeight:si===currentStep?600:400,textAlign:"center",flex:1}}>{SL[s]}</span>)}
              </div>
              {o.clientNotes && <div style={{padding:"8px 18px 12px",background:C.bl+"06",borderTop:"1px solid "+C.bl+"15",fontSize:11,fontFamily:BD,color:C.bl}}><span style={{fontWeight:600}}>📝</span> {o.clientNotes}</div>}
            </div>;
          })}
        </div>; })()}
      </Sec>}

      {view === "c-tarifs" && <Sec title={t("tarifVolume")} sub={t("tarifVolSub")}>
        {customPrice > 0 && <div style={{background:"linear-gradient(135deg,"+CL.dk+"08,"+CL.gn+"10)",border:"2px solid "+CL.gn+"40",borderRadius:10,padding:"18px 22px",marginBottom:20,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
          <div style={{fontSize:30}}>⭐</div>
          <div style={{flex:1,minWidth:200}}>
            <div style={{fontSize:11,fontFamily:BD,color:CL.gn,letterSpacing:1.5,fontWeight:700,marginBottom:4}}>{t("precioEspecial").toUpperCase()}</div>
            <div style={{fontSize:28,fontFamily:DP,fontWeight:400,color:C.dk,marginBottom:4}}>{fmt(customPrice)} €<span style={{fontSize:13,color:C.gr,fontWeight:400,marginLeft:6}}>{t("parUnite")}</span></div>
            <div style={{fontSize:11,fontFamily:BD,color:C.gr,lineHeight:1.5}}>{t("precioEspecialDesc")}</div>
          </div>
        </div>}
        {customPrice === 0 && (priceEssential > 0 || priceIcons > 0 || priceAcetato > 0) && <div style={{background:"linear-gradient(135deg,"+CL.dk+"08,"+CL.gn+"10)",border:"2px solid "+CL.gn+"40",borderRadius:10,padding:"18px 22px",marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
            <div style={{fontSize:30}}>⭐</div>
            <div>
              <div style={{fontSize:11,fontFamily:BD,color:CL.gn,letterSpacing:1.5,fontWeight:700}}>{t("precioEspecial").toUpperCase()}</div>
              <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginTop:2}}>{t("precioEspecialDesc")}</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
            {priceEssential > 0 && <div style={{background:C.wh,borderRadius:8,padding:"12px 14px",border:"1px solid "+CL.gn+"20"}}>
              <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:4,fontWeight:600}}>Essential</div>
              <div style={{fontSize:22,fontFamily:DP,fontWeight:400,color:CL.gn}}>{fmt(priceEssential)} €<span style={{fontSize:11,color:C.gr,fontWeight:400,marginLeft:4}}>/ud</span></div>
            </div>}
            {priceIcons > 0 && <div style={{background:C.wh,borderRadius:8,padding:"12px 14px",border:"1px solid "+CL.gn+"20"}}>
              <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:4,fontWeight:600}}>Icons</div>
              <div style={{fontSize:22,fontFamily:DP,fontWeight:400,color:CL.gn}}>{fmt(priceIcons)} €<span style={{fontSize:11,color:C.gr,fontWeight:400,marginLeft:4}}>/ud</span></div>
            </div>}
            {priceAcetato > 0 && <div style={{background:C.wh,borderRadius:8,padding:"12px 14px",border:"1px solid "+CL.gn+"20"}}>
              <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:4,fontWeight:600}}>Acetato</div>
              <div style={{fontSize:22,fontFamily:DP,fontWeight:400,color:CL.gn}}>{fmt(priceAcetato)} €<span style={{fontSize:11,color:C.gr,fontWeight:400,marginLeft:4}}>/ud</span></div>
            </div>}
          </div>
        </div>}
        {/* ACETATO PRICING CARD */}
        <div style={{background:"linear-gradient(135deg,#e8d5c030,#e8d5c015)",border:"1.5px solid #d4b896",borderRadius:10,padding:"16px 20px",marginBottom:16,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
          <div style={{fontSize:28,flexShrink:0}}>🪵</div>
          <div style={{flex:1,minWidth:180}}>
            <div style={{fontSize:12,fontFamily:BD,fontWeight:700,color:"#7a5c3a",letterSpacing:0.5}}>{t("tarifAcetato")}</div>
            <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:3,lineHeight:1.5}}>{t("tarifAcetatoSub")}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:26,fontFamily:DP,fontWeight:500,color:"#7a5c3a"}}>{fmt(customPrice > 0 ? customPrice : (priceAcetato > 0 ? priceAcetato : ACETATO_PRICE))} €<span style={{fontSize:11,color:C.gr,fontWeight:400,marginLeft:4}}>/ud</span></div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10,opacity:(customPrice>0||priceEssential>0||priceIcons>0)?0.55:1}}>
          {TIERS.map((tier, i) => { const isA = cartCount >= tier.min && cartCount <= tier.max && customPrice === 0; return (
            <div key={i} style={{background:C.wh,border:"2px solid "+(isA?C.gn:C.ln),borderRadius:6,padding:18,position:"relative"}}>
              {isA && <div style={{position:"absolute",top:-10,right:12,background:C.gn,color:C.bg,fontSize:9,fontFamily:BD,padding:"2px 8px",borderRadius:3,fontWeight:600}}>{t("votreTarif")}</div>}
              <div style={{fontSize:22,fontWeight:300,fontFamily:DP,color:C.dk,marginBottom:4}}>{tier.label} uds</div>
              <div style={{fontSize:26,fontWeight:500,fontFamily:DP,color:isA?C.gn:C.dk}}>{fmt(tier.price)} €</div>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD}}>{t("parUnite")}</div>
              <div style={{borderTop:"1px solid "+C.ln,marginTop:10,paddingTop:10}}>
                <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginBottom:3}}>{t("paiement")}: <span style={{color:C.dk,fontWeight:500}}>{t(tier.payK)}</span></div>
                <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginBottom:3}}>{t("envoi")}: <span style={{color:tier.shipK==="gratuit"?C.gn:C.dk,fontWeight:500}}>{t(tier.shipK)}</span></div>
                <div style={{fontSize:11,fontFamily:BD,color:C.gr}}>{t("expositor")}: <span style={{color:C.dk,fontWeight:500}}>{t(tier.dispK)}</span></div>
              </div>
            </div>
          ); })}
          <div style={{background:C.bg2,border:"1px solid "+C.ln,borderRadius:6,padding:18,display:"flex",flexDirection:"column",justifyContent:"center",textAlign:"center"}}>
            <div style={{fontSize:20,fontFamily:DP,color:C.dk}}>+60 uds</div>
            <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginTop:6}}>{t("contactAgent")}</div>
          </div>
        </div>
      </Sec>}

      {view === "c-res" && <Sec title={t("resVisuelles")} sub={t("resSub")}>
        {/* PRODUCT PHOTOS — direct downloads for the store's Instagram/web */}
        <div style={{background:"linear-gradient(135deg,"+CL.dk+"06,"+CL.gn+"06)",border:"1px solid "+C.ln,borderRadius:14,padding:"16px 18px",marginBottom:18}}>
          <div style={{fontSize:14,fontFamily:DP,fontWeight:600,color:C.dk,marginBottom:4}}>📸 {t("fotosProducto")}</div>
          <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginBottom:14,lineHeight:1.5}}>{t("fotosProductoSub")}</div>
          <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
            {["all","Essential","Icons","Acetato"].map(cf => <button key={cf} onClick={() => setEd(p => ({...p, _resCol:cf}))} style={{padding:"5px 14px",background:(ed._resCol||"all")===cf?C.dk:"transparent",color:(ed._resCol||"all")===cf?C.bg:C.gr,border:"1px solid "+((ed._resCol||"all")===cf?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:600,borderRadius:20}}>{cf==="all"?t("tous"):cf}</button>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(150px, 44vw),1fr))",gap:10}}>
            {products.filter(p => p.active !== false && p.imageUrl && ((ed._resCol||"all")==="all" || p.col === ed._resCol)).map(p => (
              <div key={p.id} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:10,overflow:"hidden"}}>
                <div style={{height:110,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",background:C.wh}}>
                  <img src={p.imageUrl} alt={p.model} style={{width:"100%",height:"100%",objectFit:"contain",transform:"scale(1.15)"}} loading="lazy" />
                </div>
                <div style={{padding:"8px 10px"}}>
                  <div style={{fontSize:11,fontFamily:BD,fontWeight:600,color:C.dk,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.model} <span style={{color:C.gr,fontWeight:400}}>{p.color}</span></div>
                  <div style={{display:"flex",gap:4,marginTop:6}}>
                    <button onClick={async () => { try { const r = await fetch(p.imageUrl); const b = await r.blob(); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = "MINUE_"+p.model+"_"+p.color.replace(/\s+/g,"-")+".jpg"; a.click(); URL.revokeObjectURL(u); toast(t("fotoDescargada")); } catch(e) { window.open(p.imageUrl, "_blank"); } }} style={{flex:1,padding:"6px 0",background:C.dk,color:C.bg,border:"none",borderRadius:6,fontSize:9,fontFamily:BD,fontWeight:600,cursor:"pointer"}}>⬇ {t("telecharger")}</button>
                    <button onClick={() => window.open(p.imageUrl, "_blank")} title="HD" style={{padding:"6px 9px",background:"transparent",color:C.gr,border:"1px solid "+C.ln,borderRadius:6,fontSize:9,fontFamily:BD,cursor:"pointer"}}>👁</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {products.filter(p => p.active !== false && p.imageUrl).length === 0 && <div style={{textAlign:"center",padding:24,fontSize:11,fontFamily:BD,color:C.gr2}}>—</div>}
        </div>

        {/* OTHER RESOURCES */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
          {[
            {icon:"LG",title:t("resLogos"),desc:"PNG, SVG, AI",url:"https://drive.google.com/drive/folders/minue-logos",type:"link"},
            {icon:"TX",title:t("resTextes"),desc:"FR / ES / EN / IT",url:"https://drive.google.com/drive/folders/minue-textes",type:"link"},
            {icon:"SS26",title:t("resCatalogue"),desc:"PDF 24 pages",url:"https://minueopticians.com/catalogue-ss26.pdf",type:"download"},
            {icon:"GV",title:t("resGuide"),desc:"PDF",url:"https://minueopticians.com/guide-vente.pdf",type:"download"},
          ].map((r, j) => (
            <div key={j} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:12,padding:"18px 20px",display:"flex",alignItems:"center",gap:16}}>
              <div style={{width:44,height:44,borderRadius:10,background:C.bg,border:"1px solid "+C.ln,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontFamily:BD,fontWeight:700,color:C.dk,flexShrink:0}}>{r.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:500,fontFamily:DP,color:C.dk}}>{r.title}</div>
                <div style={{fontSize:10,color:C.gr2,fontFamily:BD,marginTop:2}}>{r.desc}</div>
              </div>
              <a href={r.url} target="_blank" rel="noopener noreferrer" style={{padding:"6px 14px",background:r.type==="download"?C.dk:"transparent",color:r.type==="download"?C.bg:C.dk,border:"1px solid "+(r.type==="download"?C.dk:C.ln),fontSize:10,fontFamily:BD,fontWeight:500,borderRadius:6,textDecoration:"none",whiteSpace:"nowrap",cursor:"pointer"}}>{r.type==="download"?t("telecharger"):t("acceder")}</a>
            </div>
          ))}
        </div>
      </Sec>}

      {/* TARIFS DISTRIBUTOR */}
      {view === "d-tarifs" && <Sec title={t("tarifVolume")} sub={t("tarifVolSub")}>
        {(() => {
          const tierConditions = [
            ["Paiement unique / Pago único","Envoi payant / Envío de pago","Présentoir en option / Expositor opcional","PVP 45-50 €"],
            ["Paiement unique / Pago único","Envoi payant / Envío de pago","1 présentoir inclus / 1 expositor incluido","PVP 45-50 €"],
            ["2 paiements à 30 jours / 2 pagos a 30 días","Envoi gratuit / Envío gratuito","2 présentoirs inclus / 2 expositores incluidos","PVP 45-50 €"],
            ["2 paiements à 30 jours / 2 pagos a 30 días","Envoi gratuit / Envío gratuito","3 présentoirs inclus / 3 expositores incluidos","PVP 45-50 €"],
            ["2 paiements 15/45 jours / 2 pagos 15/45 días","Envoi gratuit / Envío gratuito","3 présentoirs inclus / 3 expositores incluidos","Meilleur tarif / Mejor tarifa","PVP 45-50 €"]
          ];
          return <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,overflow:"hidden",marginBottom:16}}>
            <div style={{padding:"14px 16px",background:C.dk,color:C.bg}}>
              <div style={{fontSize:14,fontFamily:DP,fontWeight:600}}>{t("tarifs")} Essential & Icons</div>
            </div>
            {TIERS.map((tier, i) => {
              const isActive = essentialCount >= tier.min && essentialCount <= tier.max;
              const isOpen = expandedTier === i;
              return (
                <div key={i}>
                  <div onClick={() => setExpandedTier(isOpen ? -1 : i)} style={{display:"flex",alignItems:"center",padding:"12px 16px",borderBottom:"1px solid "+C.bg2,background:isActive?C.gn+"08":"transparent",cursor:"pointer",transition:"background 0.15s"}} onMouseEnter={e => {if(!isActive) e.currentTarget.style.background=C.bg}} onMouseLeave={e => {if(!isActive) e.currentTarget.style.background="transparent"}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontFamily:BD,fontWeight:600,color:C.dk}}>{tier.label} {t("unites")}</div>
                      <div style={{fontSize:10,fontFamily:BD,color:C.bl,marginTop:3,cursor:"pointer"}}>{isOpen ? "▲ Masquer" : "▼ Voir conditions"}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:16,fontFamily:BD,fontWeight:700,color:isActive?C.gn:C.dk}}>{fmt(tier.price)} €</div>
                      <div style={{fontSize:9,fontFamily:BD,color:C.gr}}>/ ud</div>
                    </div>
                    {isActive && <span style={{marginLeft:8,fontSize:9,fontFamily:BD,color:"#fff",background:C.gn,padding:"2px 8px",borderRadius:10,fontWeight:600}}>{t("votreTarif")}</span>}
                  </div>
                  {isOpen && <div style={{padding:"10px 16px 14px",background:isActive?C.gn+"05":C.bg,borderBottom:"1px solid "+C.ln}}>
                    {(tierConditions[i]||[]).map((cond, j) => (
                      <div key={j} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0",fontSize:11,fontFamily:BD,color:C.dk}}>
                        <span style={{color:C.gn,fontSize:10}}>✓</span> {cond}
                      </div>
                    ))}
                  </div>}
                </div>
              );
            })}
          </div>;
        })()}
        <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,overflow:"hidden",marginBottom:16}}>
          <div style={{padding:"14px 16px",background:"#7a5c3a",color:C.bg}}>
            <div style={{fontSize:14,fontFamily:DP,fontWeight:600}}>{t("tarifs")} Acetato</div>
          </div>
          <div style={{display:"flex",alignItems:"center",padding:"14px 16px"}}>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontFamily:BD,fontWeight:600,color:C.dk}}>Prix unique / Precio único</div>
              <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:2}}>PVP 70 €</div>
            </div>
            <div style={{fontSize:16,fontFamily:BD,fontWeight:700,color:C.dk}}>{fmt(ACETATO_PRICE)} €</div>
            <span style={{marginLeft:8,fontSize:9,fontFamily:BD,color:C.gr}}>/ ud</span>
          </div>
        </div>
        <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:8,padding:"14px 16px"}}>
          <div style={{fontSize:11,fontFamily:BD,color:C.gr,lineHeight:1.6}}>
            • PVP Essential & Icons: 45-50 €<br/>
            • PVP Acetato: 70 €<br/>
            • {t("gratuit")} ≥ 20 {t("unites")}<br/>
            • Early pay: -3%
          </div>
        </div>
      </Sec>}

      {/* ═══ MESSAGES — Client/Distributor side ═══ */}
      {(view === "c-msg" || view === "d-msg") && <Sec title={"💬 "+t("atencionCliente")}>
        {(() => {
          const myConvs = conversations.filter(c => c.clientEmail === user.email || c.clientCompany === user.co);
          if (activeConv) {
            const conv = myConvs.find(c => c.id === activeConv) || (activeConv === "new" ? {id:"new", subject:"", topic:"otro", orderRef:"", status:"open", messages:[]} : null);
            if (!conv) { setActiveConv(null); return null; }
            const isNew = conv.id === "new";
            return <div>
              <button onClick={() => { setActiveConv(null); setMsgReplyText(""); }} style={{padding:"6px 12px",background:"transparent",color:C.gr,border:"1px solid "+C.ln,borderRadius:4,fontSize:11,fontFamily:BD,cursor:"pointer",marginBottom:14}}>← {t("mensajes")}</button>
              {isNew ? <>
                <div style={{fontSize:18,fontFamily:DP,fontWeight:500,color:C.dk,marginBottom:14}}>✉️ {t("nuevoMensaje")}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                  <div>
                    <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:4}}>{t("selecTema")}</div>
                    <select value={conv.topic||"otro"} onChange={e => setConversations(p => p)} id="newConvTopic" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                      <option value="pedido">📦 {t("temaPedido")}</option>
                      <option value="producto">🕶 {t("temaProducto")}</option>
                      <option value="facturacion">💼 {t("temaFacturacion")}</option>
                      <option value="devolucion">↩️ {t("temaDevolucion")}</option>
                      <option value="comercial">🤝 {t("temaComercial")}</option>
                      <option value="otro">💬 {t("temaOtro")}</option>
                    </select>
                  </div>
                  <div>
                    <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:4}}>{t("refPedido")}</div>
                    <input id="newConvOrderRef" placeholder="#MN-0010" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                  </div>
                </div>
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:4}}>{t("asunto")} *</div>
                  <input id="newConvSubject" placeholder="..." style={{width:"100%",padding:10,border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:13,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                </div>
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:4}}>{t("mensaje")} *</div>
                  <textarea id="newConvBody" rows={5} placeholder="..." style={{width:"100%",padding:10,border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
                </div>
                <button onClick={async () => {
                  const topic = document.getElementById("newConvTopic").value;
                  const orderRef = document.getElementById("newConvOrderRef").value;
                  const subject = document.getElementById("newConvSubject").value;
                  const body = document.getElementById("newConvBody").value;
                  if (!subject || !body) { toast("Falta asunto o mensaje","error"); return; }
                  const newConvObj = {id:Date.now(), clientEmail:user.email, clientName:user.name, clientCompany:user.co, subject, topic, orderRef, status:"open", createdAt:new Date().toISOString(), updatedAt:new Date().toISOString(), messages:[{id:Date.now()+1, from:user.email, fromName:user.name, fromRole:role, text:body, date:new Date().toISOString(), read:false}]};
                  setConversations(p => [newConvObj, ...p]);
                  if (dbReady) {
                    try {
                      const {data:cv} = await supabase.from("conversations").insert({client_email:user.email,client_name:user.name,client_company:user.co,subject,topic,order_ref:orderRef||null,status:"open"}).select().single();
                      if (cv) await supabase.from("messages").insert({conversation_id:cv.id, sender_email:user.email, sender_name:user.name, sender_role:role, content:body});
                    } catch(e) { console.log("msg save:", e); }
                  }
                  setActiveConv(null);
                }} style={{padding:"10px 20px",background:C.dk,color:C.bg,border:"none",borderRadius:5,fontSize:12,fontFamily:BD,fontWeight:600,cursor:"pointer"}}>{t("enviar")} →</button>
              </> : <>
                <div style={{marginBottom:14,padding:"14px 16px",background:C.wh,border:"1px solid "+C.ln,borderRadius:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,flexWrap:"wrap"}}>
                    <div>
                      <div style={{fontSize:16,fontFamily:DP,fontWeight:500,color:C.dk}}>{conv.subject}</div>
                      <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginTop:4}}>
                        <span style={{padding:"2px 8px",background:C.bg,borderRadius:10,marginRight:6}}>{conv.topic === "pedido" ? "📦 "+t("temaPedido") : conv.topic === "producto" ? "🕶 "+t("temaProducto") : conv.topic === "facturacion" ? "💼 "+t("temaFacturacion") : conv.topic === "devolucion" ? "↩️ "+t("temaDevolucion") : conv.topic === "comercial" ? "🤝 "+t("temaComercial") : "💬 "+t("temaOtro")}</span>
                        {conv.orderRef && <span style={{color:C.bl,fontWeight:600}}>{conv.orderRef}</span>}
                      </div>
                    </div>
                    <Badge l={conv.status === "closed" ? t("conversacionCerrada") : t("abiertas")} c={conv.status === "closed" ? C.gr : C.gn} />
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14,maxHeight:480,overflowY:"auto"}}>
                  {conv.messages.map(m => {
                    const isMine = m.from === user.email;
                    return <div key={m.id} style={{alignSelf:isMine?"flex-end":"flex-start",maxWidth:"75%"}}>
                      <div style={{fontSize:9,fontFamily:BD,color:C.gr,marginBottom:3,textAlign:isMine?"right":"left",fontWeight:600}}>{isMine ? t("yo") : (m.fromRole === "admin" || m.fromRole === "team" ? t("equipoMinue") : m.fromName)} · {new Date(m.date).toLocaleString("es-ES",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}</div>
                      <div style={{background:isMine?C.dk:C.wh,color:isMine?C.bg:C.dk,padding:"10px 14px",borderRadius:isMine?"12px 12px 4px 12px":"12px 12px 12px 4px",fontSize:12,fontFamily:BD,lineHeight:1.5,border:isMine?"none":"1px solid "+C.ln,whiteSpace:"pre-line"}}>{m.text}</div>
                    </div>;
                  })}
                </div>
                {conv.status === "open" ? <div>
                  <textarea value={msgReplyText} onChange={e => setMsgReplyText(e.target.value)} rows={3} placeholder={t("escribirRespuesta")} style={{width:"100%",padding:10,border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical",marginBottom:8}} />
                  <button onClick={async () => {
                    if (!msgReplyText.trim()) return;
                    const newMsg = {id:Date.now(), from:user.email, fromName:user.name, fromRole:role, text:msgReplyText, date:new Date().toISOString(), read:false};
                    setConversations(p => p.map(c => c.id === conv.id ? {...c, messages:[...c.messages, newMsg], updatedAt:new Date().toISOString()} : c));
                    if (dbReady) { try { await supabase.from("messages").insert({conversation_id:conv.id, sender_email:user.email, sender_name:user.name, sender_role:role, content:msgReplyText}); await supabase.from("conversations").update({updated_at:new Date().toISOString()}).eq("id",conv.id); } catch(e){} }
                    setMsgReplyText("");
                  }} style={{padding:"8px 18px",background:C.dk,color:C.bg,border:"none",borderRadius:4,fontSize:11,fontFamily:BD,fontWeight:600,cursor:"pointer"}}>{t("enviar")} →</button>
                </div> : <div style={{fontSize:11,fontFamily:BD,color:C.gr,textAlign:"center",padding:14,background:C.bg,borderRadius:6}}>{t("conversacionCerrada")}</div>}
              </>}
            </div>;
          }
          return <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
              <div style={{fontSize:11,fontFamily:BD,color:C.gr}}>{myConvs.length} {myConvs.length === 1 ? t("mensajes").toLowerCase().slice(0,-1) : t("mensajes").toLowerCase()}</div>
              <button onClick={() => setActiveConv("new")} style={{padding:"8px 16px",background:C.dk,color:C.bg,border:"none",borderRadius:5,fontSize:11,fontFamily:BD,fontWeight:600,cursor:"pointer"}}>+ {t("nuevoMensaje")}</button>
            </div>
            {myConvs.length === 0 ? <div style={{textAlign:"center",padding:"60px 20px"}}>
              <div style={{fontSize:48,marginBottom:14,color:C.ln}}>💬</div>
              <div style={{fontSize:14,fontFamily:BD,color:C.gr,maxWidth:380,margin:"0 auto",lineHeight:1.6}}>{t("sinMensajes")}</div>
              <div style={{fontSize:11,fontFamily:BD,color:C.gr2,marginTop:8}}>{t("iniciaConversacion")}</div>
              <button onClick={() => setActiveConv("new")} style={{marginTop:20,padding:"10px 20px",background:C.dk,color:C.bg,border:"none",borderRadius:5,fontSize:11,fontFamily:BD,fontWeight:600,cursor:"pointer"}}>+ {t("nuevoMensaje")}</button>
            </div> : <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {myConvs.map(c => {
                const lastMsg = c.messages[c.messages.length-1];
                const unread = c.messages.filter(m => m.from !== user.email && !m.read).length;
                return <div key={c.id} onClick={() => { setActiveConv(c.id); if (unread > 0 && dbReady) { try { supabase.from("messages").update({read_at:new Date().toISOString()}).eq("conversation_id",c.id).neq("sender_email",user.email).is("read_at",null); } catch(e){} setConversations(p => p.map(x => x.id === c.id ? {...x, messages:x.messages.map(m => ({...m, read:true}))} : x)); } }} style={{padding:"14px 16px",background:unread > 0 ? "#fff8e6" : C.wh,border:"1px solid "+(unread > 0 ? "#f0a020"+"40" : C.ln),borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:36,height:36,borderRadius:18,background:unread > 0 ? "#f0a020"+"20" : C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{c.topic === "pedido" ? "📦" : c.topic === "producto" ? "🕶" : c.topic === "facturacion" ? "💼" : c.topic === "devolucion" ? "↩️" : c.topic === "comercial" ? "🤝" : "💬"}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"baseline",gap:8,flexWrap:"wrap"}}>
                      <span style={{fontSize:13,fontFamily:BD,fontWeight:unread > 0 ? 700 : 600,color:C.dk}}>{c.subject}</span>
                      {c.orderRef && <span style={{fontSize:10,fontFamily:BD,color:C.bl}}>{c.orderRef}</span>}
                    </div>
                    <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{lastMsg ? lastMsg.text.substring(0,80) : ""}</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                    <span style={{fontSize:9,fontFamily:BD,color:C.gr}}>{new Date(c.updatedAt).toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit"})}</span>
                    {unread > 0 && <span style={{minWidth:18,height:18,padding:"0 6px",borderRadius:9,background:"#e74c3c",color:"#fff",fontSize:9,fontFamily:BD,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{unread}</span>}
                    {c.status === "closed" && <Badge l={t("cerradas")} c={C.gr} />}
                  </div>
                </div>;
              })}
            </div>}
          </>;
        })()}
      </Sec>}

      {/* ═══ MESSAGES — Admin/Team side ═══ */}
      {view === "a-msg" && <Sec title={"💬 "+t("mensajes")}>
        {(() => {
          if (activeConv) {
            const conv = conversations.find(c => c.id === activeConv);
            if (!conv) { setActiveConv(null); return null; }
            return <div>
              <button onClick={() => { setActiveConv(null); setMsgReplyText(""); }} style={{padding:"6px 12px",background:"transparent",color:C.gr,border:"1px solid "+C.ln,borderRadius:4,fontSize:11,fontFamily:BD,cursor:"pointer",marginBottom:14}}>← {t("todasConversaciones")}</button>
              <div style={{marginBottom:14,padding:"14px 16px",background:C.wh,border:"1px solid "+C.ln,borderRadius:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,flexWrap:"wrap"}}>
                  <div>
                    <div style={{fontSize:16,fontFamily:DP,fontWeight:500,color:C.dk}}>{conv.subject}</div>
                    <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginTop:4}}>
                      <span style={{fontWeight:700,color:C.dk}}>{conv.clientCompany || conv.clientName}</span> ({conv.clientEmail})
                    </div>
                    <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginTop:4}}>
                      <span style={{padding:"2px 8px",background:C.bg,borderRadius:10,marginRight:6}}>{conv.topic === "pedido" ? "📦 "+t("temaPedido") : conv.topic === "producto" ? "🕶 "+t("temaProducto") : conv.topic === "facturacion" ? "💼 "+t("temaFacturacion") : conv.topic === "devolucion" ? "↩️ "+t("temaDevolucion") : conv.topic === "comercial" ? "🤝 "+t("temaComercial") : "💬 "+t("temaOtro")}</span>
                      {conv.orderRef && <span style={{color:C.bl,fontWeight:600}}>{conv.orderRef}</span>}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <Badge l={conv.status === "closed" ? t("conversacionCerrada") : t("abiertas")} c={conv.status === "closed" ? C.gr : C.gn} />
                    <button onClick={async () => { const ns = conv.status === "open" ? "closed" : "open"; setConversations(p => p.map(c => c.id === conv.id ? {...c, status:ns} : c)); if (dbReady) { try { await supabase.from("conversations").update({status:ns}).eq("id",conv.id); } catch(e){} } }} style={{padding:"4px 10px",background:"transparent",color:C.gr,border:"1px solid "+C.ln,borderRadius:4,fontSize:10,fontFamily:BD,cursor:"pointer"}}>{conv.status === "open" ? t("cerrarConversacion") : t("abrirConversacion")}</button>
                  </div>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14,maxHeight:480,overflowY:"auto"}}>
                {conv.messages.map(m => {
                  const isMine = m.fromRole === "admin" || m.fromRole === "team";
                  return <div key={m.id} style={{alignSelf:isMine?"flex-end":"flex-start",maxWidth:"75%"}}>
                    <div style={{fontSize:9,fontFamily:BD,color:C.gr,marginBottom:3,textAlign:isMine?"right":"left",fontWeight:600}}>{isMine ? t("equipoMinue") : m.fromName} · {new Date(m.date).toLocaleString("es-ES",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}</div>
                    <div style={{background:isMine?C.dk:C.wh,color:isMine?C.bg:C.dk,padding:"10px 14px",borderRadius:isMine?"12px 12px 4px 12px":"12px 12px 12px 4px",fontSize:12,fontFamily:BD,lineHeight:1.5,border:isMine?"none":"1px solid "+C.ln,whiteSpace:"pre-line"}}>{m.text}</div>
                  </div>;
                })}
              </div>
              {conv.status === "open" ? <div>
                <textarea value={msgReplyText} onChange={e => setMsgReplyText(e.target.value)} rows={3} placeholder={t("escribirRespuesta")} style={{width:"100%",padding:10,border:"1px solid "+C.ln,borderRadius:4,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical",marginBottom:8}} />
                <button onClick={async () => {
                  if (!msgReplyText.trim()) return;
                  const newMsg = {id:Date.now(), from:user.email, fromName:user.name, fromRole:role, text:msgReplyText, date:new Date().toISOString(), read:false};
                  setConversations(p => p.map(c => c.id === conv.id ? {...c, messages:[...c.messages, newMsg], updatedAt:new Date().toISOString()} : c));
                  if (dbReady) { try { await supabase.from("messages").insert({conversation_id:conv.id, sender_email:user.email, sender_name:user.name, sender_role:role, content:msgReplyText}); await supabase.from("conversations").update({updated_at:new Date().toISOString()}).eq("id",conv.id); } catch(e){} }
                  setMsgReplyText("");
                }} style={{padding:"8px 18px",background:C.dk,color:C.bg,border:"none",borderRadius:4,fontSize:11,fontFamily:BD,fontWeight:600,cursor:"pointer"}}>{t("responder")} →</button>
              </div> : <div style={{fontSize:11,fontFamily:BD,color:C.gr,textAlign:"center",padding:14,background:C.bg,borderRadius:6}}>{t("conversacionCerrada")}</div>}
            </div>;
          }
          // Inbox
          const filtered = conversations.filter(c => {
            if (msgFilter === "all") return true;
            if (msgFilter === "unread") return c.messages.some(m => (m.fromRole !== "admin" && m.fromRole !== "team") && !m.read);
            if (msgFilter === "open") return c.status === "open";
            if (msgFilter === "closed") return c.status === "closed";
            return true;
          });
          const unreadTotal = conversations.reduce((s,c) => s + c.messages.filter(m => (m.fromRole !== "admin" && m.fromRole !== "team") && !m.read).length, 0);
          return <>
            <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
              {[["all",t("todasConversaciones"),conversations.length],["unread",t("noLeidos"),unreadTotal],["open",t("abiertas"),conversations.filter(c => c.status === "open").length],["closed",t("cerradas"),conversations.filter(c => c.status === "closed").length]].map(([v,l,n]) => (
                <button key={v} onClick={() => setMsgFilter(v)} style={{padding:"6px 14px",background:msgFilter===v?C.dk:"transparent",color:msgFilter===v?C.bg:C.gr,border:"1px solid "+(msgFilter===v?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:500,borderRadius:20}}>{l} {n > 0 && <span style={{marginLeft:4,opacity:0.7}}>({n})</span>}</button>
              ))}
            </div>
            {filtered.length === 0 ? <div style={{textAlign:"center",padding:"60px 20px"}}>
              <div style={{fontSize:48,marginBottom:14,color:C.ln}}>📭</div>
              <div style={{fontSize:14,fontFamily:BD,color:C.gr}}>{t("sinMensajes")}</div>
            </div> : <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {filtered.map(c => {
                const lastMsg = c.messages[c.messages.length-1];
                const unread = c.messages.filter(m => (m.fromRole !== "admin" && m.fromRole !== "team") && !m.read).length;
                return <div key={c.id} onClick={() => { setActiveConv(c.id); if (unread > 0 && dbReady) { try { supabase.from("messages").update({read_at:new Date().toISOString()}).eq("conversation_id",c.id).neq("sender_email",user.email).is("read_at",null); } catch(e){} setConversations(p => p.map(x => x.id === c.id ? {...x, messages:x.messages.map(m => ({...m, read:true}))} : x)); } }} style={{padding:"14px 16px",background:unread > 0 ? "#fff8e6" : C.wh,border:"1px solid "+(unread > 0 ? "#f0a020"+"40" : C.ln),borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:36,height:36,borderRadius:18,background:unread > 0 ? "#f0a020"+"20" : C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{c.topic === "pedido" ? "📦" : c.topic === "producto" ? "🕶" : c.topic === "facturacion" ? "💼" : c.topic === "devolucion" ? "↩️" : c.topic === "comercial" ? "🤝" : "💬"}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"baseline",gap:8,flexWrap:"wrap"}}>
                      <span style={{fontSize:12,fontFamily:BD,fontWeight:unread > 0 ? 700 : 600,color:C.dk}}>{c.clientCompany || c.clientName}</span>
                      <span style={{fontSize:11,fontFamily:BD,color:C.gr}}>· {c.subject}</span>
                      {c.orderRef && <span style={{fontSize:10,fontFamily:BD,color:C.bl}}>{c.orderRef}</span>}
                    </div>
                    <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{lastMsg ? lastMsg.text.substring(0,90) : ""}</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                    <span style={{fontSize:9,fontFamily:BD,color:C.gr}}>{new Date(c.updatedAt).toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit"})}</span>
                    {unread > 0 && <span style={{minWidth:18,height:18,padding:"0 6px",borderRadius:9,background:"#e74c3c",color:"#fff",fontSize:9,fontFamily:BD,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{unread}</span>}
                    {c.status === "closed" && <Badge l={t("cerradas")} c={C.gr} />}
                  </div>
                </div>;
              })}
            </div>}
          </>;
        })()}
      </Sec>}

      {/* ═══ MY FAVORITES ═══ */}
      {(view === "c-fav" || view === "d-fav") && <Sec title={t("misFavoritos")}>
        {(() => {
          const favProducts = favs.map(id => products.find(p => p.id === id)).filter(Boolean);
          if (favProducts.length === 0) {
            return <div style={{textAlign:"center",padding:"60px 20px"}}>
              <div style={{fontSize:48,marginBottom:14,color:C.ln}}>♡</div>
              <div style={{fontSize:14,fontFamily:BD,color:C.gr,maxWidth:380,margin:"0 auto",lineHeight:1.6}}>{t("sinFavoritos")}</div><Btn onClick={() => setView(role==="distributor"?"d-cat":"c-cat")} style={{marginTop:18}}>{t("descubrirCol")} →</Btn>
              <Btn onClick={() => setView(role==="distributor"?"d-cat":"c-cat")} style={{marginTop:20}}>{t("exploraCatalogo")} →</Btn>
            </div>;
          }
          return <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
              <div style={{fontSize:12,fontFamily:BD,color:C.gr}}>{favProducts.length} {favProducts.length === 1 ? t("favoritos").toLowerCase().replace(/s$/,"") : t("favoritos").toLowerCase()}</div>
              <button onClick={() => { favProducts.forEach(p => { if(p.stock > 0) addToCart(p.id, 1); }); }} style={{padding:"8px 16px",background:C.dk,color:C.bg,border:"none",borderRadius:4,fontSize:11,fontFamily:BD,fontWeight:600,cursor:"pointer"}}>🛒 {t("añadirTodoCarrito")}</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(160px, calc(50% - 6px)),1fr))",gap:12}}>
              {favProducts.map(p => {
                const isAcetato = p.col === "Acetato";
                const displayPrice = isAcetato ? p.fixedPrice : (customPrice > 0 ? customPrice : essentialUnitPrice);
                return <div key={p.id} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,overflow:"hidden",position:"relative"}}>
                  <button onClick={() => { setFavs(f => f.filter(x => x !== p.id)); dbToggleFav(p.id); }} style={{position:"absolute",top:8,right:8,zIndex:1,background:"rgba(255,255,255,0.95)",border:"none",cursor:"pointer",width:28,height:28,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#6b4c3b" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </button>
                  <div style={{height:140,background:C.wh,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",cursor:"pointer"}} onClick={() => { const mg = {model:p.model,col:p.col,colors:products.filter(x=>x.model===p.model),tags:new Set(p.tags||[])}; setSelectedModel(mg); setSelectedColorIdx(mg.colors.findIndex(c=>c.id===p.id)||0); setModal("viewModel"); }}>
                    {p.imageUrl ? <img src={p.imageUrl} style={{width:"100%",height:"100%",objectFit:"contain",padding:10}} /> : <span style={{fontSize:24,fontFamily:DP,color:C.ln}}>MINUË</span>}
                  </div>
                  <div style={{padding:"10px 14px",background:"#faf6f1"}}>
                    <div style={{fontSize:9,fontFamily:BD,color:isAcetato?"#7a5c3a":C.gr,background:isAcetato?"#e8d5c0":C.bg,padding:"2px 7px",borderRadius:10,display:"inline-block",marginBottom:4}}>{p.col}</div>
                    <div style={{fontSize:13,fontWeight:500,fontFamily:DP,color:C.dk}}>{p.model}</div>
                    <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginBottom:8}}>{p.color}</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:13,fontWeight:600,fontFamily:BD,color:C.dk}}>{fmt(displayPrice)} €</span>
                      <button onClick={() => addToCart(p.id, 1)} style={{padding:"6px 12px",background:C.dk,color:C.bg,border:"none",fontSize:10,cursor:"pointer",fontFamily:BD,borderRadius:3,fontWeight:600}}>+ 🛒</button>
                    </div>
                  </div>
                </div>;
              })}
            </div>
          </>;
        })()}
      </Sec>}

      {/* ═══ ADMIN ANALYTICS ═══ */}
      {view === "a-analytics" && <Sec title={t("analytics")} sub="Insights de productos y comportamiento de clientes">
        {(() => {
          // Compute global stats
          const soldByProd = {};
          const soldByModel = {};
          orders.forEach(o => (o.lines||[]).forEach(l => {
            const key = l.model+"|"+l.color;
            soldByProd[key] = (soldByProd[key]||0) + (l.qty||0);
            soldByModel[l.model] = (soldByModel[l.model]||0) + (l.qty||0);
          }));
          const topSold = Object.entries(soldByProd).sort((a,b) => b[1]-a[1]).slice(0,10).map(([k,qty]) => { const [m,c] = k.split("|"); return {p:products.find(x=>x.model===m&&x.color===c), qty}; }).filter(x => x.p);

          // Most favorited (needs to count favs across all users — placeholder: count from current user only for now, would need DB query)
          // For real: query supabase user_favorites grouped by product_id
          // We display only locally available favs as approx
          const favCount = {};
          favs.forEach(id => { favCount[id] = (favCount[id]||0) + 1; });
          // Approximate via recommendations + favs
          Object.values(recommendations).forEach(arr => arr.forEach(id => { favCount[id] = (favCount[id]||0) + 1; }));
          const topFavs = Object.entries(favCount).sort((a,b) => b[1]-a[1]).slice(0,10).map(([id,cnt]) => ({p:products.find(p => p.id == id), cnt})).filter(x => x.p);

          // Models top
          const topModels = Object.entries(soldByModel).sort((a,b) => b[1]-a[1]).slice(0,5);

          // Total stats
          const totalRevenue = orders.reduce((s,o) => s+o.total, 0);
          const totalUnits = orders.reduce((s,o) => s+o.items, 0);
          const totalOrders = orders.length;
          const totalClients = clients.length;
          const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
          const avgUnits = totalOrders > 0 ? totalUnits / totalOrders : 0;
          
          // Revenue per collection
          const revByCol = {Essential:0, Icons:0, Acetato:0};
          orders.forEach(o => (o.lines||[]).forEach(l => { revByCol[l.col||"Essential"] = (revByCol[l.col||"Essential"]||0) + (l.qty * l.price); }));

          // Status breakdown
          const statusBreak = {};
          orders.forEach(o => { statusBreak[o.status] = (statusBreak[o.status]||0)+1; });

          // Top clients
          const clientSales = {};
          orders.forEach(o => { clientSales[o.client] = (clientSales[o.client]||0) + o.total; });
          const topClients = Object.entries(clientSales).sort((a,b) => b[1]-a[1]).slice(0,5);

          return <>
            {/* KPIs */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10,marginBottom:24}}>
              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"14px 16px"}}>
                <div style={{fontSize:9,fontFamily:BD,color:C.gr,letterSpacing:0.5,fontWeight:600,marginBottom:4}}>CA TOTAL</div>
                <div style={{fontSize:22,fontFamily:DP,fontWeight:300,color:C.gn}}>{fmt(totalRevenue)} €</div>
              </div>
              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"14px 16px"}}>
                <div style={{fontSize:9,fontFamily:BD,color:C.gr,letterSpacing:0.5,fontWeight:600,marginBottom:4}}>PEDIDOS</div>
                <div style={{fontSize:22,fontFamily:DP,fontWeight:300,color:C.dk}}>{totalOrders}</div>
              </div>
              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"14px 16px"}}>
                <div style={{fontSize:9,fontFamily:BD,color:C.gr,letterSpacing:0.5,fontWeight:600,marginBottom:4}}>UDS VENDIDAS</div>
                <div style={{fontSize:22,fontFamily:DP,fontWeight:300,color:C.dk}}>{totalUnits}</div>
              </div>
              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"14px 16px"}}>
                <div style={{fontSize:9,fontFamily:BD,color:C.gr,letterSpacing:0.5,fontWeight:600,marginBottom:4}}>CESTA MEDIA</div>
                <div style={{fontSize:22,fontFamily:DP,fontWeight:300,color:C.dk}}>{fmt(avgOrder)} €</div>
              </div>
              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"14px 16px"}}>
                <div style={{fontSize:9,fontFamily:BD,color:C.gr,letterSpacing:0.5,fontWeight:600,marginBottom:4}}>UDS/PEDIDO</div>
                <div style={{fontSize:22,fontFamily:DP,fontWeight:300,color:C.dk}}>{avgUnits.toFixed(1)}</div>
              </div>
              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"14px 16px"}}>
                <div style={{fontSize:9,fontFamily:BD,color:C.gr,letterSpacing:0.5,fontWeight:600,marginBottom:4}}>CLIENTES</div>
                <div style={{fontSize:22,fontFamily:DP,fontWeight:300,color:C.dk}}>{totalClients}</div>
              </div>
            </div>

            {/* Top sellers + Top favorited */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:24}}>
              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,overflow:"hidden"}}>
                <div style={{padding:"12px 16px",borderBottom:"1px solid "+C.ln,background:C.bg}}>
                  <div style={{fontSize:13,fontFamily:BD,fontWeight:700,color:C.dk}}>🔥 {t("productosMasVendidos")}</div>
                </div>
                <div style={{padding:"4px 0"}}>
                  {topSold.length === 0 ? <div style={{padding:20,textAlign:"center",fontSize:11,color:C.gr,fontFamily:BD}}>—</div> :
                  topSold.map(({p,qty}, i) => <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 16px",borderBottom:i<topSold.length-1?"1px solid "+C.bg2:"none"}}>
                    <div style={{width:22,height:22,borderRadius:11,background:i<3?C.gn:C.bg,color:i<3?"#fff":C.gr,fontSize:11,fontFamily:BD,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</div>
                    <div style={{width:34,height:34,borderRadius:4,background:C.wh,border:"1px solid "+C.ln,overflow:"hidden",flexShrink:0}}>{p.imageUrl ? <img src={p.imageUrl} style={{width:"100%",height:"100%",objectFit:"contain"}} /> : null}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>{p.model}</div>
                      <div style={{fontSize:10,fontFamily:BD,color:C.gr}}>{p.color}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:14,fontFamily:BD,fontWeight:700,color:C.gn}}>{qty}</div>
                      <div style={{fontSize:8,fontFamily:BD,color:C.gr}}>{t("unidadesVendidas")}</div>
                    </div>
                  </div>)}
                </div>
              </div>

              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,overflow:"hidden"}}>
                <div style={{padding:"12px 16px",borderBottom:"1px solid "+C.ln,background:C.bg}}>
                  <div style={{fontSize:13,fontFamily:BD,fontWeight:700,color:C.dk}}>♥ {t("productosMasFavoritos")}</div>
                </div>
                <div style={{padding:"4px 0"}}>
                  {topFavs.length === 0 ? <div style={{padding:20,textAlign:"center",fontSize:11,color:C.gr,fontFamily:BD}}>—</div> :
                  topFavs.map(({p,cnt}, i) => <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 16px",borderBottom:i<topFavs.length-1?"1px solid "+C.bg2:"none"}}>
                    <div style={{width:22,height:22,borderRadius:11,background:i<3?"#6b4c3b":C.bg,color:i<3?"#fff":C.gr,fontSize:11,fontFamily:BD,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</div>
                    <div style={{width:34,height:34,borderRadius:4,background:C.wh,border:"1px solid "+C.ln,overflow:"hidden",flexShrink:0}}>{p.imageUrl ? <img src={p.imageUrl} style={{width:"100%",height:"100%",objectFit:"contain"}} /> : null}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>{p.model}</div>
                      <div style={{fontSize:10,fontFamily:BD,color:C.gr}}>{p.color}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:14,fontFamily:BD,fontWeight:700,color:"#6b4c3b"}}>{cnt}</div>
                      <div style={{fontSize:8,fontFamily:BD,color:C.gr}}>{t("porClientes")}</div>
                    </div>
                  </div>)}
                </div>
              </div>
            </div>

            {/* Top models bar chart */}
            <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"16px 20px",marginBottom:24}}>
              <div style={{fontSize:13,fontFamily:BD,fontWeight:700,color:C.dk,marginBottom:14}}>📊 Top 5 modelos por unidades vendidas</div>
              {topModels.length === 0 ? <div style={{textAlign:"center",fontSize:11,color:C.gr,fontFamily:BD,padding:20}}>—</div> :
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {topModels.map(([model,qty], i) => {
                  const max = topModels[0][1];
                  const pct = (qty/max)*100;
                  return <div key={model}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
                      <span style={{fontSize:12,fontFamily:BD,fontWeight:600,color:C.dk}}>{model}</span>
                      <span style={{fontSize:12,fontFamily:BD,fontWeight:700,color:C.gn}}>{qty} uds</span>
                    </div>
                    <div style={{height:14,background:C.bg,borderRadius:7,overflow:"hidden"}}>
                      <div style={{height:"100%",width:pct+"%",background:"linear-gradient(90deg,"+C.gn+","+C.gn+"cc)",borderRadius:7}} />
                    </div>
                  </div>;
                })}
              </div>}
            </div>

            {/* Revenue by collection */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"16px 20px"}}>
                <div style={{fontSize:13,fontFamily:BD,fontWeight:700,color:C.dk,marginBottom:14}}>💰 Ingresos por colección</div>
                {Object.entries(revByCol).map(([col,rev]) => {
                  const totalRev = Object.values(revByCol).reduce((s,r) => s+r, 0);
                  const pct = totalRev > 0 ? (rev/totalRev)*100 : 0;
                  const colorMap = {Essential:C.gn, Icons:"#b8860b", Acetato:"#7a5c3a"};
                  return <div key={col} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontFamily:BD,marginBottom:3}}>
                      <span style={{color:C.dk,fontWeight:600}}>{col}</span>
                      <span style={{color:C.gr}}>{fmt(rev)} € ({pct.toFixed(0)}%)</span>
                    </div>
                    <div style={{height:8,background:C.bg,borderRadius:4,overflow:"hidden"}}>
                      <div style={{height:"100%",width:pct+"%",background:colorMap[col]||C.gn,borderRadius:4}} />
                    </div>
                  </div>;
                })}
              </div>

              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"16px 20px"}}>
                <div style={{fontSize:13,fontFamily:BD,fontWeight:700,color:C.dk,marginBottom:14}}>👑 Top 5 clientes</div>
                {topClients.length === 0 ? <div style={{textAlign:"center",fontSize:11,color:C.gr,fontFamily:BD,padding:20}}>—</div> :
                topClients.map(([client,sales], i) => <div key={client} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:i<topClients.length-1?"1px solid "+C.bg2:"none"}}>
                  <div style={{width:22,height:22,borderRadius:11,background:"#d4a030"+(i<3?"":"30"),color:i<3?"#fff":C.gr,fontSize:11,fontFamily:BD,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{i+1}</div>
                  <span style={{flex:1,fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600}}>{client}</span>
                  <span style={{fontSize:12,fontFamily:BD,color:C.gn,fontWeight:700}}>{fmt(sales)} €</span>
                </div>)}
              </div>
            </div>
          </>;
        })()}
      </Sec>}

      {(view === "c-selection" || view === "d-selection") && <Sec title={t("selectionPrivee")} sub={t("selectionSub")}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12}}>
          {products.filter(p => (p.tags||[]).includes("privee") && (role==="admin"||role==="team"||p.active!==false)).map(p => renderCard(p))}
          {products.filter(p => (p.tags||[]).includes("privee") && (role==="admin"||role==="team"||p.active!==false)).length === 0 && <div style={{gridColumn:"1/-1",textAlign:"center",padding:40}}>
            <div style={{fontSize:20,fontFamily:DP,color:C.dk,marginBottom:8}}>{t("selectionPrivee")}</div>
            <div style={{fontSize:12,fontFamily:BD,color:C.gr}}>Bientôt disponible · Próximamente · Coming soon</div>
          </div>}
        </div>
      </Sec>}

      {view === "c-promo" && <Sec title={t("promosClient")} sub={t("promosSub")}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
          {promos.filter(p => p.on && (p.visible||[]).includes("client") && (!p.targetClients || p.targetClients.length === 0 || p.targetClients.includes(user.co))).map((p,i) => renderPromoCard(p, i, false))}
          {promos.filter(p => p.on && (p.visible||[]).includes("client") && (!p.targetClients || p.targetClients.length === 0 || p.targetClients.includes(user.co))).length === 0 && <p style={{color:C.gr,fontFamily:BD,fontSize:12}}>{t("aucuneCmd")}</p>}
        </div>
      </Sec>}

      {view === "c-news" && <Sec title={t("nouveautes")} sub={t("nouveautesSub")}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {news.filter(n => n.on).sort((a,b) => (b.pinned?1:0)-(a.pinned?1:0)).map((n,i) => (
            <div key={i} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,padding:"20px 22px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:16,fontWeight:500,fontFamily:DP,color:C.dk}}>{(n.title&&n.title[lang])||n.title?.fr||""}</span>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  {n.pinned && <span style={{fontSize:9,fontFamily:BD,color:C.yl,fontWeight:600}}>PINNED</span>}
                  <span style={{fontSize:10,fontFamily:BD,color:C.gr2}}>{n.date}</span>
                </div>
              </div>
              <div style={{fontSize:12,fontFamily:BD,color:C.gr,lineHeight:1.6}}>{(n.content&&n.content[lang])||n.content?.fr||""}</div>
              {n.url && <a href={n.url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,fontFamily:BD,color:C.bl,marginTop:6,display:"inline-block",textDecoration:"none",fontWeight:500}}>{t("voirPlus")} →</a>}
            </div>
          ))}
          {news.filter(n => n.on).length === 0 && <p style={{color:C.gr,fontFamily:BD,fontSize:12}}>{t("aucuneCmd")}</p>}
        </div>
      </Sec>}

      {view === "c-account" && <Sec title={t("monCompte")}>
        <div style={{maxWidth:640}}>
          {/* PERSONAL */}
          <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"20px 22px",marginBottom:16}}>
            <div style={{fontSize:14,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:14}}>{t("datosPersonales")}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("contact")}</div>
                <div style={{fontSize:13,fontFamily:BD,color:C.dk,padding:"9px 0"}}>{user.name}</div>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("email")}</div>
                <div style={{fontSize:13,fontFamily:BD,color:C.dk,padding:"9px 0"}}>{user.email}</div>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("entreprise")}</div>
                <div style={{fontSize:13,fontFamily:BD,color:C.dk,padding:"9px 0"}}>{user.co || "—"}</div>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("telephone")}</div>
                <div style={{fontSize:13,fontFamily:BD,color:C.dk,padding:"9px 0"}}>{user.phone || "—"}</div>
              </div>
            </div>
          </div>

          {/* SHIPPING */}
          <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"20px 22px",marginBottom:16}}>
            <div style={{fontSize:14,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:14}}>{t("dirEnvio")}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              {[[t("direccion"),"shippingAddress"],[t("ville"),"shippingCity"],[t("codePostal"),"shippingPostal"],[t("pays"),"shippingCountry"]].map(([l,k]) => (
                <div key={k} style={{marginBottom:12}}>
                  <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{l}</div>
                  <input value={accountData[k]||""} onChange={e => { setAccountData(p => ({...p,[k]:e.target.value})); setAccountSaved(false); }} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                </div>
              ))}
            </div>
          </div>

          {/* BILLING */}
          <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"20px 22px",marginBottom:16}}>
            <div style={{fontSize:14,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:14}}>{t("dirFacturacion")}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              {[[t("raisonSociale"),"companyName"],[t("nif"),"taxId"],[t("direccion"),"address"],[t("ville"),"city"],[t("codePostal"),"postalCode"],[t("pays"),"country"],[t("telephone"),"phone"],[t("emailLabel"),"companyEmail"]].map(([l,k]) => (
                <div key={k} style={{marginBottom:12}}>
                  <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{l}</div>
                  <input value={accountData[k]||""} onChange={e => { setAccountData(p => ({...p,[k]:e.target.value})); setAccountSaved(false); }} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                </div>
              ))}
            </div>
          </div>

          {/* BANK */}
          <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"20px 22px",marginBottom:16}}>
            <div style={{fontSize:14,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:14}}>{t("donneesBancaires")}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              {[[t("titulaire"),"bankHolder"],[t("iban"),"iban"],[t("bic"),"bic"]].map(([l,k]) => (
                <div key={k} style={{marginBottom:12}}>
                  <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{l}</div>
                  <input value={accountData[k]||""} onChange={e => { setAccountData(p => ({...p,[k]:e.target.value})); setAccountSaved(false); }} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                </div>
              ))}
            </div>
          </div>

          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <Btn onClick={() => { dbSaveAccountData(accountData); setAccountSaved(true); }}>{t("sauvegarder")}</Btn>
            {accountSaved && <span style={{fontSize:11,fontFamily:BD,color:C.gn,fontWeight:500}}>{t("donneesSauvees")}</span>}
          </div>
        </div>
      </Sec>}

      {/* DISTRIBUTOR VIEWS */}
      {view === "d-dash" && <>
        <div style={{padding:"min(30px, 6vw) min(24px, 4vw) min(20px, 4vw)",background:darkMode?"linear-gradient(135deg,#141c1a,#1e2d29)":"linear-gradient(135deg,"+CL.dk+","+CL.dk+"dd)",color:darkMode?"#e8dfd6":"#f8efe6"}}>
          <div style={{fontSize:"min(24px, 5vw)",fontFamily:DP,fontWeight:400,marginBottom:4}}>{t("bienvenida")}, {user.name} ✦</div>
          <div style={{fontSize:12,fontFamily:BD,opacity:0.6}}>{user.co}</div>
        </div>
        {(() => {
          const activeNews = news.filter(n => n.on).sort((a,b) => (b.pinned?1:0)-(a.pinned?1:0)).slice(0,3);
          if (activeNews.length === 0) return null;
          return <div style={{padding:"16px min(24px,4vw) 0"}}>
            <div style={{fontSize:14,fontFamily:DP,fontWeight:600,color:C.dk,marginBottom:10}}>📣 {t("novedadesTendencias")}</div>
            <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8,WebkitOverflowScrolling:"touch"}}>
              {activeNews.map(n => <div key={n.id} onClick={() => n.url ? window.open(n.url,"_blank") : setView(role==="distributor"?"d-news":"c-news")} style={{minWidth:240,maxWidth:300,flexShrink:0,background:"linear-gradient(135deg,"+CL.dk+","+"#1d4435)",borderRadius:14,padding:"16px 18px",cursor:"pointer",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:-30,right:-30,width:110,height:110,borderRadius:"50%",background:"radial-gradient(circle, rgba(196,149,106,0.25), transparent 70%)"}} />
                {n.pinned && <span style={{fontSize:8,fontFamily:BD,fontWeight:800,color:"#c4956a",letterSpacing:1.5,textTransform:"uppercase"}}>★ {t("nuevo")}</span>}
                <div style={{fontSize:14,fontFamily:DP,fontWeight:600,color:"#f8efe6",marginTop:4,lineHeight:1.3}}>{(n.title&&n.title[lang])||(n.title&&n.title.fr)||""}</div>
                <div style={{fontSize:10,fontFamily:BD,color:"#f8efe690",marginTop:6,lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{(n.content&&n.content[lang])||(n.content&&n.content.fr)||""}</div>
                <div style={{fontSize:9,fontFamily:BD,color:"#c4956a",marginTop:8,fontWeight:600}}>{n.date} →</div>
              </div>)}
            </div>
          </div>;
        })()}
        {(() => {
          const myP = prospects.filter(p => p.distributor === user.co);
          const pending = myP.filter(p => p.stage === "nuevo" || p.stage === "contactado").length;
          if (myP.length === 0) return null;
          return <div style={{margin:"14px min(24px,4vw) 0",background:"linear-gradient(135deg,#8e44ad12,#8e44ad06)",border:"1.5px solid #8e44ad35",borderRadius:12,padding:"14px 18px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",flexWrap:"wrap"}} onClick={() => setView("d-prospectos")}>
            <div style={{fontSize:26}}>🎯</div>
            <div style={{flex:1,minWidth:160}}>
              <div style={{fontSize:13,fontFamily:BD,fontWeight:700,color:C.dk}}>{t("prospectos")}: {myP.length}</div>
              <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:2}}>{pending > 0 ? pending+" "+t("etapaNuevo").toLowerCase()+"/"+t("etapaContactado").toLowerCase() : "✓"}</div>
            </div>
            <span style={{fontSize:11,fontFamily:BD,fontWeight:700,color:"#8e44ad"}}>→</span>
          </div>;
        })()}
        <div style={{padding:"20px min(24px, 4vw)"}}>
          {/* REFERRAL LINK */}
          {(() => {
            const myRef = user.referralCode || (user.co||"").toLowerCase().replace(/[^a-z0-9]/g,"") || user.email.split("@")[0].toLowerCase();
            const refUrl = (typeof window !== "undefined" ? window.location.origin : "https://b2b.minueopticians.com") + "/?ref=" + myRef;
            return <div style={{background:"linear-gradient(135deg,"+CL.gn+"12,"+CL.gn+"06)",border:"1px solid "+CL.gn+"30",borderRadius:10,padding:"16px 18px",marginBottom:18}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <div style={{fontSize:22}}>🔗</div>
                <div>
                  <div style={{fontSize:13,fontFamily:BD,fontWeight:700,color:C.dk}}>{t("miEnlaceInvitacion")}</div>
                  <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:2,lineHeight:1.5}}>{t("miEnlaceDesc")}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center",marginTop:10,flexWrap:"wrap"}}>
                <input value={refUrl} readOnly onClick={e => e.target.select()} style={{flex:1,minWidth:200,padding:"9px 12px",border:"1px solid "+C.ln,borderRadius:5,fontFamily:"monospace",fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} />
                <button onClick={() => { navigator.clipboard.writeText(refUrl); toast(t("enlaceCopiado")); }} style={{padding:"9px 16px",background:CL.gn,color:"#fff",border:"none",borderRadius:5,fontSize:11,fontFamily:BD,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>📋 {t("copiarEnlace")}</button>
              </div>
            </div>;
          })()}

          {/* GUIDE / ONBOARDING */}
          <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:10,marginBottom:18,overflow:"hidden"}}>
            <button onClick={() => setGuideOpen(!guideOpen)} style={{width:"100%",padding:"14px 18px",background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:10,textAlign:"left"}}>
              <div style={{fontSize:20}}>📚</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontFamily:BD,fontWeight:700,color:C.dk}}>{t("guiaUsoTitulo")}</div>
                <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:2}}>5 pasos clave para gestionar tu cartera</div>
              </div>
              <span style={{fontSize:18,color:C.gr,transform:guideOpen?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▾</span>
            </button>
            {guideOpen && <div style={{padding:"4px 18px 18px",borderTop:"1px solid "+C.bg2}}>
              {[
                ["1",t("paso1Titulo"),t("paso1Desc"),"🔗"],
                ["2",t("paso2Titulo"),t("paso2Desc"),"✓"],
                ["3",t("paso3Titulo"),t("paso3Desc"),"🛒"],
                ["4",t("paso4Titulo"),t("paso4Desc"),"💰"],
                ["5",t("paso5Titulo"),t("paso5Desc"),"ℹ️"]
              ].map(([n,title,desc,emo]) => <div key={n} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:"1px solid "+C.bg2}}>
                <div style={{width:28,height:28,borderRadius:14,background:CL.gn+"20",color:CL.gn,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontFamily:BD,fontWeight:700,flexShrink:0}}>{n}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontFamily:BD,fontWeight:700,color:C.dk,marginBottom:3}}>{emo} {title}</div>
                  <div style={{fontSize:11,fontFamily:BD,color:C.gr,lineHeight:1.5}}>{desc}</div>
                </div>
              </div>)}
              <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
                <button onClick={() => setView("d-cl")} style={{padding:"8px 14px",background:C.dk,color:C.bg,border:"none",borderRadius:5,fontSize:11,fontFamily:BD,fontWeight:600,cursor:"pointer"}}>+ {t("registrarManualmente")}</button>
                <button onClick={() => setView("d-cat")} style={{padding:"8px 14px",background:"transparent",color:C.dk,border:"1px solid "+C.dk,borderRadius:5,fontSize:11,fontFamily:BD,fontWeight:600,cursor:"pointer"}}>{t("descubrirCol")} →</button>
              </div>
            </div>}
          </div>

          {/* ORDER NOTIFICATIONS */}
          {distOrders.length > 0 && <div style={{marginBottom:20}}>
            <div style={{fontSize:14,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:10}}>{t("notifTitre")}</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {distOrders.slice(0,3).map((o,i) => (
                <div key={i} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={() => { setModal("viewOrd"); setEd({...o, idx:orders.indexOf(o)}); }}>
                  <span style={{fontSize:13,fontFamily:DP,color:C.dk,fontWeight:600}}>{o.id}</span>
                  <span style={{fontSize:12,fontFamily:BD,color:C.gr,flex:1}}>{o.client}</span>
                  <Badge l={SL[o.status]} c={SC[o.status]} />
                  <Badge l={PL[o.pay]} c={PC[o.pay]} />
                </div>
              ))}
            </div>
          </div>}

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:10,marginBottom:20}}>
            {renderKPI(t("ventesTot"), fmt(distSales)+" €")}
            {renderKPI(t("commTot")+" ("+(user.commRate||15)+"%)", fmt(distComm)+" €", C.gn)}
            {renderKPI(t("percue"), fmt(distPaid)+" €", C.gn)}
            {renderKPI(t("aPercevoir"), fmt(distInvoiced)+" €", distInvoiced > 0 ? C.yl : C.gn)}
          </div>

          {/* COMMISSIONS BREAKDOWN BY QUARTER */}
          {(() => {
            const now = new Date();
            const currYear = now.getFullYear();
            const currQuarter = Math.floor(now.getMonth()/3) + 1;
            const quarters = {};
            distOrders.forEach(o => {
              const d = o.date?.split("/"); if (!d || d.length !== 3) return;
              const month = parseInt(d[1]); const year = parseInt(d[2]);
              const q = Math.floor((month-1)/3) + 1;
              const key = year+"-Q"+q;
              if (!quarters[key]) quarters[key] = {year, quarter:q, orders:0, sales:0, comm:0, paid:0, pending:0};
              quarters[key].orders += 1;
              quarters[key].sales += o.total;
              quarters[key].comm += o.comm;
              if (o.pay === "paid") quarters[key].paid += o.comm;
              else quarters[key].pending += o.comm;
            });
            const sortedQs = Object.entries(quarters).sort(([a],[b]) => b.localeCompare(a)).slice(0,4);
            return <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"14px 16px",marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:6}}>
                <div style={{fontSize:13,fontFamily:BD,fontWeight:700,color:C.dk}}>💰 Resumen de comisiones por trimestre</div>
                <div style={{fontSize:10,fontFamily:BD,color:C.gr}}>Actual: Q{currQuarter} {currYear}</div>
              </div>
              {sortedQs.length === 0 ? <div style={{fontSize:11,fontFamily:BD,color:C.gr,padding:16,textAlign:"center"}}>Aún no hay pedidos</div> : <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {sortedQs.map(([key, q]) => {
                  const isCurrent = q.year === currYear && q.quarter === currQuarter;
                  return <div key={key} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:isCurrent?CL.gn+"10":C.bg,borderRadius:6,border:isCurrent?"1px solid "+CL.gn+"30":"1px solid "+C.ln,flexWrap:"wrap"}}>
                    <div style={{minWidth:90}}>
                      <div style={{fontSize:12,fontFamily:BD,fontWeight:700,color:C.dk}}>Q{q.quarter} {q.year}</div>
                      {isCurrent && <div style={{fontSize:9,fontFamily:BD,color:CL.gn,fontWeight:600}}>EN CURSO</div>}
                    </div>
                    <div style={{flex:"1 1 130px",fontSize:10,fontFamily:BD,color:C.gr}}>{q.orders} pedidos · {fmt(q.sales)} € ventas</div>
                    <div style={{textAlign:"right",minWidth:90}}>
                      <div style={{fontSize:9,fontFamily:BD,color:C.gr}}>Comisión</div>
                      <div style={{fontSize:14,fontFamily:BD,fontWeight:700,color:CL.gn}}>{fmt(q.comm)} €</div>
                    </div>
                    {q.pending > 0 && <div style={{fontSize:9,fontFamily:BD,color:"#f0a020",padding:"3px 7px",background:"#fff8e6",borderRadius:3,fontWeight:600}}>{fmt(q.pending)} € pendiente</div>}
                    <button onClick={() => {
                      // Generate PDF/print
                      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Comisión Q${q.quarter} ${q.year} — ${user.co}</title><style>
                        @page { margin: 2cm; size: A4; }
                        body { font-family: 'Helvetica Neue', Arial, sans-serif; color:#18332f; line-height:1.5; padding:0; }
                        h1 { font-family: Georgia, serif; font-weight:400; font-size:28px; color:#18332f; margin:0 0 4px; }
                        .sub { font-size:11px; color:#888; letter-spacing:2px; text-transform:uppercase; margin-bottom:30px; }
                        .header { display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #18332f; padding-bottom:14px; margin-bottom:30px; }
                        .right { text-align:right; font-size:11px; }
                        table { width:100%; border-collapse:collapse; font-size:11px; margin-bottom:20px; }
                        th { background:#18332f; color:#f8efe6; padding:10px; text-align:left; font-weight:500; font-size:10px; letter-spacing:1px; text-transform:uppercase; }
                        td { padding:9px 10px; border-bottom:1px solid #eaeaea; }
                        .totals { background:#f8efe6; padding:18px 22px; border-radius:8px; margin-top:20px; }
                        .totals-row { display:flex; justify-content:space-between; padding:6px 0; font-size:13px; }
                        .totals-row.grand { border-top:2px solid #18332f; padding-top:12px; margin-top:8px; font-weight:700; font-size:18px; }
                        .footer { margin-top:40px; padding-top:16px; border-top:1px solid #ddd; font-size:9px; color:#888; line-height:1.6; }
                      </style></head><body>
                        <div class="header">
                          <div>
                            <h1>Liquidación de comisiones</h1>
                            <div class="sub">Q${q.quarter} ${q.year} — Minuë Opticians</div>
                          </div>
                          <div class="right">
                            <strong>${user.co}</strong><br>
                            ${user.name}<br>
                            ${user.email}<br>
                            Comisión: ${user.commRate||15}%
                          </div>
                        </div>

                        <table>
                          <thead><tr><th>Nº Pedido</th><th>Fecha</th><th>Cliente</th><th style="text-align:right">Importe</th><th style="text-align:right">Comisión</th><th>Estado</th></tr></thead>
                          <tbody>
                            ${distOrders.filter(o => { const d = o.date?.split("/"); if(!d) return false; const m = parseInt(d[1]); const y = parseInt(d[2]); return y === q.year && Math.floor((m-1)/3)+1 === q.quarter; }).map(o => `<tr><td>${o.id}</td><td>${o.date}</td><td>${o.client}</td><td style="text-align:right">${fmt(o.total)} €</td><td style="text-align:right;color:#18332f;font-weight:600">${fmt(o.comm)} €</td><td>${o.pay==="paid"?"✓ Pagado":"⏱ Pendiente"}</td></tr>`).join("")}
                          </tbody>
                        </table>

                        <div class="totals">
                          <div class="totals-row"><span>Ventas totales</span><span><strong>${fmt(q.sales)} €</strong></span></div>
                          <div class="totals-row"><span>Comisión cobrada</span><span style="color:#1f9e6e"><strong>${fmt(q.paid)} €</strong></span></div>
                          <div class="totals-row"><span>Comisión pendiente</span><span style="color:#f0a020"><strong>${fmt(q.pending)} €</strong></span></div>
                          <div class="totals-row grand"><span>TOTAL COMISIÓN Q${q.quarter}</span><span>${fmt(q.comm)} €</span></div>
                        </div>

                        <div class="footer">
                          <strong>Instrucciones para facturar a Minuë Opticians:</strong><br>
                          Emite tu factura por importe de <strong>${fmt(q.comm)} €</strong> + IVA correspondiente.<br>
                          Concepto: "Comisión comercial Q${q.quarter} ${q.year} — Minuë Opticians"<br>
                          Envío: hola@minueopticians.com<br>
                          Datos bancarios Minuë: ES11 2100 8447 6202 0010 9299 (CaixaBank, BIC: CAIXESBBXXX)<br><br>
                          Generado el ${new Date().toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"})} desde b2b.minueopticians.com
                        </div>
                      </body></html>`;
                      const w = window.open("","_blank");
                      w.document.write(html);
                      w.document.close();
                      setTimeout(() => w.print(), 500);
                    }} style={{padding:"6px 12px",background:C.dk,color:C.bg,border:"none",borderRadius:4,fontSize:10,fontFamily:BD,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>📄 PDF</button>
                  </div>;
                })}
              </div>}
            </div>;
          })()}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>
            <div>
              <div style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:8}}>{t("dernieresCmd")}</div>
              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>{distOrders.slice(0,5).map((o,i) => renderOrderRow(o, i, true, false))}</div>
            </div>
            <div>
              <div style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:8}}>{t("mesClients")}</div>
              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6}}>
                {distClients.map(c => { const cOrds = distOrders.filter(o => o.client === c.name); return {...c, _total: cOrds.reduce((s,o) => s+o.total, 0), _orders: cOrds.length}; }).sort((a,b) => b._total - a._total).map((c, i) => <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 14px",borderBottom:"1px solid "+C.bg2}}><div><div style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>{c.name}</div><div style={{fontSize:10,color:C.gr,fontFamily:BD}}>{c.contact} · {c.city} · {c._orders} cmd</div></div><span style={{fontSize:12,fontWeight:600,fontFamily:BD,color:c._total>0?C.gn:C.gr}}>{fmt(c._total)} €</span></div>)}
              </div>
            </div>
          </div>
        </div>
      </>}

      {view === "d-cat" && <Sec title={t("collSS26")} sub={t("collSub")} right={<input placeholder={t("rechercher")} value={filter} onChange={e => setFilter(e.target.value)} style={{padding:"8px 14px",border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.wh,color:C.dk,width:"min(200px, 40vw)"}} />}>
        <div style={{display:"flex",gap:6,marginBottom:10,alignItems:"center",flexWrap:"wrap"}}>
          {[["all","Tout"],["Essential","Essential"],["Icons","Icons"],["Acetato","Acetato"]].map(([v,l]) => (
            <button key={v} onClick={() => { setColFilter(v); setFavFilter(false); }} style={{padding:"5px 14px",background:colFilter===v&&!favFilter?C.dk:"transparent",color:colFilter===v&&!favFilter?C.bg:C.gr,border:"1px solid "+(colFilter===v&&!favFilter?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:500,borderRadius:20}}>{l}</button>
          ))}
          {favs.length > 0 && <button onClick={() => setFavFilter(!favFilter)} style={{padding:"5px 12px",background:favFilter?"#6b4c3b":"transparent",color:favFilter?"#fff":"#6b4c3b",border:"1px solid "+(favFilter?"#6b4c3b":C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:500,borderRadius:20,display:"flex",alignItems:"center",gap:4}}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill={favFilter?"#fff":"#6b4c3b"} stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> {favs.length}
          </button>}
          <span style={{flex:1}} />
          <button onClick={() => setFilterPanel(filterPanel==="shape"?null:"shape")} style={{padding:"5px 12px",background:filterPanel==="shape"?C.dk:shapeFilter!=="all"?C.dk+"15":"transparent",color:filterPanel==="shape"?C.bg:shapeFilter!=="all"?C.dk:C.gr,border:"1px solid "+(filterPanel==="shape"||shapeFilter!=="all"?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,borderRadius:20,display:"flex",alignItems:"center",gap:4}}>
            {t("forme")}{shapeFilter!=="all"&&<span style={{width:6,height:6,borderRadius:3,background:filterPanel==="shape"?C.bg:C.dk}} />}
          </button>
          <button onClick={() => setFilterPanel(filterPanel==="color"?null:"color")} style={{padding:"5px 12px",background:filterPanel==="color"?C.dk:colorFilter!=="all"?C.dk+"15":"transparent",color:filterPanel==="color"?C.bg:colorFilter!=="all"?C.dk:C.gr,border:"1px solid "+(filterPanel==="color"||colorFilter!=="all"?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,borderRadius:20,display:"flex",alignItems:"center",gap:4}}>
            {t("couleur")}{colorFilter!=="all"&&<span style={{width:6,height:6,borderRadius:3,background:filterPanel==="color"?C.bg:C.dk}} />}
          </button>
        </div>
        {filterPanel==="shape"&&<div style={{display:"flex",gap:4,marginBottom:10,flexWrap:"wrap",padding:"10px 14px",background:C.wh,borderRadius:6,border:"1px solid "+C.ln}}>
          {[["all","toutes"],["ronde","ronde"],["carree","carree"],["catEye","catEye"],["rectangulaire","rectangulaire"],["aviateur","aviateur"],["oversize","oversize"],["geometrique","geometrique"]].map(([v,k]) => (
            <button key={v} onClick={() => { setShapeFilter(v); if(v!=="all") setFilterPanel(null); }} style={{padding:"5px 12px",background:shapeFilter===v?C.dk:"transparent",color:shapeFilter===v?C.bg:C.dk,border:"1px solid "+(shapeFilter===v?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,borderRadius:20}}>{v==="all"?t("toutes"):t(k)}</button>
          ))}
        </div>}
        {filterPanel==="color"&&<div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap",padding:"10px 14px",background:C.wh,borderRadius:6,border:"1px solid "+C.ln,alignItems:"center"}}>
          <button onClick={() => { setColorFilter("all"); setFilterPanel(null); }} style={{padding:"4px 10px",background:colorFilter==="all"?C.dk:"transparent",color:colorFilter==="all"?C.bg:C.gr,border:"1px solid "+(colorFilter==="all"?C.dk:C.ln),cursor:"pointer",fontSize:9,fontFamily:BD,borderRadius:20}}>{t("tous")}</button>
          {[["noir","#1a1a1a"],["careyCol","#8B6914"],["marron","#7B4B2A"],["vert","#2d6b4f"],["dore","#C5A55A"],["rose","#D4839A"],["bleu","#3B6B9E"],["rougeVin","#722f37"],["orangeCol","#D4763A"],["cremeNude","#E8D5C0"],["gris","#8C8C8C"],["transparentCol","#f5f5f5"],["multicolore","conic-gradient(#e74c3c,#f1c40f,#2ecc71,#3498db,#e74c3c)"]].map(([v,bg]) => (
            <button key={v} onClick={() => { setColorFilter(v); setFilterPanel(null); }} title={t(v)} style={{width:26,height:26,borderRadius:13,background:bg,border:colorFilter===v?"3px solid "+C.dk:"2px solid "+C.ln,cursor:"pointer",boxShadow:colorFilter===v?"0 0 0 2px "+C.bg+", 0 0 0 4px "+C.dk:"none",padding:0}} />
          ))}
        </div>}
        {essentialCount > 0 && customPrice === 0 && renderTierBar()}
        {renderModelCatalog()}
      </Sec>}

      {view === "d-cart" && <Sec title={t("panier")} right={cartEntries.length > 0 ? <Btn small ghost onClick={() => askConfirm(t("confirmVaciarCarrito"), () => { setCart({}); setCartCl(""); setCartNotes(""); setFundaPref([]); setPreferredDate(""); setShippingAddr("saved"); setNewShipAddr({street:"",city:"",zip:"",country:""}); setCartPayMethod(""); try { localStorage.removeItem("minue_cart_"+user.email); } catch(e){} toast(t("carritoVaciado")); })} style={{color:C.rd,borderColor:C.rd+"60"}}>🗑 Vaciar carrito</Btn> : null}>
        <div style={{marginBottom:14,padding:"12px 16px",background:C.wh,border:"1px solid "+C.ln,borderRadius:4,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          <span style={{fontSize:11,color:C.gr,fontFamily:BD,fontWeight:500}}>{t("cmdPour")}</span>
          {distClients.length > 0 ? <>
            <select value={cartCl} onChange={e => setCartCl(e.target.value)} style={{flex:1,minWidth:180,padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk}}>
              <option value="">{t("choisir")}</option>
              {distClients.map(c => <option key={c.id} value={c.name}>{c.name} · {c.city||"—"} {c.status==="vip"?"★":""}</option>)}
            </select>
            <button onClick={() => { setModal("newCl"); setEd({name:"",contact:"",city:"",country:user.country||"FR",postalCode:"",phone:"",companyEmail:"",companyName:"",taxId:"",address:"",shippingAddress:"",shippingCity:"",shippingPostal:"",shippingCountry:"",_fromCart:true}); }} style={{padding:"8px 14px",background:"transparent",color:C.dk,border:"1px solid "+C.dk,borderRadius:3,fontSize:11,fontFamily:BD,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>+ {t("nouveau")}</button>
          </> : <>
            <span style={{flex:1,fontSize:11,fontFamily:BD,color:C.gr,fontStyle:"italic"}}>{t("sinClientesAun")}</span>
            <button onClick={() => { setModal("newCl"); setEd({name:"",contact:"",city:"",country:user.country||"FR",postalCode:"",phone:"",companyEmail:"",companyName:"",taxId:"",address:"",shippingAddress:"",shippingCity:"",shippingPostal:"",shippingCountry:"",_fromCart:true}); }} style={{padding:"9px 16px",background:C.dk,color:C.bg,border:"none",borderRadius:4,fontSize:11,fontFamily:BD,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>+ {t("crearPrimerCliente")}</button>
          </>}
        </div>
        {cartEntries.length === 0
          ? <div style={{textAlign:"center",padding:40,fontFamily:BD,color:C.gr}}><p>{t("panierVide")}</p><Btn onClick={() => setView("d-cat")}>{t("voirCat")}</Btn></div>
          : <div style={{maxWidth:800,margin:"0 auto"}}>
              {customPrice > 0 && <div style={{background:"#f0f6fa",border:"1px solid "+C.bl+"30",borderRadius:6,padding:"10px 14px",marginBottom:14,fontSize:11,fontFamily:BD,color:C.bl,fontWeight:500}}>{t("prixFixeClient")}: {fmt(customPrice)} €/{t("unites")}</div>}
              {customPrice === 0 && renderTierBar()}
              {customPrice === 0 && essentialCount > 0 && nextTier && <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:"8px 14px",marginBottom:14,fontSize:11,fontFamily:BD,color:C.gr,lineHeight:1.5}}>{t("astucePrix")}</div>}
              {cartEntries.map(([id, q]) => { const p = products.find(x => String(x.id) === String(id)); if (!p) return null; const itemPrice = p.col === "Acetato" ? p.fixedPrice : essentialUnitPrice; return (
                <div key={id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid "+C.bg2}}>
                  <div><div style={{fontSize:14,fontWeight:500,fontFamily:DP,color:C.dk}}>{p.model}</div><div style={{fontSize:11,color:C.gr,fontFamily:BD}}>{p.color} {p.col === "Acetato" ? <span style={{fontSize:9,color:"#7a5c3a",background:"#e8d5c0",padding:"1px 5px",borderRadius:2,marginLeft:4}}>Acetato</span> : ""}</div></div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:11,fontFamily:BD,color:C.gr}}>{fmt(itemPrice)} €</span>
                    <button onClick={() => updateQty(+id, q-1)} style={{width:26,height:26,background:C.bg,border:"1px solid "+C.ln,cursor:"pointer",borderRadius:3,color:C.dk}}>-</button>
                    <span style={{fontSize:13,fontFamily:BD,minWidth:22,textAlign:"center"}}>{q}</span>
                    <button onClick={() => updateQty(+id, q+1)} style={{width:26,height:26,background:C.bg,border:"1px solid "+C.ln,cursor:"pointer",borderRadius:3,color:C.dk}}>+</button>
                    <span style={{fontSize:13,fontFamily:BD,fontWeight:600,minWidth:65,textAlign:"right"}}>{fmt(itemPrice*q)} €</span>
                  </div>
                </div>
              ); })}

              {/* SUMMARY TOP */}
              <div style={{background:"linear-gradient(135deg,"+C.dk+"06,"+CL.gn+"08)",border:"2px solid "+C.dk+"15",borderRadius:10,padding:"16px 20px",marginTop:14,marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                  <div>
                    <div style={{fontSize:10,fontFamily:BD,color:C.gr,letterSpacing:1,fontWeight:600,textTransform:"uppercase"}}>{t("resumenPedido")}</div>
                    <div style={{fontSize:12,fontFamily:BD,color:C.gr,marginTop:2}}>{cartCount} {t("unites")}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:10,fontFamily:BD,color:C.gr}}>{t("totalHT")}</div>
                    <div style={{fontSize:28,fontFamily:DP,fontWeight:400,color:C.dk,lineHeight:1}}>{fmt(finalTotal)} €</div>
                    <div style={{fontSize:11,color:C.gn,fontFamily:BD,fontWeight:600,marginTop:4}}>{t("commEst")}: {fmt(finalTotal*0.15)} €</div>
                  </div>
                </div>
              </div>

              <div style={{borderTop:"2px solid "+C.dk,marginTop:12,paddingTop:16}}>
                {(() => { const selCl = distClients.find(c => c.name === cartCl); return selCl && (selCl.shippingAddress || selCl.city) ? <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:"10px 14px",marginBottom:12,fontSize:11,fontFamily:BD,color:C.gr}}>
                  <span style={{fontWeight:600,color:C.dk}}>📦 {t("dirEnvioClient")}:</span> {selCl.shippingAddress || selCl.address || "—"}, {selCl.shippingCity || selCl.city || ""} {selCl.shippingPostal || ""} {selCl.shippingCountry || selCl.country || ""}
                </div> : null; })()}

                {/* PREFERRED DATE */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                  <div>
                    <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>📅 Fecha preferente envío</div>
                    <input type="date" value={preferredDate||""} onChange={e => setPreferredDate(e.target.value)} min={new Date(Date.now()+3*86400000).toISOString().split("T")[0]} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                    <div style={{fontSize:9,fontFamily:BD,color:C.gr,marginTop:3}}>Mín. 3-5 días laborables</div>
                  </div>
                  <div>
                    <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>💳 Método de pago (si se sabe)</div>
                    <select value={cartPayMethod||""} onChange={e => setCartPayMethod(e.target.value)} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                      <option value="">⏱ Decidir más tarde</option>
                      <option value="stripe">💳 Stripe (tarjeta)</option>
                      <option value="sepa">🏦 SEPA</option>
                      <option value="transfer">🏧 Transferencia</option>
                      <option value="deferred">📅 Aplazado</option>
                    </select>
                  </div>
                </div>

                <div style={{marginBottom:12}}>
                  <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>📝 {t("notesCmd")}</div>
                  <textarea value={cartNotes} onChange={e => setCartNotes(e.target.value)} rows={2} placeholder={t("notesPlaceholder")} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
                </div>
                {/* FUNDA COLOR SELECTOR DIST */}
                {(() => {
                  const fundas = [["fundaCrema","Crema","#f0e8d9"],["fundaPistacho","Pistacho","#a8c89a"],["fundaBabyBlue","Baby Blue","#a8c8d4"],["fundaYellowAmalfi","Amalfi","#f0d878"],["fundaNaranja","Naranja","#e89858"]];
                  return <div style={{marginBottom:14,padding:"12px 14px",background:C.bg,borderRadius:6,border:"1px solid "+C.ln}}>
                    <div style={{fontSize:11,fontFamily:BD,fontWeight:600,color:C.dk,marginBottom:4}}>🎁 Color de funda preferido</div>
                    <div style={{fontSize:9,fontFamily:BD,color:C.gr,marginBottom:8}}>Sujeto a disponibilidad</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {fundas.map(([k,label,color]) => {
                        const stock = packStock[k]||0;
                        const isAvail = stock > 0;
                        const arr = Array.isArray(fundaPref) ? fundaPref : (fundaPref ? [fundaPref] : []);
                        const isSelected = arr.includes(k);
                        return <button key={k} onClick={() => { if(!isAvail) return; const cur = Array.isArray(fundaPref) ? fundaPref : (fundaPref ? [fundaPref] : []); setFundaPref(isSelected ? cur.filter(x => x !== k) : [...cur, k]); }} disabled={!isAvail} style={{padding:"7px 10px",background:isSelected?C.dk:C.wh,color:isSelected?C.bg:isAvail?C.dk:C.gr2,border:"2px solid "+(isSelected?C.dk:isAvail?C.ln:C.ln+"60"),borderRadius:6,cursor:isAvail?"pointer":"not-allowed",fontSize:10,fontFamily:BD,fontWeight:isSelected?700:500,display:"flex",alignItems:"center",gap:6,opacity:isAvail?1:0.5}}>
                          <div style={{width:14,height:14,borderRadius:7,background:color,border:"1px solid "+C.ln,flexShrink:0}}></div>
                          <span>{label}</span>
                          {!isAvail && <span style={{fontSize:7,color:C.rd,fontWeight:600}}>×</span>}
                        </button>;
                      })}
                    </div>
                  </div>;
                })()}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",padding:"12px 0"}}>
                  <div>
                    <div style={{fontSize:10,color:C.gr,fontFamily:BD}}>{t("totalHT")}</div>
                    <div style={{fontSize:30,fontWeight:300,fontFamily:DP,color:C.dk}}>{fmt(finalTotal)} €</div>
                    <div style={{fontSize:12,color:C.gn,fontFamily:BD,fontWeight:600,marginTop:4}}>{t("commEst")}: {fmt(finalTotal*0.15)} €</div>
                  </div>
                  <Btn onClick={doOrder} disabled={!cartCl}>{t("passerCmd")}</Btn>
                </div>
              </div>
            </div>
        }
        {submitted && <div style={{position:"fixed",inset:0,background:"rgba(24,51,47,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}}><div style={{background:C.wh,padding:"40px 50px",textAlign:"center",borderRadius:8}}><div style={{fontSize:32,color:C.gn}}>OK</div><div style={{fontSize:18,fontFamily:DP,color:C.dk,marginTop:8}}>{t("cmdEnvoyee")}</div></div></div>}
      </Sec>}

      {view === "d-ord" && <Sec title={t("mesCmd")}>
        {(() => {
          const totalSales = distOrders.reduce((s,o) => s+(o.total||0), 0);
          const myComm = totalSales * ((user.commRate||0)/100);
          const pendingOrders = distOrders.filter(o => o.pay !== "paid");
          const pendingAmount = pendingOrders.reduce((s,o) => s+(o.total||0), 0);
          return <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10,marginBottom:16}}>
            <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"12px 14px"}}>
              <div style={{fontSize:9,fontFamily:BD,color:C.gr2,letterSpacing:1,fontWeight:600}}>{t("commandes").toUpperCase()}</div>
              <div style={{fontSize:22,fontFamily:DP,color:C.dk,marginTop:4,lineHeight:1}}>{distOrders.length}</div>
            </div>
            <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"12px 14px"}}>
              <div style={{fontSize:9,fontFamily:BD,color:C.gr2,letterSpacing:1,fontWeight:600}}>{t("ventesTotal").toUpperCase()}</div>
              <div style={{fontSize:20,fontFamily:DP,color:C.dk,marginTop:4,lineHeight:1}}>{fmt(totalSales)} €</div>
            </div>
            <div style={{background:CL.gn+"0a",border:"1px solid "+CL.gn+"30",borderRadius:8,padding:"12px 14px"}}>
              <div style={{fontSize:9,fontFamily:BD,color:CL.gn,letterSpacing:1,fontWeight:600}}>{t("commission").toUpperCase()} ({user.commRate||0}%)</div>
              <div style={{fontSize:20,fontFamily:DP,color:CL.gn,marginTop:4,lineHeight:1,fontWeight:600}}>{fmt(myComm)} €</div>
            </div>
            {pendingOrders.length > 0 && <div style={{background:"#fff8e6",border:"1px solid #f0a02040",borderRadius:8,padding:"12px 14px"}}>
              <div style={{fontSize:9,fontFamily:BD,color:"#c47a00",letterSpacing:1,fontWeight:600}}>{t("enAttente").toUpperCase()}</div>
              <div style={{fontSize:20,fontFamily:DP,color:"#c47a00",marginTop:4,lineHeight:1}}>{fmt(pendingAmount)} €</div>
            </div>}
          </div>;
        })()}
        <div style={{display:"flex",gap:6,marginBottom:12,alignItems:"center",flexWrap:"wrap"}}>
          {[["all",t("tous")],["confirmed",t("confirme")],["preparing",t("enPrepa")],["shipped",t("expedie")],["delivered",t("livre")]].map(([v,l]) => (
            <button key={v} onClick={() => setOrdStatusFilter(v)} style={{padding:"5px 12px",background:ordStatusFilter===v?C.dk:"transparent",color:ordStatusFilter===v?C.bg:C.gr,border:"1px solid "+(ordStatusFilter===v?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:500,borderRadius:20}}>{l}</button>
          ))}
          <span style={{width:1,height:16,background:C.ln,margin:"0 2px"}} />
          {[["all",t("tous")],["pending",t("enAttente")],["paid",t("paye")]].map(([v,l]) => (
            <button key={v} onClick={() => setOrdPayFilter(v)} style={{padding:"5px 12px",background:ordPayFilter===v?C.bl:"transparent",color:ordPayFilter===v?"#fff":C.gr,border:"1px solid "+(ordPayFilter===v?C.bl:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:500,borderRadius:20}}>{l}</button>
          ))}
        </div>
        <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>{distOrders.filter(o => (ordStatusFilter==="all"||o.status===ordStatusFilter) && (ordPayFilter==="all"||o.pay===ordPayFilter)).map((o,i) => renderOrderRow(o, orders.indexOf(o), true, false))}</div>
      </Sec>}

      {view === "d-cl" && <Sec title={t("mesClients")+" ("+distClients.length+")"} right={<Btn small onClick={() => { setModal("newCl"); setEd({name:"",contact:"",city:"",country:"FR",postalCode:"",phone:"",companyEmail:"",companyName:"",taxId:"",address:"",shippingAddress:"",shippingCity:"",shippingPostal:"",shippingCountry:""}); }}>{t("nouveau")}</Btn>}>
        <input placeholder={"🔍 "+t("rechercherClient")} value={clientSearch} onChange={e => setClientSearch(e.target.value)} style={{padding:"7px 14px",border:"1px solid "+C.ln,borderRadius:20,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,width:"min(240px,60vw)",marginBottom:12,boxSizing:"border-box"}} />
        <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>
          {distClients.filter(c => !clientSearch || (c.name||"").toLowerCase().includes(clientSearch.toLowerCase()) || (c.city||"").toLowerCase().includes(clientSearch.toLowerCase())).map((c, i) => {
            const flags = {FR:"🇫🇷",ES:"🇪🇸",DE:"🇩🇪",US:"🇺🇸",IT:"🇮🇹",PT:"🇵🇹",BE:"🇧🇪",NL:"🇳🇱",UK:"🇬🇧",GB:"🇬🇧",CH:"🇨🇭",CO:"🇨🇴",MX:"🇲🇽"};
            const clOrders = orders.filter(o => o.client === c.name);
            const clTotal = clOrders.reduce((s,o) => s+(o.total||0), 0);
            const lastOrd = clOrders[0];
            return (
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderBottom:"1px solid "+C.bg2,cursor:"pointer",flexWrap:"wrap"}} onClick={() => { setModal("editCl"); setEd({...c, _tab:"resume"}); }}>
              <div style={{width:34,height:34,borderRadius:17,background:(c.status==="prospect"?C.yl:CL.gn)+"20",color:c.status==="prospect"?"#c47a00":CL.gn,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,fontFamily:BD,flexShrink:0}}>{(c.name||"?")[0]?.toUpperCase()}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"baseline",gap:6,flexWrap:"wrap"}}>
                  <span style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>{c.name}</span>
                  <span style={{fontSize:11,fontFamily:BD,color:C.gr}}>{c.city}</span>
                </div>
                <div style={{fontSize:10,fontFamily:BD,color:C.gr2,marginTop:1}}>{flags[c.country]||"🌍"} {c.country||"—"} · {c.contact||"—"}</div>
              </div>
              {clOrders.length > 0 && <div style={{textAlign:"right",marginRight:4}}>
                <div style={{fontSize:12,fontFamily:DP,fontWeight:600,color:CL.gn}}>{fmt(clTotal)} €</div>
                <div style={{fontSize:9,fontFamily:BD,color:C.gr2}}>{clOrders.length} {t("commandes").toLowerCase()}{lastOrd ? " · "+lastOrd.date : ""}</div>
              </div>}
              <Badge l={c.status==="prospect"?t("prospect"):t("actif")} c={c.status==="prospect"?C.yl:C.gn} />
            </div>
            );
          })}
          {distClients.length === 0 && <div style={{padding:30,textAlign:"center",fontSize:12,fontFamily:BD,color:C.gr2}}>—</div>}
        </div>
      </Sec>}

      {view === "d-promo" && <Sec title={t("promosActives")} sub={t("promosSub")}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
          {promos.filter(p => p.on && (p.visible||[]).includes("distributor")).map((p,i) => renderPromoCard(p, i, false))}
          {promos.filter(p => p.on && (p.visible||[]).includes("distributor")).length === 0 && <p style={{color:C.gr,fontFamily:BD,fontSize:12}}>{t("aucuneCmd")}</p>}
        </div>
      </Sec>}

      {view === "d-news" && <Sec title={t("nouveautes")} sub={t("nouveautesSub")}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {news.filter(n => n.on).sort((a,b) => (b.pinned?1:0)-(a.pinned?1:0)).map((n,i) => (
            <div key={i} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,padding:"20px 22px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:16,fontWeight:500,fontFamily:DP,color:C.dk}}>{(n.title&&n.title[lang])||n.title?.fr||""}</span>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  {n.pinned && <span style={{fontSize:9,fontFamily:BD,color:C.yl,fontWeight:600}}>PINNED</span>}
                  <span style={{fontSize:10,fontFamily:BD,color:C.gr2}}>{n.date}</span>
                </div>
              </div>
              <div style={{fontSize:12,fontFamily:BD,color:C.gr,lineHeight:1.6}}>{(n.content&&n.content[lang])||n.content?.fr||""}</div>
              {n.url && <a href={n.url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,fontFamily:BD,color:C.bl,marginTop:6,display:"inline-block",textDecoration:"none",fontWeight:500}}>{t("voirPlus")} →</a>}
            </div>
          ))}
          {news.filter(n => n.on).length === 0 && <p style={{color:C.gr,fontFamily:BD,fontSize:12}}>{t("aucuneCmd")}</p>}
        </div>
      </Sec>}

      {/* COMERCIAL / CRM */}
      {view === "e-comercial" && <>
        <Sec title={t("commercial")} sub={t("comercialSub")}>
          {/* PIPELINE KPIs */}
          {(() => {
            const comTasks = tasks.filter(tk => tk.area === "commercial");
            const nuevo = comTasks.filter(tk => tk.status === "aFaire");
            const contactado = comTasks.filter(tk => tk.status === "enCours");
            const negociacion = comTasks.filter(tk => tk.priority === "haute" && tk.status === "enCours");
            const ganados = comTasks.filter(tk => tk.status === "fait");
            return <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:20}}>
              <div style={{background:"#3498db10",border:"1px solid #3498db30",borderRadius:8,padding:"12px 10px",textAlign:"center"}}>
                <div style={{fontSize:20,fontFamily:BD,fontWeight:700,color:"#3498db"}}>{nuevo.length}</div>
                <div style={{fontSize:9,fontFamily:BD,color:C.gr}}>{t("nuevoLead")}</div>
              </div>
              <div style={{background:"#f39c1210",border:"1px solid #f39c1230",borderRadius:8,padding:"12px 10px",textAlign:"center"}}>
                <div style={{fontSize:20,fontFamily:BD,fontWeight:700,color:"#f39c12"}}>{contactado.length}</div>
                <div style={{fontSize:9,fontFamily:BD,color:C.gr}}>{t("contactado")}</div>
              </div>
              <div style={{background:"#8e44ad10",border:"1px solid #8e44ad30",borderRadius:8,padding:"12px 10px",textAlign:"center"}}>
                <div style={{fontSize:20,fontFamily:BD,fontWeight:700,color:"#8e44ad"}}>{negociacion.length}</div>
                <div style={{fontSize:9,fontFamily:BD,color:C.gr}}>{t("enNegociacion")}</div>
              </div>
              <div style={{background:C.gn+"10",border:"1px solid "+C.gn+"30",borderRadius:8,padding:"12px 10px",textAlign:"center"}}>
                <div style={{fontSize:20,fontFamily:BD,fontWeight:700,color:C.gn}}>{ganados.length}</div>
                <div style={{fontSize:9,fontFamily:BD,color:C.gr}}>{t("ganado")}</div>
              </div>
            </div>;
          })()}
        </Sec>

        {/* SEGUIMIENTO COMERCIAL - Leads activos */}
        <Sec title={t("seguimiento")} right={<Btn small onClick={() => { setModal("newTask"); setEd({title:"",desc:"",priority:"moyenne",area:"commercial",status:"aFaire",dueDate:"",assignee:user.name}); }}>{t("nuevoLead")}</Btn>}>
          {(() => {
            const leads = tasks.filter(tk => tk.area === "commercial" && tk.status !== "fait");
            if (leads.length === 0) return <div style={{textAlign:"center",padding:30,fontSize:12,fontFamily:BD,color:C.gr2}}>{t("sinLeads")}</div>;
            return leads.map((tk, i) => {
              const stColor = tk.status === "aFaire" ? "#3498db" : tk.priority === "haute" ? "#8e44ad" : "#f39c12";
              const stLabel = tk.status === "aFaire" ? t("nuevoLead") : tk.priority === "haute" ? t("enNegociacion") : t("contactado");
              return (
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:C.wh,border:"1px solid "+C.ln,borderRadius:8,marginBottom:8,cursor:"pointer"}} onClick={() => { setModal("editTask"); setEd({...tk}); }}>
                  <div style={{width:10,height:10,borderRadius:5,background:stColor,flexShrink:0}} />
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontFamily:BD,fontWeight:600,color:C.dk}}>{tk.title}</div>
                    {tk.desc && <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:2,lineHeight:1.4}}>{tk.desc.substring(0,100)}{tk.desc.length>100?"...":""}</div>}
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <Badge l={stLabel} c={stColor} />
                    {tk.dueDate && <div style={{fontSize:9,fontFamily:BD,color:C.gr,marginTop:4}}>{t("proximaAccion")}: {tk.dueDate}</div>}
                  </div>
                </div>
              );
            });
          })()}
        </Sec>

        {/* CLIENTES A RECUPERAR */}
        <Sec title={t("aRecuperar")} sub={t("aRecuperarSub")}>
          {(() => {
            const clientsWithOrders = {};
            orders.forEach(o => { if (!clientsWithOrders[o.client] || new Date(o.date.split("/").reverse().join("-")) > new Date(clientsWithOrders[o.client])) clientsWithOrders[o.client] = o.date; });
            const inactive = clients.filter(c => {
              const lastOrder = clientsWithOrders[c.name];
              if (!lastOrder) return c.status === "active" || c.status === "prospect";
              return false;
            });
            const withOldOrders = clients.filter(c => {
              const lastOrder = clientsWithOrders[c.name];
              if (!lastOrder) return false;
              return true;
            }).filter(c => {
              const total = orders.filter(o => o.client === c.name).reduce((s,o) => s+o.total, 0);
              return orders.filter(o => o.client === c.name).length <= 1 && total < 500;
            });
            const toRecover = [...inactive, ...withOldOrders].slice(0, 10);
            if (toRecover.length === 0) return <div style={{textAlign:"center",padding:20,fontSize:12,fontFamily:BD,color:C.gr2}}>Todos los clientes están activos</div>;
            return toRecover.map((c, i) => {
              const cOrds = orders.filter(o => o.client === c.name);
              const lastDate = cOrds.length > 0 ? cOrds[0].date : "—";
              const cTotal = cOrds.reduce((s,o) => s+o.total, 0);
              return (
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:C.wh,border:"1px solid "+C.ln,borderRadius:6,marginBottom:6}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontFamily:BD,fontWeight:600,color:C.dk}}>{c.name}</div>
                    <div style={{fontSize:10,fontFamily:BD,color:C.gr}}>{c.contact} · {c.city} · {c.channel}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:11,fontFamily:BD,color:cOrds.length===0?C.rd:C.yl,fontWeight:600}}>{cOrds.length === 0 ? t("sinPedidos") : cOrds.length+" cmd · "+fmt(cTotal)+" €"}</div>
                    {cOrds.length > 0 && <div style={{fontSize:9,fontFamily:BD,color:C.gr}}>{t("ultimoContacto")}: {lastDate}</div>}
                  </div>
                  <Btn small ghost onClick={() => { setModal("newTask"); setEd({title:t("seguimiento")+": "+c.name,desc:c.contact+" · "+(c.companyEmail||c.phone||"")+" · "+c.city,priority:"moyenne",area:"commercial",status:"aFaire",dueDate:"",assignee:user.name}); }}>{t("seguimiento")}</Btn>
                </div>
              );
            });
          })()}
        </Sec>

        {/* HISTORIAL GANADOS */}
        {tasks.filter(tk => tk.area === "commercial" && tk.status === "fait").length > 0 && <Sec title={t("ganado")}>
          {tasks.filter(tk => tk.area === "commercial" && tk.status === "fait").slice(0,5).map((tk, i) => (
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",background:C.gn+"05",border:"1px solid "+C.gn+"20",borderRadius:6,marginBottom:4,fontSize:12,fontFamily:BD}}>
              <span style={{color:C.gn}}>✓</span>
              <span style={{flex:1,color:C.dk}}>{tk.title}</span>
              <span style={{fontSize:10,color:C.gr}}>{tk.date}</span>
            </div>
          ))}
        </Sec>}
      </>}

      {/* EMPLOYEE ACCOUNT */}
      {view === "e-account" && <Sec title={t("monCompte")}>
        <div style={{maxWidth:640}}>
          <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"20px 22px"}}>
            <div style={{fontSize:14,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:14}}>{t("datosPersonales")}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("contact")}</div>
                <div style={{fontSize:13,fontFamily:BD,color:C.dk,padding:"9px 0"}}>{user.name}</div>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("email")}</div>
                <div style={{fontSize:13,fontFamily:BD,color:C.dk,padding:"9px 0"}}>{user.email}</div>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("entreprise")}</div>
                <div style={{fontSize:13,fontFamily:BD,color:C.dk,padding:"9px 0"}}>{user.co || "Minuë"}</div>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("roleLabel")}</div>
                <div style={{fontSize:13,fontFamily:BD,color:"#a8c8e8",padding:"9px 0",fontWeight:600}}>{t("employe")}</div>
              </div>
            </div>
          </div>
        </div>
      </Sec>}

      {view === "d-account" && <Sec title={t("monCompte")}>
        <div style={{maxWidth:640}}>
          <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"20px 22px",marginBottom:16}}>
            <div style={{fontSize:14,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:14}}>{t("datosPersonales")}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("contact")}</div>
                <div style={{fontSize:13,fontFamily:BD,color:C.dk,padding:"9px 0"}}>{user.name}</div>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("email")}</div>
                <div style={{fontSize:13,fontFamily:BD,color:C.dk,padding:"9px 0"}}>{user.email}</div>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("entreprise")}</div>
                <div style={{fontSize:13,fontFamily:BD,color:C.dk,padding:"9px 0"}}>{user.co || "—"}</div>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("commission")}</div>
                <div style={{fontSize:13,fontFamily:BD,color:C.gn,padding:"9px 0",fontWeight:600}}>{user.commRate||0}%</div>
              </div>
            </div>
          </div>
          <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"20px 22px",marginBottom:16}}>
            <div style={{fontSize:14,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:14}}>{t("donneesEntreprise")}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              {[[t("raisonSociale"),"companyName"],[t("nif"),"taxId"],[t("direccion"),"address"],[t("ville"),"city"],[t("codePostal"),"postalCode"],[t("pays"),"country"],[t("telephone"),"phone"],[t("emailLabel"),"companyEmail"]].map(([l,k]) => (
                <div key={k} style={{marginBottom:12}}>
                  <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{l}</div>
                  <input value={accountData[k]||""} onChange={e => { setAccountData(p => ({...p,[k]:e.target.value})); setAccountSaved(false); }} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                </div>
              ))}
            </div>
          </div>
          <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"20px 22px",marginBottom:16}}>
            <div style={{fontSize:14,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:14}}>{t("donneesBancaires")}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              {[[t("titulaire"),"bankHolder"],[t("iban"),"iban"],[t("bic"),"bic"]].map(([l,k]) => (
                <div key={k} style={{marginBottom:12}}>
                  <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{l}</div>
                  <input value={accountData[k]||""} onChange={e => { setAccountData(p => ({...p,[k]:e.target.value})); setAccountSaved(false); }} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <Btn onClick={() => { dbSaveAccountData(accountData); setAccountSaved(true); }}>{t("sauvegarder")}</Btn>
            {accountSaved && <span style={{fontSize:11,fontFamily:BD,color:C.gn,fontWeight:500}}>{t("donneesSauvees")}</span>}
          </div>
        </div>
      </Sec>}

      {/* ADMIN VIEWS */}
      {view === "a-ord" && <Sec title={t("commandes")} right={<div style={{display:"flex",gap:6,flexWrap:"wrap"}}><Btn small ghost onClick={exportOrders}>{t("exporterCSV")}</Btn>{(role === "admin" || role === "team") && <><Btn small ghost onClick={() => { setModal("importFaire"); setEd({faireRef:"",client:"",faireDate:new Date().toISOString().split("T")[0],lines:[],faireCommission:17,subtotal:0}); }} style={{borderColor:"#000",color:"#000"}}><span style={{display:"inline-flex",alignItems:"center",gap:6}}><span style={{width:16,height:16,borderRadius:8,background:"#000",color:"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,fontFamily:BD}}>F</span> Faire</span></Btn><Btn small onClick={() => { setModal("newOrd"); setEd({client:"",dist:"Direct",lines:[]}); }}>{t("nouvelleCmd")}</Btn></>}</div>}>
        {role === "team" && <div style={{display:"flex",gap:4,marginBottom:14,borderBottom:"1px solid "+C.ln}}>
          {[["list",t("commandes")],["prep",t("preparacion")]].map(([v,l]) => (
            <button key={v} onClick={() => setOrdSubTab(v)} style={{padding:"8px 16px",background:"none",border:"none",borderBottom:"2px solid "+(ordSubTab===v?C.dk:"transparent"),cursor:"pointer",fontSize:12,fontFamily:BD,fontWeight:ordSubTab===v?600:400,color:ordSubTab===v?C.dk:C.gr}}>{l}{v==="prep" && orders.filter(o => o.status==="confirmed"||o.status==="preparing").length > 0 ? " ("+orders.filter(o => o.status==="confirmed"||o.status==="preparing").length+")" : ""}</button>
          ))}
        </div>}
        {(role !== "team" || ordSubTab === "list") && <>
        <div style={{display:"flex",gap:6,marginBottom:12,alignItems:"center",flexWrap:"wrap"}}>
          {[["all",t("tous")],["confirmed",t("confirme")],["preparing",t("enPrepa")],["shipped",t("expedie")],["delivered",t("livre")]].map(([v,l]) => (
            <button key={v} onClick={() => setOrdStatusFilter(v)} style={{padding:"5px 12px",background:ordStatusFilter===v?C.dk:"transparent",color:ordStatusFilter===v?C.bg:C.gr,border:"1px solid "+(ordStatusFilter===v?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:500,borderRadius:20}}>{l}</button>
          ))}
          <span style={{width:1,height:16,background:C.ln,margin:"0 2px"}} />
          {[["all",t("tous")],["pending",t("enAttente")],["invoiced",t("facture")],["paid",t("paye")]].map(([v,l]) => (
            <button key={v} onClick={() => setOrdPayFilter(v)} style={{padding:"5px 12px",background:ordPayFilter===v?C.bl:"transparent",color:ordPayFilter===v?"#fff":C.gr,border:"1px solid "+(ordPayFilter===v?C.bl:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:500,borderRadius:20}}>{l}</button>
          ))}
          <span style={{width:1,height:16,background:C.ln,margin:"0 2px"}} />
          <button onClick={() => setOrdChannelFilter(ordChannelFilter==="faire"?"all":"faire")} style={{padding:"5px 12px",background:ordChannelFilter==="faire"?"#000":"transparent",color:ordChannelFilter==="faire"?"#fff":"#000",border:"1px solid #000",cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:600,borderRadius:20,display:"inline-flex",alignItems:"center",gap:6}}><span style={{width:14,height:14,borderRadius:7,background:ordChannelFilter==="faire"?"#fff":"#000",color:ordChannelFilter==="faire"?"#000":"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,fontFamily:BD}}>F</span>Faire{orders.filter(o => o.dist === "Faire").length > 0 && " ("+orders.filter(o => o.dist === "Faire").length+")"}</button>
          <span style={{flex:1}} />
          <span style={{fontSize:11,fontFamily:BD,color:C.gr}}>{orders.filter(o => (ordStatusFilter==="all"||o.status===ordStatusFilter) && (ordPayFilter==="all"||o.pay===ordPayFilter) && (ordChannelFilter==="all"||(ordChannelFilter==="faire"&&o.dist==="Faire"))).length} / {orders.length}</span>
        </div>
        <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>{orders.filter(o => (ordStatusFilter==="all"||o.status===ordStatusFilter) && (ordPayFilter==="all"||o.pay===ordPayFilter) && (ordChannelFilter==="all"||(ordChannelFilter==="faire"&&o.dist==="Faire"))).map((o, i) => renderOrderRow(o, orders.indexOf(o), true, true))}</div>
        </>}
        {role === "team" && ordSubTab === "prep" && <>
          {(() => {
            const prepOrders = orders.filter(o => o.status === "confirmed" || o.status === "preparing");
            if (prepOrders.length === 0) return <div style={{textAlign:"center",padding:40,fontSize:12,fontFamily:BD,color:C.gr2}}>✓ {t("aucuneCmd")}</div>;
            return prepOrders.map((o, oi) => {
              const isOpen = expandedPrep === o.id;
              const checks = prepChecks[o.id] || {};
              const totalItems = (o.lines||[]).reduce((s,l) => s+l.qty, 0);
              const packList = ["funda","gamuza","cajita","cintaMinue","albaran"];
              const needsExpositor = totalItems >= 10;
              const allPack = needsExpositor ? [...packList, "expositor"] : packList;
              const totalChecks = (o.lines||[]).length + allPack.length;
              const doneChecks = Object.values(checks).filter(Boolean).length;
              const pct = totalChecks > 0 ? Math.round(doneChecks / totalChecks * 100) : 0;
              return (
                <div key={o.id} style={{background:C.wh,border:"1px solid "+(pct===100?C.gn+"50":C.ln),borderRadius:8,marginBottom:10,overflow:"hidden"}}>
                  <div onClick={() => setExpandedPrep(isOpen ? null : o.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",cursor:"pointer"}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:14,fontFamily:DP,fontWeight:600,color:C.dk}}>{o.id}</span><Badge l={SL[o.status]} c={SC[o.status]} /></div>
                      <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginTop:2}}>{o.client} · {o.items} uds · {o.date} · {o.dist}</div>
                    </div>
                    <div style={{textAlign:"right",minWidth:60}}>
                      <div style={{fontSize:14,fontFamily:BD,fontWeight:700,color:pct===100?C.gn:C.dk}}>{pct}%</div>
                      <div style={{fontSize:9,fontFamily:BD,color:C.gr}}>{doneChecks}/{totalChecks}</div>
                    </div>
                    <span style={{fontSize:12,color:C.gr}}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                  {pct > 0 && <div style={{height:3,background:C.bg2}}><div style={{height:3,background:pct===100?C.gn:C.yl,width:pct+"%"}} /></div>}
                  {isOpen && <div style={{padding:"0 16px 16px"}}>
                    <div style={{fontSize:10,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:6,marginTop:8}}>{t("detailArt")}</div>
                    {(o.lines||[]).map((l, li) => {
                      const ck = "l_"+li;
                      return (
                        <label key={li} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid "+C.bg2,cursor:"pointer",fontSize:12,fontFamily:BD}}>
                          <input type="checkbox" checked={!!checks[ck]} onChange={() => setPrepChecks(p => ({...p, [o.id]:{...(p[o.id]||{}), [ck]:!checks[ck]}}))} style={{accentColor:C.gn,width:16,height:16,flexShrink:0}} />
                          <span style={{flex:1,color:checks[ck]?C.gr:C.dk,textDecoration:checks[ck]?"line-through":"none"}}>{l.model} {l.color}</span>
                          <span style={{fontWeight:600,color:checks[ck]?C.gr:C.dk}}>x{l.qty}</span>
                        </label>
                      );
                    })}
                    <div style={{fontSize:10,fontFamily:BD,color:C.dk,fontWeight:700,marginTop:14,marginBottom:6}}>{t("packingList")}</div>
                    {allPack.map(pk => {
                      const ck = "pk_"+pk;
                      const labels = {funda:t("funda")+" (x"+totalItems+")",gamuza:t("gamuza")+" (x"+totalItems+")",cajita:t("cajita")+" (x"+totalItems+")",cintaMinue:t("cintaMinue"),albaran:t("albaran"),expositor:t("expositor")};
                      return (
                        <label key={pk} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid "+C.bg2,cursor:"pointer",fontSize:12,fontFamily:BD}}>
                          <input type="checkbox" checked={!!checks[ck]} onChange={() => setPrepChecks(p => ({...p, [o.id]:{...(p[o.id]||{}), [ck]:!checks[ck]}}))} style={{accentColor:C.bl,width:16,height:16,flexShrink:0}} />
                          <span style={{color:checks[ck]?C.gr:C.dk,textDecoration:checks[ck]?"line-through":"none"}}>{labels[pk]||pk}</span>
                          <span style={{fontSize:9,fontFamily:BD,color:C.bl,background:C.bl+"10",padding:"1px 6px",borderRadius:3}}>📦</span>
                        </label>
                      );
                    })}
                    {pct === 100 && <div style={{marginTop:12,padding:"10px 14px",background:C.gn+"10",borderRadius:6,border:"1px solid "+C.gn+"30",fontSize:11,fontFamily:BD,color:C.gn,fontWeight:600,textAlign:"center"}}>✓ {t("marcadoListo")}</div>}
                  </div>}
                </div>
              );
            });
          })()}
        </>}
      </Sec>}

      {view === "a-cl" && (() => {
        const flags = {FR:"🇫🇷",ES:"🇪🇸",DE:"🇩🇪",US:"🇺🇸",IT:"🇮🇹",PT:"🇵🇹",BE:"🇧🇪",NL:"🇳🇱",UK:"🇬🇧",GB:"🇬🇧",CH:"🇨🇭",CO:"🇨🇴",MX:"🇲🇽",AT:"🇦🇹",GR:"🇬🇷",IE:"🇮🇪",DK:"🇩🇰",SE:"🇸🇪",NO:"🇳🇴",FI:"🇫🇮",JP:"🇯🇵",AU:"🇦🇺",CA:"🇨🇦"};
        // Compute stats per client from orders
        const clientStats = {};
        clients.forEach(c => { clientStats[c.name] = {total:0, orders:0, lastDate:null, lastTs:0}; });
        orders.forEach(o => {
          if (clientStats[o.client]) {
            clientStats[o.client].total += o.total||0;
            clientStats[o.client].orders += 1;
            // Parse date — orders use fr-FR format dd/mm/yyyy
            const parts = (o.date||"").split("/");
            let ts = 0;
            if (parts.length === 3) ts = new Date(parts[2]+"-"+parts[1].padStart(2,"0")+"-"+parts[0].padStart(2,"0")).getTime();
            if (ts > clientStats[o.client].lastTs) {
              clientStats[o.client].lastTs = ts;
              clientStats[o.client].lastDate = o.date;
            }
          }
        });
        const now = Date.now();
        const daysSince = ts => ts ? Math.floor((now - ts) / 86400000) : null;

        // Distributor names (real distributor users)
        const distributorList = users.filter(u => u.role === "distributor").map(u => (u.co||u.name||"").trim()).filter(Boolean);

        // Helper: which canal bucket
        const channelBucket = (c) => {
          const ch = (c.channel||"").toLowerCase().trim();
          if (ch === "faire") return "faire";
          if (ch === "direct" || ch === "directo" || !ch) return "direct";
          // distributor match
          const matchedDist = distributorList.find(d => ch.includes(d.toLowerCase()) || d.toLowerCase().includes(ch));
          return matchedDist ? "dist:"+matchedDist : "other";
        };

        // KPIs
        const totalC = clients.length;
        const activeC = clients.filter(c => clientStats[c.name]?.orders > 0).length;
        const vipC = clients.filter(c => c.status === "vip").length;
        const prospectC = clients.filter(c => c.status === "prospect").length;
        const inactiveC = clients.filter(c => {
          const s = clientStats[c.name];
          if (!s || s.orders === 0) return false;
          const d = daysSince(s.lastTs);
          return d !== null && d > 90;
        }).length;
        const faireC = clients.filter(c => channelBucket(c) === "faire").length;
        const totalRevenue = Object.values(clientStats).reduce((s,x) => s+x.total, 0);

        // Top 5 by total
        const topClients = [...clients].sort((a,b) => (clientStats[b.name]?.total||0) - (clientStats[a.name]?.total||0)).slice(0,5);

        // Country distribution
        const byCountry = {};
        clients.forEach(c => { const co = c.country||"—"; byCountry[co] = (byCountry[co]||0)+1; });
        const countriesSorted = Object.entries(byCountry).sort((a,b) => b[1]-a[1]).slice(0,6);
        const maxCountry = countriesSorted[0]?.[1]||1;

        // Alerts: VIP/active clients inactive 60+ days
        const sleepingVips = clients.filter(c => {
          const s = clientStats[c.name];
          if (!s || s.orders === 0) return false;
          if (c.status !== "vip" && c.status !== "active" && c.customPrice === 0) return false;
          const d = daysSince(s.lastTs);
          return d !== null && d > 60 && d < 365;
        }).slice(0,5);

        // Filter + sort
        let filtered = clients.filter(c => {
          // status
          if (clientFilter !== "all") {
            if (clientFilter === "vip" && c.status !== "vip") return false;
            if (clientFilter === "prospect" && c.status !== "prospect") return false;
            if (clientFilter === "active" && (clientStats[c.name]?.orders||0) === 0) return false;
            if (clientFilter === "inactive") {
              const s = clientStats[c.name];
              if (!s || s.orders === 0) return false;
              const d = daysSince(s.lastTs);
              if (!(d !== null && d > 90)) return false;
            }
          }
          // channel
          const bucket = channelBucket(c);
          if (clientChannelFilter === "direct" && bucket !== "direct") return false;
          if (clientChannelFilter === "faire" && bucket !== "faire") return false;
          if (clientChannelFilter === "distributor" && !bucket.startsWith("dist:")) return false;
          if (selectedDistChannel && bucket !== "dist:"+selectedDistChannel) return false;
          // country
          if (clientCountryFilter !== "all" && c.country !== clientCountryFilter) return false;
          // search
          if (clientSearch) {
            const s = clientSearch.toLowerCase();
            if (!(c.name||"").toLowerCase().includes(s) && !(c.city||"").toLowerCase().includes(s) && !(c.country||"").toLowerCase().includes(s) && !(c.companyEmail||"").toLowerCase().includes(s)) return false;
          }
          return true;
        });
        // Sort
        filtered.sort((a,b) => {
          const sa = clientStats[a.name]||{total:0,lastTs:0};
          const sb = clientStats[b.name]||{total:0,lastTs:0};
          if (clientSortBy === "total") return sb.total - sa.total;
          if (clientSortBy === "alphabetical") return (a.name||"").localeCompare(b.name||"");
          if (clientSortBy === "lastOrder") return sb.lastTs - sa.lastTs;
          return (b.id||0) - (a.id||0); // recent (default)
        });

        // All countries for filter
        const allCountries = [...new Set(clients.map(c => c.country).filter(Boolean))].sort();

        return <>
        <Sec title={t("clients")} sub={totalC+" "+t("clients")+" · "+fmt(totalRevenue)+" € total"} right={<div style={{display:"flex",gap:6,flexWrap:"wrap"}}><Btn small ghost onClick={exportClients}>{t("exporterCSV")}</Btn><Btn small onClick={() => { setModal("newCl"); setEd({name:"",contact:"",city:"",country:"FR",postalCode:""}); }}>+ {t("nouveau")}</Btn></div>}>

          {/* KPI CARDS */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:8,marginBottom:14}}>
            {[
              ["all","Todos",totalC,C.dk,"👥"],
              ["active","Activos",activeC,C.gn,"✓"],
              ["vip","VIP",vipC,"#d4a030","⭐"],
              ["prospect","Prospectos",prospectC,C.bl,"🌱"],
              ["inactive","Inactivos",inactiveC,"#888","💤"]
            ].map(([f,l,v,col,icon]) =>
              <button key={f} onClick={() => setClientFilter(f)} style={{background:clientFilter===f?col+"15":C.wh,border:"1.5px solid "+(clientFilter===f?col:C.ln),borderRadius:8,padding:"12px 10px",textAlign:"center",cursor:"pointer",transition:"all 0.15s"}}>
                <div style={{fontSize:18,marginBottom:2}}>{icon}</div>
                <div style={{fontSize:22,fontWeight:400,fontFamily:DP,color:col,lineHeight:1.1}}>{v}</div>
                <div style={{fontSize:9,color:col+"90",fontFamily:BD,letterSpacing:1,fontWeight:600,marginTop:2}}>{l.toUpperCase()}</div>
              </button>
            )}
          </div>

          {/* COUNTRY DISTRIBUTION + ALERTS */}
          {(countriesSorted.length > 0 || sleepingVips.length > 0) && <div style={{display:"grid",gridTemplateColumns:sleepingVips.length>0?"1.5fr 1fr":"1fr",gap:10,marginBottom:14}}>
            {countriesSorted.length > 0 && <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"12px 14px"}}>
              <div style={{fontSize:10,fontFamily:BD,fontWeight:700,color:C.dk,marginBottom:8,letterSpacing:0.5}}>🌍 DISTRIBUCIÓN POR PAÍS</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {countriesSorted.map(([co,n]) => <button key={co} onClick={() => setClientCountryFilter(clientCountryFilter===co?"all":co)} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0",background:"none",border:"none",cursor:"pointer",width:"100%",textAlign:"left"}}>
                  <span style={{fontSize:14,width:24}}>{flags[co]||"🌍"}</span>
                  <span style={{fontSize:10,fontFamily:BD,color:C.gr,minWidth:30}}>{co}</span>
                  <div style={{flex:1,height:8,background:C.bg,borderRadius:4,overflow:"hidden"}}>
                    <div style={{height:"100%",width:(n/maxCountry*100)+"%",background:clientCountryFilter===co?C.bl:C.dk,borderRadius:4,transition:"width 0.3s"}} />
                  </div>
                  <span style={{fontSize:11,fontFamily:BD,fontWeight:600,color:C.dk,minWidth:25,textAlign:"right"}}>{n}</span>
                </button>)}
              </div>
            </div>}
            {sleepingVips.length > 0 && <div style={{background:"#fff8e6",border:"1px solid #f0a020"+"40",borderRadius:8,padding:"12px 14px"}}>
              <div style={{fontSize:10,fontFamily:BD,fontWeight:700,color:"#c47a00",marginBottom:8,letterSpacing:0.5}}>⚠️ CLIENTES DORMIDOS (+60d)</div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {sleepingVips.map(c => { const s = clientStats[c.name]; const d = daysSince(s.lastTs); return <div key={c.id} onClick={() => { setModal("editCl"); setEd({...c}); }} style={{padding:"6px 8px",background:C.wh,borderRadius:4,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:11,fontFamily:BD,fontWeight:600,color:C.dk,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</span>
                  <span style={{fontSize:9,fontFamily:BD,color:"#c47a00",fontWeight:700,background:"#f0a020"+"20",padding:"2px 6px",borderRadius:3}}>{d}d</span>
                </div>; })}
              </div>
            </div>}
          </div>}

          {/* TOP 5 CLIENTS */}
          {topClients.filter(c => clientStats[c.name]?.total > 0).length > 0 && <div style={{background:"linear-gradient(135deg,"+C.dk+"04,"+C.gn+"06)",border:"1px solid "+C.gn+"30",borderRadius:8,padding:"12px 14px",marginBottom:14}}>
            <div style={{fontSize:10,fontFamily:BD,fontWeight:700,color:C.dk,marginBottom:10,letterSpacing:0.5}}>🏆 TOP CLIENTES POR FACTURACIÓN</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8}}>
              {topClients.filter(c => clientStats[c.name]?.total > 0).map((c,i) => { const s = clientStats[c.name]; return <div key={c.id} onClick={() => { setModal("editCl"); setEd({...c}); }} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,padding:"10px 12px",cursor:"pointer",position:"relative"}}>
                <div style={{position:"absolute",top:-6,left:-6,width:22,height:22,borderRadius:11,background:i===0?"#d4a030":i===1?"#aaa":i===2?"#c08552":C.dk,color:"#fff",fontSize:10,fontWeight:700,fontFamily:BD,display:"flex",alignItems:"center",justifyContent:"center"}}>{i+1}</div>
                <div style={{fontSize:11,fontFamily:BD,fontWeight:600,color:C.dk,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
                <div style={{fontSize:9,fontFamily:BD,color:C.gr,marginBottom:6}}>{flags[c.country]||"🌍"} {c.city||"—"}</div>
                <div style={{fontSize:13,fontFamily:DP,fontWeight:600,color:CL.gn}}>{fmt(s.total)} €</div>
                <div style={{fontSize:9,fontFamily:BD,color:C.gr2,marginTop:2}}>{s.orders} pedidos</div>
              </div>; })}
            </div>
          </div>}

          {/* CHANNEL TABS */}
          <div style={{display:"flex",gap:4,marginBottom:12,flexWrap:"wrap",borderBottom:"1px solid "+C.ln,paddingBottom:8}}>
            {[
              ["all","Todos los canales",null],
              ["direct","🌐 Directos",clients.filter(c=>channelBucket(c)==="direct").length],
              ["distributor","🤝 Distribuidores",clients.filter(c=>channelBucket(c).startsWith("dist:")).length],
              ["faire","Faire",faireC]
            ].map(([v,l,count]) =>
              <button key={v} onClick={() => { setClientChannelFilter(v); setSelectedDistChannel(null); }} style={{padding:"6px 14px",background:clientChannelFilter===v?C.dk:"transparent",color:clientChannelFilter===v?C.bg:C.gr,border:"1px solid "+(clientChannelFilter===v?C.dk:"transparent"),cursor:"pointer",fontSize:11,fontFamily:BD,fontWeight:600,borderRadius:20,display:"inline-flex",alignItems:"center",gap:6}}>
                {v === "faire" && <span style={{width:14,height:14,borderRadius:7,background:clientChannelFilter===v?"#fff":"#000",color:clientChannelFilter===v?"#000":"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,fontFamily:BD}}>F</span>}
                {l}
                {count !== null && <span style={{fontSize:9,opacity:0.7,fontWeight:500}}>({count})</span>}
              </button>
            )}
          </div>

          {/* DISTRIBUTOR SUB-TABS */}
          {clientChannelFilter === "distributor" && distributorList.length > 0 && <div style={{display:"flex",gap:4,marginBottom:12,flexWrap:"wrap",padding:"8px 12px",background:C.bl+"05",borderRadius:6}}>
            <span style={{fontSize:10,fontFamily:BD,color:C.gr,fontWeight:600,letterSpacing:0.5,alignSelf:"center",marginRight:6}}>POR DISTRIBUIDOR:</span>
            <button onClick={() => setSelectedDistChannel(null)} style={{padding:"4px 10px",background:!selectedDistChannel?C.bl:"transparent",color:!selectedDistChannel?"#fff":C.bl,border:"1px solid "+C.bl,cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:600,borderRadius:3}}>Todos</button>
            {distributorList.map(d => { const cnt = clients.filter(c => channelBucket(c) === "dist:"+d).length; return <button key={d} onClick={() => setSelectedDistChannel(d)} style={{padding:"4px 10px",background:selectedDistChannel===d?C.bl:"transparent",color:selectedDistChannel===d?"#fff":C.bl,border:"1px solid "+C.bl,cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:600,borderRadius:3,display:"inline-flex",alignItems:"center",gap:5}}>{d} <span style={{fontSize:9,opacity:0.7}}>({cnt})</span></button>; })}
          </div>}

          {/* SEARCH + SORT + VIEW MODE + COUNTRY */}
          <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center",flexWrap:"wrap"}}>
            <input placeholder={"🔍 "+t("rechercherClient")} value={clientSearch} onChange={e => setClientSearch(e.target.value)} style={{padding:"7px 12px",border:"1px solid "+C.ln,borderRadius:20,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,width:"min(220px, 40vw)"}} />
            <select value={clientSortBy} onChange={e => setClientSortBy(e.target.value)} style={{padding:"7px 10px",border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,cursor:"pointer"}}>
              <option value="recent">↻ Recientes</option>
              <option value="total">💰 Más facturación</option>
              <option value="alphabetical">🔤 A-Z</option>
              <option value="lastOrder">📅 Último pedido</option>
            </select>
            {allCountries.length > 1 && <select value={clientCountryFilter} onChange={e => setClientCountryFilter(e.target.value)} style={{padding:"7px 10px",border:"1px solid "+(clientCountryFilter!=="all"?C.bl:C.ln),borderRadius:3,fontFamily:BD,fontSize:11,background:clientCountryFilter!=="all"?C.bl+"10":C.wh,color:C.dk,cursor:"pointer"}}>
              <option value="all">🌍 Todos los países</option>
              {allCountries.map(co => <option key={co} value={co}>{flags[co]||"🌍"} {co}</option>)}
            </select>}
            <span style={{flex:1}} />
            <span style={{fontSize:11,fontFamily:BD,color:C.gr}}>{filtered.length} / {totalC}</span>
            <div style={{display:"flex",border:"1px solid "+C.ln,borderRadius:3,overflow:"hidden"}}>
              <button onClick={() => setClientViewMode("cards")} title="Tarjetas" style={{padding:"6px 10px",background:clientViewMode==="cards"?C.dk:"transparent",color:clientViewMode==="cards"?C.bg:C.gr,border:"none",cursor:"pointer",fontSize:11,fontFamily:BD}}>▦</button>
              <button onClick={() => setClientViewMode("table")} title="Tabla" style={{padding:"6px 10px",background:clientViewMode==="table"?C.dk:"transparent",color:clientViewMode==="table"?C.bg:C.gr,border:"none",cursor:"pointer",fontSize:11,fontFamily:BD}}>≡</button>
            </div>
          </div>

          {/* CARDS VIEW */}
          {clientViewMode === "cards" && <>
            {filtered.length === 0 ? <div style={{textAlign:"center",padding:40,fontSize:12,fontFamily:BD,color:C.gr2}}>—</div> :
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(260px,100%),1fr))",gap:10}}>
              {filtered.map(c => {
                const s = clientStats[c.name]||{total:0,orders:0,lastDate:null,lastTs:0};
                const d = daysSince(s.lastTs);
                const bucket = channelBucket(c);
                const isFaire = bucket === "faire";
                const isDist = bucket.startsWith("dist:");
                const distName = isDist ? bucket.substring(5) : null;
                const statusCol = c.status === "vip" ? "#d4a030" : c.status === "prospect" ? C.bl : s.orders > 0 ? C.gn : C.gr2;
                const sleeping = s.orders > 0 && d !== null && d > 60;
                return <div key={c.id} onClick={() => { setModal("editCl"); setEd({...c}); }} style={{background:C.wh,border:"1.5px solid "+(c.status==="vip"?"#d4a03040":isFaire?"#00000020":isDist?C.bl+"20":C.ln),borderRadius:8,padding:"14px",cursor:"pointer",position:"relative",transition:"all 0.15s",display:"flex",flexDirection:"column",gap:8}}>
                  {sleeping && <div style={{position:"absolute",top:8,right:8,fontSize:9,fontFamily:BD,fontWeight:700,background:"#fff8e6",color:"#c47a00",padding:"2px 7px",borderRadius:3,border:"1px solid #f0a02040"}}>💤 {d}d</div>}
                  <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                    <div style={{width:40,height:40,borderRadius:20,background:statusCol+"20",color:statusCol,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,fontFamily:BD,flexShrink:0}}>{(c.name||"?")[0]?.toUpperCase()}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontFamily:BD,fontWeight:700,color:C.dk,lineHeight:1.2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
                      <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:2,display:"flex",alignItems:"center",gap:4}}>
                        <span style={{fontSize:11}}>{flags[c.country]||"🌍"}</span>
                        <span>{c.city||"—"}</span>
                        {c.country && <span>· {c.country}</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
                    {c.status === "vip" && <span style={{fontSize:8,fontFamily:BD,fontWeight:800,color:"#d4a030",background:"linear-gradient(135deg,#d4a03020,#c4903a20)",padding:"2px 6px",borderRadius:3,letterSpacing:1,border:"1px solid #d4a03040"}}>⭐ VIP</span>}
                    {c.status === "prospect" && <span style={{fontSize:8,fontFamily:BD,fontWeight:700,color:C.bl,background:C.bl+"15",padding:"2px 6px",borderRadius:3,letterSpacing:0.5}}>🌱 PROSPECTO</span>}
                    {isFaire && <span style={{fontSize:8,fontFamily:BD,fontWeight:700,color:"#fff",background:"#000",padding:"2px 6px",borderRadius:3,letterSpacing:0.5,display:"inline-flex",alignItems:"center",gap:3}}><span style={{width:10,height:10,borderRadius:5,background:"#fff",color:"#000",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:7,fontWeight:700}}>F</span> FAIRE</span>}
                    {isDist && <span style={{fontSize:8,fontFamily:BD,fontWeight:700,color:C.bl,background:C.bl+"15",padding:"2px 6px",borderRadius:3,letterSpacing:0.3}}>🤝 {distName.toUpperCase()}</span>}
                    {bucket === "direct" && <span style={{fontSize:8,fontFamily:BD,fontWeight:700,color:C.gn,background:C.gn+"15",padding:"2px 6px",borderRadius:3,letterSpacing:0.5}}>🌐 DIRECTO</span>}
                    {c.customPrice > 0 && <span style={{fontSize:8,fontFamily:BD,fontWeight:700,color:C.dk,background:C.bg,padding:"2px 6px",borderRadius:3}}>{fmt(c.customPrice)} €</span>}
                    {c.earlyPay && <span style={{fontSize:8,fontFamily:BD,fontWeight:700,color:CL.gn,background:CL.gn+"15",padding:"2px 6px",borderRadius:3}}>-3%</span>}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginTop:4,paddingTop:8,borderTop:"1px solid "+C.bg2}}>
                    <div style={{textAlign:"left"}}>
                      <div style={{fontSize:8,fontFamily:BD,color:C.gr2,letterSpacing:0.5,fontWeight:600}}>TOTAL</div>
                      <div style={{fontSize:12,fontFamily:DP,color:s.total>0?CL.gn:C.gr,fontWeight:600,lineHeight:1.1}}>{s.total>0?fmt(s.total)+" €":"—"}</div>
                    </div>
                    <div style={{textAlign:"center",borderLeft:"1px solid "+C.bg2,borderRight:"1px solid "+C.bg2}}>
                      <div style={{fontSize:8,fontFamily:BD,color:C.gr2,letterSpacing:0.5,fontWeight:600}}>PEDIDOS</div>
                      <div style={{fontSize:12,fontFamily:DP,color:C.dk,fontWeight:600,lineHeight:1.1}}>{s.orders||"—"}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:8,fontFamily:BD,color:C.gr2,letterSpacing:0.5,fontWeight:600}}>ÚLTIMO</div>
                      <div style={{fontSize:10,fontFamily:BD,color:sleeping?"#c47a00":C.dk,fontWeight:600,lineHeight:1.1}}>{s.lastDate ? (d===0?"hoy":d===1?"1d":d<30?d+"d":d<365?Math.floor(d/30)+"m":"+1a") : "—"}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:4,marginTop:4,paddingTop:6,borderTop:"1px dashed "+C.bg2}}>
                    {c.companyEmail && <button onClick={(e) => { e.stopPropagation(); window.location.href="mailto:"+c.companyEmail; }} title={c.companyEmail} style={{flex:1,padding:"5px 6px",background:"transparent",border:"1px solid "+C.ln,borderRadius:3,cursor:"pointer",fontSize:9,fontFamily:BD,color:C.gr,fontWeight:600}}>✉ Email</button>}
                    {c.phone && <button onClick={(e) => { e.stopPropagation(); window.location.href="tel:"+c.phone; }} title={c.phone} style={{flex:1,padding:"5px 6px",background:"transparent",border:"1px solid "+C.ln,borderRadius:3,cursor:"pointer",fontSize:9,fontFamily:BD,color:C.gr,fontWeight:600}}>📞 Tel</button>}
                    {s.orders > 0 && <button onClick={(e) => { e.stopPropagation(); setOrdChannelFilter("all"); setClientSearch(c.name); setView("a-ord"); }} title="Ver pedidos" style={{flex:1,padding:"5px 6px",background:"transparent",border:"1px solid "+C.ln,borderRadius:3,cursor:"pointer",fontSize:9,fontFamily:BD,color:C.gr,fontWeight:600}}>🛒 {s.orders}</button>}
                  </div>
                </div>;
              })}
            </div>}
          </>}

          {/* TABLE VIEW */}
          {clientViewMode === "table" && <>
            {filtered.length === 0 ? <div style={{textAlign:"center",padding:40,fontSize:12,fontFamily:BD,color:C.gr2}}>—</div> :
            <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",borderBottom:"2px solid "+C.ln,background:C.bg,fontSize:9,fontFamily:BD,color:C.gr,fontWeight:700,letterSpacing:0.5,textTransform:"uppercase"}}>
                <span style={{flex:"1 1 180px",minWidth:120}}>Cliente</span>
                <span style={{width:90,display:"none","@media (min-width: 700px)":{display:"inline"}}}>Canal</span>
                <span style={{width:80,textAlign:"right"}}>Total</span>
                <span style={{width:50,textAlign:"center"}}>Ped.</span>
                <span style={{width:60,textAlign:"right"}}>Últ.</span>
              </div>
              {filtered.map((c,i) => {
                const s = clientStats[c.name]||{total:0,orders:0,lastDate:null,lastTs:0};
                const d = daysSince(s.lastTs);
                const bucket = channelBucket(c);
                const sleeping = s.orders > 0 && d !== null && d > 60;
                return <div key={c.id} onClick={() => { setModal("editCl"); setEd({...c}); }} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderBottom:"1px solid "+C.bg2,background:i%2?C.bg:C.wh,cursor:"pointer"}}>
                  <div style={{flex:"1 1 180px",minWidth:120,display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:12}}>{flags[c.country]||"🌍"}</span>
                    <div style={{minWidth:0,flex:1}}>
                      <div style={{fontSize:12,fontFamily:BD,fontWeight:600,color:C.dk,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}{c.status==="vip" && <span style={{marginLeft:6,fontSize:8,fontWeight:800,color:"#d4a030"}}>⭐VIP</span>}</div>
                      <div style={{fontSize:9,fontFamily:BD,color:C.gr,marginTop:1}}>{c.city||"—"}{c.country?" · "+c.country:""}</div>
                    </div>
                  </div>
                  <span style={{width:90,fontSize:9,fontFamily:BD,color:bucket==="faire"?"#000":bucket.startsWith("dist:")?C.bl:bucket==="direct"?C.gn:C.gr2,fontWeight:600}}>{bucket==="faire"?"FAIRE":bucket.startsWith("dist:")?bucket.substring(5):bucket==="direct"?"DIRECTO":(c.channel||"—")}</span>
                  <span style={{width:80,fontSize:11,fontFamily:DP,fontWeight:600,color:s.total>0?CL.gn:C.gr,textAlign:"right"}}>{s.total>0?fmt(s.total)+" €":"—"}</span>
                  <span style={{width:50,fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600,textAlign:"center"}}>{s.orders||"—"}</span>
                  <span style={{width:60,fontSize:9,fontFamily:BD,color:sleeping?"#c47a00":C.gr,textAlign:"right",fontWeight:sleeping?700:500}}>{s.lastDate ? (d===0?"hoy":d===1?"1d":d<30?d+"d":d<365?Math.floor(d/30)+"m":"+1a") : "—"}</span>
                </div>;
              })}
            </div>}
          </>}
        </Sec>
        </>;
      })()}

      {/* ADMIN DISTRIBUTORS */}
      {view === "a-dist" && <Sec title={t("distributeurs")} right={role==="admin" && <Btn small onClick={() => { setModal("newDist"); setEd({name:"",co:"",email:"",pw:"",phone:"",city:"",country:"",commRate:"15",lang:"fr",vatId:"",address:"",iban:"",bic:""}); }}>+ {t("distributeur")}</Btn>}>
        {(() => {
          const dists = users.filter(u => u.role === "distributor");
          return dists.length === 0
            ? <div style={{fontSize:12,fontFamily:BD,color:C.gr2,textAlign:"center",padding:30}}>—</div>
            : <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {dists.map((d,i) => {
                const dLabel = (d.co||"").replace(/ Showroom$/i,"").trim();
                const dClients = clients.filter(c => (c.channel||"").toLowerCase().includes(dLabel.toLowerCase()));
                const dOrders = orders.filter(o => (o.dist||"").toLowerCase().includes(dLabel.toLowerCase()));
                const dSales = dOrders.reduce((s,o) => s+o.total, 0);
                const dComm = dOrders.reduce((s,o) => s+(o.comm||0), 0);
                const dPaid = dOrders.filter(o => o.pay === "paid").reduce((s,o) => s+(o.comm||0), 0);
                return (
                  <div key={i} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,overflow:"hidden",cursor:"pointer"}} onClick={() => { setModal("viewDist"); setEd({...d, _dLabel:dLabel, _dClients:dClients, _dOrders:dOrders, _dSales:dSales, _dComm:dComm, _dPaid:dPaid, _tab:"resume", distNotes:privateNotes["dist_"+d.email]||""}); }}>
                    <div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:14}}>
                      <div style={{width:40,height:40,borderRadius:20,background:C.bl+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,fontFamily:BD,color:C.bl,flexShrink:0}}>{d.name?.[0]||"?"}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:14,fontFamily:BD,color:C.dk,fontWeight:700}}>{d.co || d.name}</span>
                          <span style={{fontSize:9,fontFamily:BD,color:C.bl,background:C.bl+"15",padding:"2px 8px",borderRadius:10}}>{d.commRate||15}%</span>
                          {d.country && <span style={{fontSize:9,fontFamily:BD,color:C.gr,background:C.bg,padding:"2px 8px",borderRadius:10}}>{d.country}</span>}
                        </div>
                        <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginTop:2}}>{d.name} · {d.email}{d.phone?" · "+d.phone:""}{d.city?" · "+d.city:""}</div>
                      </div>
                      <div style={{display:"flex",gap:16,alignItems:"center",flexShrink:0}}>
                        <div style={{textAlign:"center"}}><div style={{fontSize:9,fontFamily:BD,color:C.gr}}>{t("clients")}</div><div style={{fontSize:16,fontFamily:BD,color:C.dk,fontWeight:700}}>{dClients.length}</div></div>
                        <div style={{textAlign:"center"}}><div style={{fontSize:9,fontFamily:BD,color:C.gr}}>{t("commandes")}</div><div style={{fontSize:16,fontFamily:BD,color:C.dk,fontWeight:700}}>{dOrders.length}</div></div>
                        <div style={{textAlign:"center"}}><div style={{fontSize:9,fontFamily:BD,color:C.gr}}>{t("ventesTotal")}</div><div style={{fontSize:16,fontFamily:BD,color:C.gn,fontWeight:700}}>{fmt(dSales)} €</div></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>;
        })()}
      </Sec>}

      {view === "a-stock" && <Sec title={t("gestionStock")} right={<div style={{display:"flex",gap:6}}><Btn small ghost onClick={() => { const allLines = orders.flatMap(o => (o.lines||[]).map(l => ({...l}))); const velocity = {}; products.forEach(p => { velocity[p.sku] = allLines.filter(l => l.sku === p.sku).reduce((s,l) => s+l.qty, 0); }); const restock = products.filter(p => p.stock < 10 || (velocity[p.sku]||0) > p.stock).sort((a,b) => (a.stock-(velocity[a.sku]||0))-(b.stock-(velocity[b.sku]||0))).map(p => { const sold=velocity[p.sku]||0; const sug=Math.max(0,Math.ceil(sold*1.5)-p.stock); return {...p,_sold:sold,_sug:sug,_order:sug}; }); setModal("supplierOrder"); setEd({lines:restock}); }}>📋 Pedido proveedor</Btn><Btn small onClick={() => { setModal("newProd"); setEd({model:"",color:"",sku:"",cat:"Essential",col:"Essential",stock:"20",fixedPrice:0}); }}>{t("nouveauProduit")}</Btn></div>}>
        {(() => {
          const allLines = orders.flatMap(o => (o.lines||[]).map(l => ({...l})));
          const velocity = {}; products.forEach(p => { velocity[p.sku] = allLines.filter(l => l.sku === p.sku).reduce((s,l) => s+l.qty, 0); });
          const totalStock = products.reduce((s,p) => s+p.stock, 0);
          const outOfStock = products.filter(p => p.stock === 0);
          const lowStock = products.filter(p => p.stock > 0 && p.stock < 5);
          const alertStock = products.filter(p => p.stock >= 5 && p.stock < 10);
          const needRestock = products.filter(p => p.stock < 10 && (velocity[p.sku]||0) >= p.stock);
          const problemProducts = products.filter(p => p.stock === 0 || p.stock < 5 || (p.stock < 10 && (velocity[p.sku]||0) >= p.stock)).sort((a,b) => a.stock - b.stock);
          const topSold = [...products].sort((a,b) => (velocity[b.sku]||0)-(velocity[a.sku]||0)).slice(0,5);

          /* Group by model */
          const modelGroups = {};
          const filteredProducts = products.filter(p => {
            const matchCol = colFilter === "all" || p.col === colFilter;
            const matchSearch = !stockSearch || p.model.toLowerCase().includes(stockSearch.toLowerCase()) || p.color.toLowerCase().includes(stockSearch.toLowerCase()) || p.sku.toLowerCase().includes(stockSearch.toLowerCase());
            return matchCol && matchSearch;
          });
          filteredProducts.forEach(p => {
            if (!modelGroups[p.model]) modelGroups[p.model] = {model:p.model, col:p.col, colors:[], totalStock:0, totalSold:0, imageUrl:""};
            modelGroups[p.model].colors.push(p);
            modelGroups[p.model].totalStock += p.stock;
            modelGroups[p.model].totalSold += (velocity[p.sku]||0);
            if (!modelGroups[p.model].imageUrl && p.imageUrl) modelGroups[p.model].imageUrl = p.imageUrl;
          });
          const modelList = Object.values(modelGroups).sort((a,b) => a.totalStock - b.totalStock);

          return <>
          {/* KPI CARDS */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:8,marginBottom:16}}>
            {[[totalStock,"STOCK TOTAL",C.dk,"all"],[outOfStock.length,"AGOTADOS",C.rd,"out"],[lowStock.length,"< 5 UDS",C.yl,"low"],[alertStock.length,"< 10 UDS","#e67e22","alert"],[needRestock.length,"REPONER",C.bl,"restock"]].map(([val,label,color,fk]) =>
              <div key={fk} onClick={() => { setStockFilter(fk); if(fk!=="all") setStockShowAll(true); }} style={{background:stockFilter===fk?color+"12":C.wh,border:"1px solid "+(stockFilter===fk?color+"40":C.ln),borderRadius:8,padding:"10px 8px",textAlign:"center",cursor:"pointer"}}>
                <div style={{fontSize:22,fontWeight:300,fontFamily:DP,color}}>{val}</div>
                <div style={{fontSize:8,color:color+"90",fontFamily:BD,letterSpacing:0.5,fontWeight:600}}>{label}</div>
              </div>
            )}
          </div>

          {/* TOP SELLERS */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:600,fontFamily:BD,color:C.dk,marginBottom:8}}>🔥 Top vendidos</div>
            <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
              {topSold.map(p => <div key={p.sku} style={{minWidth:120,background:C.wh,border:"1px solid "+(p.stock<5?C.rd+"40":C.ln),borderRadius:6,padding:"8px 10px",flexShrink:0}}>
                <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}>
                  {p.imageUrl && <img src={p.imageUrl} style={{width:24,height:24,objectFit:"contain",borderRadius:2}} />}
                  <div><div style={{fontSize:10,fontWeight:600,fontFamily:BD}}>{p.model}</div><div style={{fontSize:8,color:C.gr,fontFamily:BD}}>{p.color}</div></div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:9,fontFamily:BD}}>
                  <span style={{color:C.bl}}>Vend: {velocity[p.sku]||0}</span>
                  <span style={{color:p.stock<5?C.rd:p.stock<10?C.yl:C.gn,fontWeight:700}}>St: {p.stock}</span>
                </div>
              </div>)}
            </div>
          </div>

          {/* SEARCH + FILTERS */}
          <div style={{display:"flex",gap:6,marginBottom:12,alignItems:"center",flexWrap:"wrap"}}>
            <input placeholder={"🔍 "+t("rechercherProd")} value={stockSearch} onChange={e => setStockSearch(e.target.value)} style={{padding:"7px 12px",border:"1px solid "+C.ln,borderRadius:20,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,width:"min(200px, 40vw)"}} />
            {[["all","Tout"],["Essential","Essential"],["Icons","Icons"],["Acetato","Acetato"]].map(([v,l]) =>
              <button key={v} onClick={() => setColFilter(v)} style={{padding:"5px 12px",background:colFilter===v?C.dk:"transparent",color:colFilter===v?C.bg:C.gr,border:"1px solid "+(colFilter===v?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:500,borderRadius:3}}>{l}</button>
            )}
            {products.filter(p => p.active === false).length > 0 && <button onClick={() => setStockFilter(stockFilter==="hidden"?"all":"hidden")} style={{padding:"5px 12px",background:stockFilter==="hidden"?"#666":"transparent",color:stockFilter==="hidden"?"#fff":"#666",border:"1px solid #666",cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:600,borderRadius:3}}>⊘ Ocultos ({products.filter(p => p.active === false).length})</button>}
            <span style={{flex:1}} />
            <button onClick={() => { setStockShowAll(!stockShowAll); setStockFilter("all"); }} style={{padding:"5px 14px",background:stockShowAll?C.dk:C.bl+"12",color:stockShowAll?C.bg:C.bl,border:"1px solid "+(stockShowAll?C.dk:C.bl+"30"),cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:600,borderRadius:3}}>{stockShowAll?"✕ Solo problemas":"📦 Ver todo"}</button>
          </div>

          {/* DEFAULT: ONLY PROBLEMS */}
          {!stockShowAll && !stockSearch && stockFilter==="all" && <>
            {problemProducts.length === 0 ? <div style={{textAlign:"center",padding:30,color:C.gn,fontFamily:BD,fontSize:13}}>✓ Todo el stock OK — sin urgencias</div> :
            <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>
              <div style={{padding:"8px 12px",background:C.rd+"08",borderBottom:"1px solid "+C.rd+"15",fontSize:10,fontFamily:BD,fontWeight:600,color:C.rd}}>⚠ {problemProducts.length} productos necesitan atención</div>
              {problemProducts.map((p,i) => {
                const sold = velocity[p.sku]||0;
                const ratio = sold > 0 && p.stock > 0 ? p.stock/sold : p.stock===0?0:99;
                return <div key={p.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderBottom:"1px solid "+C.bg2,background:p.stock===0?C.rd+"06":C.yl+"04",cursor:"pointer"}} onClick={() => { setModal("editSt"); setEd({...p, stock:String(p.stock), _sold:sold}); }}>
                  <div style={{width:36,height:36,borderRadius:4,background:C.wh,border:"1px solid "+C.ln,overflow:"hidden",flexShrink:0}}>
                    {p.imageUrl ? <img src={p.imageUrl} style={{width:"100%",height:"100%",objectFit:"contain"}} /> : <span style={{fontSize:7,color:C.ln}}>—</span>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <span style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>{p.model} </span>
                    <span style={{fontSize:11,fontFamily:BD,color:C.gr}}>{p.color}</span>
                    <div style={{fontSize:9,fontFamily:BD,color:C.gr2}}>{p.sku} · {p.col}</div>
                  </div>
                  <span style={{fontSize:10,fontFamily:BD,color:C.bl,minWidth:45,textAlign:"center"}}>Vend: {sold}</span>
                  <span style={{fontSize:p.stock===0?9:14,fontWeight:700,fontFamily:BD,color:p.stock===0?"#fff":C.rd,background:p.stock===0?C.rd:"transparent",padding:p.stock===0?"3px 8px":"0",borderRadius:10,minWidth:40,textAlign:"center"}}>{p.stock===0?"AGOTADO":p.stock}</span>
                  <span style={{fontSize:14}}>{p.stock===0?"🔴":ratio<1?"🟠":"🟡"}</span>
                </div>;
              })}
            </div>}
          </>}

          {/* FILTERED VIEW (when clicking KPI cards) */}
          {!stockShowAll && (stockSearch || stockFilter!=="all") && <>
            <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>
              {(stockFilter==="out"?outOfStock:stockFilter==="low"?lowStock:stockFilter==="alert"?alertStock:stockFilter==="restock"?needRestock:stockFilter==="hidden"?products.filter(p => p.active === false):filteredProducts).sort((a,b)=>a.stock-b.stock).map((p,i) => {
                const sold=velocity[p.sku]||0;
                return <div key={p.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderBottom:"1px solid "+C.bg2,background:p.active===false?"#fafafa":p.stock===0?C.rd+"06":i%2?C.bg:C.wh,cursor:"pointer",opacity:p.active===false?0.6:1}} onClick={() => { setModal("editSt"); setEd({...p, stock:String(p.stock), _sold:sold}); }}>
                  <div style={{width:36,height:36,borderRadius:4,background:C.wh,border:"1px solid "+C.ln,overflow:"hidden",flexShrink:0,position:"relative"}}>
                    {p.imageUrl ? <img src={p.imageUrl} style={{width:"100%",height:"100%",objectFit:"contain",opacity:p.active===false?0.5:1}} /> : <span style={{fontSize:7,color:C.ln}}>—</span>}
                  </div>
                  <div style={{flex:1}}><span style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>{p.model} </span><span style={{fontSize:11,fontFamily:BD,color:C.gr}}>{p.color}</span>{p.active===false && <span style={{fontSize:8,marginLeft:6,padding:"1px 5px",background:"#66666625",color:"#666",borderRadius:3,fontWeight:700,letterSpacing:0.3}}>OCULTO</span>}<div style={{fontSize:9,fontFamily:BD,color:C.gr2}}>{p.sku}</div></div>
                  <span style={{fontSize:9,fontFamily:BD,color:C.gr2,background:C.bg,padding:"2px 6px",borderRadius:10}}>{p.col}</span>
                  <span style={{fontSize:10,fontFamily:BD,color:C.bl}}>Vend: {sold}</span>
                  <span style={{fontSize:p.stock===0?9:14,fontWeight:700,fontFamily:BD,color:p.stock===0?"#fff":p.stock<5?C.rd:p.stock<10?C.yl:C.gn,background:p.stock===0?C.rd:"transparent",padding:p.stock===0?"3px 8px":"0",borderRadius:10,minWidth:35,textAlign:"center"}}>{p.stock===0?"AGT":p.stock}</span>
                </div>;
              })}
              {(stockFilter==="out"?outOfStock:stockFilter==="low"?lowStock:stockFilter==="alert"?alertStock:stockFilter==="restock"?needRestock:stockFilter==="hidden"?products.filter(p => p.active === false):filteredProducts).length===0 && <div style={{padding:20,textAlign:"center",fontSize:12,color:C.gr}}>—</div>}
            </div>
          </>}

          {/* VER TODO: GROUPED BY MODEL */}
          {stockShowAll && !stockSearch && <>
            <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>
              {modelList.map((mg,mi) => {
                const isExpanded = expandedModels[mg.model];
                const hasProblems = mg.colors.some(c => c.stock < 5);
                const minStock = Math.min(...mg.colors.map(c=>c.stock));
                return <div key={mg.model}>
                  <div onClick={() => setExpandedModels(p => ({...p,[mg.model]:!p[mg.model]}))} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",borderBottom:"1px solid "+C.bg2,background:hasProblems?(minStock===0?C.rd+"06":C.yl+"04"):(mi%2?C.bg:C.wh),cursor:"pointer"}}>
                    <span style={{fontSize:10,color:C.gr,width:14,flexShrink:0}}>{isExpanded?"▼":"▶"}</span>
                    <div style={{width:32,height:32,borderRadius:4,background:C.wh,border:"1px solid "+C.ln,overflow:"hidden",flexShrink:0}}>
                      {mg.imageUrl ? <img src={mg.imageUrl} style={{width:"100%",height:"100%",objectFit:"contain"}} /> : <span style={{fontSize:7,color:C.ln}}>—</span>}
                    </div>
                    <div style={{flex:1}}>
                      <span style={{fontSize:13,fontWeight:700,fontFamily:BD,color:C.dk}}>{mg.model}</span>
                      <span style={{fontSize:10,fontFamily:BD,color:C.gr,marginLeft:6}}>{mg.colors.length} colores</span>
                    </div>
                    <span style={{fontSize:9,fontFamily:BD,color:C.gr2,background:C.bg,padding:"2px 6px",borderRadius:10}}>{mg.col}</span>
                    <span style={{fontSize:10,fontFamily:BD,color:C.bl,minWidth:45,textAlign:"center"}}>Vend: {mg.totalSold}</span>
                    <span style={{fontSize:14,fontWeight:700,fontFamily:BD,color:minStock===0?C.rd:minStock<5?C.yl:minStock<10?"#e67e22":C.gn,minWidth:35,textAlign:"center"}}>{mg.totalStock}</span>
                    <span style={{fontSize:13}}>{minStock===0?"🔴":minStock<5?"🟡":"🟢"}</span>
                  </div>
                  {isExpanded && mg.colors.sort((a,b) => a.stock-b.stock).map((p,ci) => {
                    const sold=velocity[p.sku]||0;
                    return <div key={p.sku} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 12px 7px 48px",borderBottom:"1px solid "+C.bg2,background:p.stock===0?C.rd+"04":C.bg,cursor:"pointer"}} onClick={() => { setModal("editSt"); setEd({...p, stock:String(p.stock), _sold:sold}); }}>
                      <div style={{width:28,height:28,borderRadius:3,background:C.wh,border:"1px solid "+C.ln,overflow:"hidden",flexShrink:0}}>
                        {p.imageUrl ? <img src={p.imageUrl} style={{width:"100%",height:"100%",objectFit:"contain"}} /> : null}
                      </div>
                      <span style={{fontSize:11,fontFamily:BD,color:C.dk,flex:1}}>{p.color}</span>
                      <span style={{fontSize:9,fontFamily:BD,color:C.gr2}}>{p.sku}</span>
                      <span style={{fontSize:9,fontFamily:BD,color:C.bl}}>Vend: {sold}</span>
                      <span style={{fontSize:12,fontWeight:700,fontFamily:BD,color:p.stock===0?C.rd:p.stock<5?C.yl:C.gn,minWidth:30,textAlign:"center"}}>{p.stock}</span>
                      <span style={{fontSize:12}}>{p.stock===0?"🔴":p.stock<5?"🟡":"🟢"}</span>
                    </div>;
                  })}
                </div>;
              })}
            </div>
          </>}

          {/* VER TODO + SEARCH: flat filtered list */}
          {stockShowAll && stockSearch && <>
            <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>
              {filteredProducts.sort((a,b) => a.stock-b.stock).map((p,i) => {
                const sold=velocity[p.sku]||0;
                return <div key={p.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderBottom:"1px solid "+C.bg2,background:p.stock===0?C.rd+"06":i%2?C.bg:C.wh,cursor:"pointer"}} onClick={() => { setModal("editSt"); setEd({...p, stock:String(p.stock), _sold:sold}); }}>
                  <div style={{width:36,height:36,borderRadius:4,background:C.wh,border:"1px solid "+C.ln,overflow:"hidden",flexShrink:0}}>
                    {p.imageUrl ? <img src={p.imageUrl} style={{width:"100%",height:"100%",objectFit:"contain"}} /> : <span style={{fontSize:7,color:C.ln}}>—</span>}
                  </div>
                  <div style={{flex:1}}><span style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>{p.model} </span><span style={{fontSize:11,fontFamily:BD,color:C.gr}}>{p.color}</span><div style={{fontSize:9,fontFamily:BD,color:C.gr2}}>{p.sku}</div></div>
                  <span style={{fontSize:9,fontFamily:BD,color:C.gr2,background:C.bg,padding:"2px 6px",borderRadius:10}}>{p.col}</span>
                  <span style={{fontSize:10,fontFamily:BD,color:C.bl}}>Vend: {sold}</span>
                  <span style={{fontSize:p.stock===0?9:14,fontWeight:700,fontFamily:BD,color:p.stock===0?"#fff":p.stock<5?C.rd:p.stock<10?C.yl:C.gn,background:p.stock===0?C.rd:"transparent",padding:p.stock===0?"3px 8px":"0",borderRadius:10,minWidth:35,textAlign:"center"}}>{p.stock===0?"AGT":p.stock}</span>
                </div>;
              })}
            </div>
          </>}

        </>;})()}
      </Sec>}

      {view === "a-inv" && <Sec title={t("factures")}>
        <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>
          {orders.map((o, i) => { const ship = o.shippingCost > 0 ? o.shippingCost : 0; const ttc = (o.total + ship) * 1.21; return (
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"12px 14px",borderBottom:"1px solid "+C.bg2}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flex:1,cursor:"pointer",flexWrap:"wrap",minWidth:0}} onClick={() => { setModal("viewInv"); setEd({...o}); }}>
                <span style={{fontSize:11,fontWeight:600,fontFamily:BD,color:C.dk}}>{("F-"+o.id.replace("#",""))}</span>
                <span style={{fontSize:12,fontFamily:BD,color:C.dk,flex:"1 1 100px",minWidth:60}}>{o.client}</span>
                <span style={{fontSize:11,fontFamily:BD,color:C.gr}}>{o.date}</span>
                <span style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600}}>{fmt(ttc)} €</span>
                <Badge l={PL[o.pay]} c={PC[o.pay]} />
              </div>
              <button onClick={(e) => { e.stopPropagation(); askConfirm(t("confirmarEliminar"), () => { const o = orders[i]; setOrders(p => p.filter((_,j) => j!==i)); dbDeleteOrder(o); toast(t("pedidoEliminado")); }); }} style={{background:C.rd,border:"none",color:"#fff",cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:600,padding:"6px 10px",borderRadius:3,flexShrink:0,whiteSpace:"nowrap"}}>{t("eliminar")}</button>
            </div>
          ); })}
        </div>
      </Sec>}

      {view === "a-promo" && <Sec title={t("gestionPromos")} right={<Btn small onClick={() => { setModal("newPromo"); setEd({name:"",type:"percent",disc:5,cond:{fr:"",es:"",en:"",it:""},on:true,visible:["client","distributor"]}); }}>{t("nouvellePromo")}</Btn>}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
          {promos.map((p,i) => renderPromoCard(p, i, true))}
        </div>
      </Sec>}

      {view === "a-news" && <Sec title={t("gestionNouveautes")} right={<Btn small onClick={() => { setModal("newNews"); setEd({title:{fr:"",es:"",en:"",it:""},content:{fr:"",es:"",en:"",it:""},pinned:false,on:true}); }}>{t("nouvelleNouveaute")}</Btn>}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {news.map((n,i) => (
            <div key={i} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,padding:"16px 20px",cursor:"pointer",opacity:n.on?1:0.5}} onClick={() => { setModal("editNews"); setEd({...n}); }}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontSize:14,fontWeight:500,fontFamily:DP,color:C.dk}}>{(n.title&&n.title[lang])||n.title?.fr||""}</span>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  {n.pinned && <Badge l={t("epingle")} c={C.yl} />}
                  <Badge l={n.on?t("active"):t("inactive")} c={n.on?C.gn:C.gr} />
                  <span style={{fontSize:10,fontFamily:BD,color:C.gr2}}>{n.date}</span>
                </div>
              </div>
              <div style={{fontSize:11,fontFamily:BD,color:C.gr,lineHeight:1.5}}>{(n.content&&n.content[lang])||n.content?.fr||""}</div>
            </div>
          ))}
        </div>

        {/* INSIGHTS MOTIVADORES */}
        <div style={{marginTop:32}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontSize:16,fontFamily:DP,color:C.dk,fontWeight:500}}>💡 {t("gestionInsights")}</div>
            <Btn small onClick={() => { setModal("newInsight"); setEd({icon:"📊",title:{fr:"",es:"",en:"",it:""},text:{fr:"",es:"",en:"",it:""},on:true}); }}>{t("nuevoInsight")}</Btn>
          </div>
          <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:12}}>Frases motivadoras con datos de mercado que aparecen en el dashboard de clientes y distribuidores</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {insights.map((ins,i) => (
              <div key={i} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,padding:"14px 18px",cursor:"pointer",opacity:ins.on?1:0.5,display:"flex",gap:12,alignItems:"flex-start"}} onClick={() => { setModal("editInsight"); setEd({...ins}); }}>
                <div style={{fontSize:26,flexShrink:0,lineHeight:1}}>{ins.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:13,fontWeight:600,fontFamily:BD,color:C.dk}}>{(ins.title&&ins.title[lang])||ins.title?.es||""}</span>
                    <Badge l={ins.on?t("active"):t("inactive")} c={ins.on?C.gn:C.gr} />
                  </div>
                  <div style={{fontSize:11,fontFamily:BD,color:C.gr,lineHeight:1.5}}>{(ins.text&&ins.text[lang])||ins.text?.es||""}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Sec>}

      {view === "a-tasks" && <Sec title={t("gestionTareas")} right={<Btn small onClick={() => { setModal("newTask"); setEd({title:"",desc:"",priority:"moyenne",area:"commercial",status:"aFaire"}); }}>{t("nouvelleTache")}</Btn>}>
        <div style={{display:"flex",gap:4,marginBottom:14,flexWrap:"wrap"}}>
          {["all","commercial","finances","marketing","produits","clientsArea","logistique","defectos","proveedor","admin"].map(a => (
            <button key={a} onClick={() => setTaskFilter(a)} style={{padding:"5px 12px",background:taskFilter===a?C.dk:"transparent",color:taskFilter===a?C.bg:C.gr,border:"1px solid "+(taskFilter===a?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:500,borderRadius:3}}>{a==="all"?t("toutesAreas"):t(a)}</button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
          {["aFaire","enCours","fait"].map(st => {
            const prioOrder = {haute:0,moyenne:1,basse:2};
            const prioColor = {haute:C.rd,moyenne:C.yl,basse:C.gn};
            const areaColor = {commercial:"#2980b9",finances:"#27ae60",marketing:"#8e44ad",produits:"#d35400",clientsArea:"#16a085",logistique:"#2c3e50",defectos:"#e74c3c",proveedor:"#f39c12",admin:"#7f8c8d"};
            const filtered = tasks.filter(tk => tk.status === st && (taskFilter === "all" || tk.area === taskFilter)).sort((a,b) => (prioOrder[a.priority]||1) - (prioOrder[b.priority]||1));
            return (
              <div key={st}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <span style={{fontSize:13,fontFamily:BD,fontWeight:600,color:C.dk}}>{t(st)}</span>
                  <span style={{fontSize:10,fontFamily:BD,color:C.gr,background:C.bg,padding:"2px 8px",borderRadius:8}}>{filtered.length}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8,minHeight:100,background:C.bg,borderRadius:6,padding:8,border:"1px solid "+C.ln}}>
                  {filtered.map((tk,i) => (
                    <div key={i} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,padding:"12px 14px",cursor:"pointer",borderLeft:"4px solid "+(prioColor[tk.priority]||C.gr)}} onClick={() => { setModal("editTask"); setEd({...tk}); }}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                        <span style={{fontSize:12,fontFamily:BD,fontWeight:600,color:C.dk}}>{tk.title}</span>
                        <Badge l={t(tk.priority)} c={prioColor[tk.priority]||C.gr} />
                      </div>
                      {tk.desc && <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:6,lineHeight:1.4}}>{tk.desc}</div>}
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                        <span style={{fontSize:9,fontFamily:BD,color:"#fff",background:areaColor[tk.area]||C.gr,padding:"2px 8px",borderRadius:3}}>{t(tk.area)}</span>
                        <div style={{display:"flex",gap:6,alignItems:"center"}}>
                          {tk.assignee && <span style={{fontSize:9,fontFamily:BD,color:C.bl,background:C.bl+"15",padding:"2px 6px",borderRadius:3}}>👤 {tk.assignee}</span>}
                          {tk.dueDate && (() => { const d = new Date(tk.dueDate); const overdue = d < new Date() && tk.status !== "fait"; return <span style={{fontSize:9,fontFamily:BD,color:overdue?C.rd:C.gr2,fontWeight:overdue?600:400}}>{overdue?"⚠ ":""}{d.toLocaleDateString()}</span>; })()}
                          {!tk.dueDate && <span style={{fontSize:9,fontFamily:BD,color:C.gr2}}>{tk.date}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                  {filtered.length === 0 && <div style={{textAlign:"center",padding:20,fontSize:11,color:C.gr2,fontFamily:BD}}>—</div>}
                </div>
              </div>
            );
          })}
        </div>
      </Sec>}

      {view === "a-decisiones" && (() => {
        // ===== DECISION ENGINE — deterministic rules cross-referencing data =====
        const now = Date.now();
        const parseDate = (d) => { const parts = (d||"").split("/"); return parts.length===3 ? new Date(parts[2]+"-"+parts[1].padStart(2,"0")+"-"+parts[0].padStart(2,"0")).getTime() : 0; };
        const daysSince = ts => ts ? Math.floor((now - ts) / 86400000) : null;
        const totalCost = (pid) => { const c = productCosts[pid]; if (!c) return 0; return (c.supplier||0)+(c.freight||0)+(c.customs||0)+(c.packaging||0); };

        // Velocity per product (units sold all time + last 30d)
        const velocity = {}, velocity30 = {};
        const allLines = [];
        orders.forEach(o => { const ts = parseDate(o.date); const recent = ts && (now-ts) < 30*86400000; (o.lines||[]).forEach(l => { const key = l.sku || (l.model+"|"+l.color); velocity[key] = (velocity[key]||0) + (l.qty||0); if (recent) velocity30[key] = (velocity30[key]||0) + (l.qty||0); allLines.push({...l, _ts:ts, _client:o.client, _dist:o.dist}); }); });

        // Client stats
        const clientStats = {};
        clients.forEach(c => { clientStats[c.name] = {total:0, orders:0, lastTs:0, dates:[]}; });
        orders.forEach(o => { if (clientStats[o.client]) { clientStats[o.client].total += o.total||0; clientStats[o.client].orders += 1; const ts = parseDate(o.date); clientStats[o.client].dates.push(ts); if (ts > clientStats[o.client].lastTs) clientStats[o.client].lastTs = ts; } });

        const decisions = [];

        // ===== LEVER 1: STOCKOUT RISK (cross stock × velocity) =====
        products.filter(p => p.active !== false).forEach(p => {
          const key = p.sku || (p.model+"|"+p.color);
          const v30 = velocity30[key] || 0;
          if (v30 > 0 && p.stock >= 0) {
            const dailyRate = v30 / 30;
            const daysLeft = dailyRate > 0 ? Math.floor(p.stock / dailyRate) : 999;
            if (daysLeft <= 21 && p.stock < 30) {
              const lostUnitsMonth = Math.round(dailyRate * 30);
              const sellPrice = p.col === "Acetato" ? (p.fixedPrice||0) : 22.90;
              const impact = Math.round(lostUnitsMonth * sellPrice);
              decisions.push({
                id:"stock-"+p.id, lever:"Stock", severity: daysLeft<=7?"high":daysLeft<=14?"med":"low",
                icon:"📦", title:p.model+" "+p.color+" se agota en ~"+daysLeft+" días",
                detail:"Vende "+v30+" uds/mes y quedan "+p.stock+" en stock. Si se agota, pierdes ventas de un best-seller activo.",
                action:"Incluir en el próximo pedido a proveedor (sugerido: "+Math.max(20,Math.round(dailyRate*45))+" uds para 45 días)",
                impact:impact, impactLabel:"~"+fmt(impact)+" €/mes en ventas en riesgo",
                cta:"Ir a pedido proveedor", ctaAction:() => setView("a-stock")
              });
            }
          }
        });

        // ===== LEVER 2: DEAD STOCK (no sales 90d but has stock) =====
        products.filter(p => p.active !== false && p.stock > 5).forEach(p => {
          const key = p.sku || (p.model+"|"+p.color);
          const vAll = velocity[key] || 0;
          const v30 = velocity30[key] || 0;
          // Has stock, sold something historically but nothing recent, or never sold
          const lastSale = allLines.filter(l => (l.sku||(l.model+"|"+l.color)) === key).sort((a,b) => b._ts-a._ts)[0];
          const daysNoSale = lastSale ? daysSince(lastSale._ts) : null;
          if ((daysNoSale === null || daysNoSale > 90) && p.stock > 5) {
            const cost = totalCost(p.id);
            const tiedCapital = cost > 0 ? Math.round(cost * p.stock) : null;
            decisions.push({
              id:"dead-"+p.id, lever:"Stock muerto", severity: p.stock>20?"med":"low",
              icon:"🐌", title:p.model+" "+p.color+" sin rotación"+(daysNoSale?" hace "+daysNoSale+"d":" nunca vendido"),
              detail:p.stock+" uds paradas en almacén"+(tiedCapital?". Capital inmovilizado: ~"+fmt(tiedCapital)+" €":"."),
              action:"Opciones: (1) promo de liquidación -20%, (2) destacar como recomendado a clientes, (3) descatalogar y ocultar",
              impact: tiedCapital||0, impactLabel: tiedCapital?"~"+fmt(tiedCapital)+" € capital liberable":"Stock parado",
              cta:"Crear promo", ctaAction:() => setView("a-promo")
            });
          }
        });

        // ===== LEVER 3: SLEEPING CLIENTS (recompra cross frecuencia) =====
        clients.forEach(c => {
          const s = clientStats[c.name];
          if (!s || s.orders < 2) return;
          // Compute avg interval between orders
          const sorted = [...s.dates].filter(Boolean).sort((a,b) => a-b);
          if (sorted.length < 2) return;
          let totalGap = 0; for (let i=1;i<sorted.length;i++) totalGap += (sorted[i]-sorted[i-1]);
          const avgGap = totalGap / (sorted.length-1) / 86400000;
          const d = daysSince(s.lastTs);
          if (d !== null && avgGap > 0 && d > avgGap * 1.5 && d < 365) {
            const avgOrder = s.total / s.orders;
            decisions.push({
              id:"sleep-"+c.id, lever:"Recompra", severity: c.status==="vip"?"high":d>avgGap*2.5?"high":"med",
              icon:"⏰", title:c.name+" lleva "+d+"d sin pedir (suele pedir cada ~"+Math.round(avgGap)+"d)",
              detail:"Cliente "+(c.status==="vip"?"VIP ":"")+"con "+s.orders+" pedidos y ticket medio "+fmt(avgOrder)+" €. Ha superado su ciclo habitual de recompra.",
              action:"Enviar email/WhatsApp de reactivación con sus modelos habituales o una novedad SS26",
              impact: Math.round(avgOrder), impactLabel:"~"+fmt(avgOrder)+" € (su pedido medio)",
              cta:"Contactar cliente", ctaAction:() => { setModal("editCl"); setEd({...c}); }
            });
          }
        });

        // ===== LEVER 4: ONE-SHOT CLIENTS (captación que no repite) =====
        const oneShotRecent = clients.filter(c => { const s = clientStats[c.name]; if (!s || s.orders !== 1) return false; const d = daysSince(s.lastTs); return d !== null && d > 45 && d < 180; });
        if (oneShotRecent.length >= 3) {
          const totalValue = oneShotRecent.reduce((sum,c) => sum + (clientStats[c.name]?.total||0), 0);
          decisions.push({
            id:"oneshot-batch", lever:"Retención", severity:"med",
            icon:"🎣", title:oneShotRecent.length+" clientes compraron una vez y no han vuelto",
            detail:"Hicieron 1 pedido hace 45-180 días por un total de "+fmt(totalValue)+" €. Captarlos costó esfuerzo; reactivarlos es más barato que captar nuevos.",
            action:"Campaña de segunda compra: email con descuento -10% primera recompra + novedades. Clientes: "+oneShotRecent.slice(0,5).map(c=>c.name).join(", ")+(oneShotRecent.length>5?"...":""),
            impact: Math.round(totalValue*0.3), impactLabel:"~"+fmt(Math.round(totalValue*0.3))+" € potencial (30% reactivación)",
            cta:"Ver clientes", ctaAction:() => { setClientFilter("all"); setView("a-cl"); }
          });
        }

        // ===== LEVER 5: LOW MARGIN PRODUCTS (cross cost × price × volume) =====
        products.filter(p => p.active !== false && totalCost(p.id) > 0).forEach(p => {
          const key = p.sku || (p.model+"|"+p.color);
          const v = velocity[key] || 0;
          if (v < 5) return; // only products that actually sell
          const cost = totalCost(p.id);
          const sellPrice = p.col === "Acetato" ? (p.fixedPrice||0) : 22.90;
          if (sellPrice <= 0) return;
          const margin = (sellPrice - cost) / sellPrice * 100;
          if (margin < 35 && margin > 0) {
            decisions.push({
              id:"margin-"+p.id, lever:"Pricing", severity: margin<20?"high":"med",
              icon:"📉", title:p.model+" "+p.color+" tiene margen bajo ("+margin.toFixed(0)+"%)",
              detail:"Se vende bien ("+v+" uds) pero el margen es de solo "+margin.toFixed(0)+"% (coste "+fmt(cost)+" €, precio "+fmt(sellPrice)+" €). Cada venta deja poco.",
              action:"Opciones: (1) subir precio wholesale +1-2€, (2) renegociar coste con proveedor, (3) revisar packaging/flete asignado",
              impact: Math.round(v * sellPrice * 0.05), impactLabel:"~"+fmt(Math.round(v*sellPrice*0.05))+" € si subes precio 5%",
              cta:"Revisar costes", ctaAction:() => { setEd({_negTab:"costs"}); setView("a-negocio"); }
            });
          }
        });

        // ===== LEVER 6: MISSING COST DATA (can't decide without it) =====
        const productsNoCost = products.filter(p => p.active !== false && totalCost(p.id) === 0).length;
        if (productsNoCost > 0) {
          decisions.push({
            id:"setup-costs", lever:"Configuración", severity: productsNoCost > products.length/2 ? "high":"low",
            icon:"⚙️", title:productsNoCost+" productos sin coste configurado",
            detail:"Sin el coste real (proveedor+flete+aduana+packaging) no puedo calcular márgenes ni detectar productos poco rentables. Es la base de la mitad de las decisiones.",
            action:"Rellenar los costes en Datos negocio → Costes por producto",
            impact:0, impactLabel:"Desbloquea análisis de margen",
            cta:"Configurar costes", ctaAction:() => { setEd({_negTab:"costs"}); setView("a-negocio"); }
          });
        }

        // ===== LEVER 7: CHANNEL MARGIN COMPARISON (cross channel config) =====
        const last30 = orders.filter(o => { const t = parseDate(o.date); return t && (now-t) < 30*86400000; });
        const channelRev = {direct:0, faire:0, distributor:0};
        const channelUnits = {direct:0, faire:0, distributor:0};
        last30.forEach(o => { const dd = (o.dist||"").toLowerCase(); const k = dd==="faire"?"faire":(dd==="direct"||dd==="directo"||!dd)?"direct":"distributor"; channelRev[k] += o.total||0; channelUnits[k] += o.items||0; });
        if (channelUnits.faire > 0 && channelUnits.direct > 0) {
          // Compare effective net per unit
          const faireNetPerUnit = channelRev.faire / channelUnits.faire; // already net (we store net)
          const directNetPerUnit = channelRev.direct / channelUnits.direct;
          if (directNetPerUnit > faireNetPerUnit * 1.15) {
            const diff = Math.round((directNetPerUnit - faireNetPerUnit) * channelUnits.faire);
            decisions.push({
              id:"channel-shift", lever:"Mix de canal", severity:"med",
              icon:"🔀", title:"Tu venta directa deja "+(((directNetPerUnit/faireNetPerUnit)-1)*100).toFixed(0)+"% más por unidad que Faire",
              detail:"Directo: "+fmt(directNetPerUnit)+" €/ud neto · Faire: "+fmt(faireNetPerUnit)+" €/ud neto (tras comisión). Empujar clientes de Faire hacia tu plataforma B2B sube el margen.",
              action:"Invitar a tus mejores clientes de Faire a pedir directo en b2b.minueopticians.com (ya tienes el sistema de invitación)",
              impact: diff, impactLabel:"~"+fmt(diff)+" €/mes si migras volumen Faire a directo",
              cta:"Ver clientes Faire", ctaAction:() => { setClientChannelFilter("faire"); setView("a-cl"); }
            });
          }
        }

        // Sort by severity then impact
        const sevOrder = {high:0, med:1, low:2};
        decisions.sort((a,b) => (sevOrder[a.severity]-sevOrder[b.severity]) || (b.impact-a.impact));

        const dismissed = ed._dismissedDec || [];
        const allVisible = decisions.filter(d => !dismissed.includes(d.id));
        const showAllDec = ed._showAllDec || false;
        const visible = showAllDec ? allVisible : allVisible.slice(0, 5);
        const totalImpact = allVisible.reduce((s,d) => s + (d.impact||0), 0);
        const highCount = allVisible.filter(d => d.severity==="high").length;
        const sevColor = {high:C.rd, med:"#f0a020", low:C.bl};
        const sevLabel = {high:"PRIORITARIA", med:"IMPORTANTE", low:"OPORTUNIDAD"};

        return <>
        <Sec title={t("decisiones")} sub="Oportunidades detectadas cruzando tus datos · cada una termina en una acción">

          {/* SUMMARY BAR */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginBottom:18}}>
            <div style={{background:visible.length>0?C.dk:CL.gn+"15",border:"1px solid "+(visible.length>0?C.dk:CL.gn),borderRadius:8,padding:"14px 16px"}}>
              <div style={{fontSize:9,fontFamily:BD,color:allVisible.length>0?C.bg+"90":CL.gn,letterSpacing:1,fontWeight:600}}>DECISIONES ABIERTAS</div>
              <div style={{fontSize:26,fontFamily:DP,fontWeight:400,color:allVisible.length>0?C.bg:CL.gn,lineHeight:1,marginTop:4}}>{allVisible.length}</div>
            </div>
            <div style={{background:C.wh,border:"1px solid "+(highCount>0?C.rd:C.ln),borderRadius:8,padding:"14px 16px"}}>
              <div style={{fontSize:9,fontFamily:BD,color:C.gr2,letterSpacing:1,fontWeight:600}}>PRIORITARIAS</div>
              <div style={{fontSize:26,fontFamily:DP,fontWeight:400,color:highCount>0?C.rd:C.gr,lineHeight:1,marginTop:4}}>{highCount}</div>
            </div>
            <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"14px 16px"}}>
              <div style={{fontSize:9,fontFamily:BD,color:C.gr2,letterSpacing:1,fontWeight:600}}>IMPACTO ESTIMADO</div>
              <div style={{fontSize:22,fontFamily:DP,fontWeight:400,color:CL.gn,lineHeight:1,marginTop:6}}>{fmt(totalImpact)} €</div>
            </div>
          </div>

          {/* DISCLAIMER */}
          <div style={{padding:"10px 14px",background:C.bl+"08",border:"1px solid "+C.bl+"20",borderRadius:8,marginBottom:16,fontSize:10,fontFamily:BD,color:C.gr,lineHeight:1.6}}>
            ℹ️ Los impactos son <strong>estimaciones</strong> basadas en tus datos actuales, para priorizar — no cifras contables exactas. La precisión mejora cuanto más completos estén los costes. Próximamente: capa de IA para análisis en lenguaje natural.
          </div>

          {/* DECISIONS LIST */}
          {allVisible.length === 0 ? <div style={{textAlign:"center",padding:50,background:C.wh,border:"1px dashed "+C.ln,borderRadius:8}}>
            <div style={{fontSize:40,marginBottom:10}}>✓</div>
            <div style={{fontSize:14,fontFamily:DP,color:CL.gn,fontWeight:600}}>Sin decisiones pendientes</div>
            <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginTop:6,lineHeight:1.5}}>No se han detectado oportunidades urgentes con los datos actuales.<br/>Cuantos más costes configures, más afina el motor.</div>
          </div> :
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {visible.map(d => <div key={d.id} style={{background:C.wh,border:"1px solid "+C.ln,borderLeft:"4px solid "+sevColor[d.severity],borderRadius:8,padding:"16px 18px"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                <div style={{fontSize:24,flexShrink:0}}>{d.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                    <span style={{fontSize:8,fontFamily:BD,fontWeight:800,color:sevColor[d.severity],background:sevColor[d.severity]+"15",padding:"2px 7px",borderRadius:3,letterSpacing:1}}>{sevLabel[d.severity]}</span>
                    <span style={{fontSize:9,fontFamily:BD,color:C.gr2,fontWeight:600,letterSpacing:0.5,textTransform:"uppercase"}}>{d.lever}</span>
                  </div>
                  <div style={{fontSize:14,fontFamily:BD,fontWeight:700,color:C.dk,lineHeight:1.3}}>{d.title}</div>
                  <div style={{fontSize:12,fontFamily:BD,color:C.gr,marginTop:6,lineHeight:1.6}}>{d.detail}</div>
                  <div style={{fontSize:12,fontFamily:BD,color:C.dk,marginTop:10,padding:"8px 12px",background:C.bg,borderRadius:6,lineHeight:1.5}}><strong style={{color:CL.gn}}>→ Acción:</strong> {d.action}</div>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginTop:12,flexWrap:"wrap"}}>
                    {d.impact > 0 && <span style={{fontSize:11,fontFamily:BD,fontWeight:700,color:CL.gn,background:CL.gn+"12",padding:"4px 10px",borderRadius:4}}>💰 {d.impactLabel}</span>}
                    {d.impact === 0 && <span style={{fontSize:11,fontFamily:BD,fontWeight:600,color:C.bl,background:C.bl+"12",padding:"4px 10px",borderRadius:4}}>🔓 {d.impactLabel}</span>}
                    <span style={{flex:1}} />
                    <button onClick={() => d.ctaAction()} style={{padding:"7px 16px",background:C.dk,color:C.bg,border:"none",borderRadius:4,fontSize:11,fontFamily:BD,fontWeight:600,cursor:"pointer"}}>{d.cta} →</button>
                    <button onClick={() => setEd(p => ({...p, _dismissedDec:[...(p._dismissedDec||[]), d.id]}))} title="Descartar" style={{padding:"7px 10px",background:"transparent",color:C.gr2,border:"1px solid "+C.ln,borderRadius:4,fontSize:11,fontFamily:BD,cursor:"pointer"}}>✕</button>
                  </div>
                </div>
              </div>
            </div>)}
          </div>}

          {dismissed.length > 0 && <button onClick={() => setEd(p => ({...p, _dismissedDec:[]}))} style={{marginTop:14,padding:"6px 12px",background:"transparent",border:"1px solid "+C.ln,borderRadius:4,fontSize:10,fontFamily:BD,color:C.gr,cursor:"pointer"}}>↺ Restaurar {dismissed.length} descartadas</button>}

          {allVisible.length > 5 && <button onClick={() => setEd(p => ({...p, _showAllDec: !p._showAllDec}))} style={{marginTop:14,marginLeft:dismissed.length>0?8:0,padding:"8px 16px",background:showAllDec?"transparent":C.dk,border:"1px solid "+C.dk,borderRadius:4,fontSize:11,fontFamily:BD,fontWeight:600,color:showAllDec?C.dk:C.bg,cursor:"pointer"}}>{showAllDec ? "↑ Ver solo prioritarias" : "↓ Ver las "+allVisible.length+" decisiones"}</button>}

          {/* ===== AI ASSISTANT ===== */}
          <div style={{marginTop:28,background:"linear-gradient(135deg,"+C.dk+",#0f2420)",borderRadius:12,padding:"20px 22px"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div style={{width:36,height:36,borderRadius:18,background:"linear-gradient(135deg,#c4956a,#d4a030)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>✨</div>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontFamily:DP,fontWeight:600,color:C.bg}}>Pregunta a Minüe AI</div>
                <div style={{fontSize:10,fontFamily:BD,color:C.bg+"80"}}>Analiza tus datos en tiempo real y propón decisiones</div>
              </div>
              {aiChat.length > 0 && <button onClick={() => { setAiChat([]); setAiError(""); }} style={{padding:"5px 12px",background:"transparent",border:"1px solid "+C.bg+"30",borderRadius:4,fontSize:10,fontFamily:BD,color:C.bg+"90",cursor:"pointer"}}>Limpiar</button>}
            </div>

            {/* Suggested prompts */}
            {aiChat.length === 0 && <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
              {["¿Qué 3 decisiones tomarías esta semana para ganar más?","¿Qué clientes debería reactivar y por qué?","¿Qué productos tienen peor margen y qué hago?","¿En qué canal debería enfocarme?","Redacta un email de reactivación para mi cliente más dormido"].map((q,i) =>
                <button key={i} onClick={() => askAI(q)} disabled={aiLoading} style={{padding:"7px 12px",background:C.bg+"12",border:"1px solid "+C.bg+"25",borderRadius:16,fontSize:10,fontFamily:BD,color:C.bg+"e0",cursor:aiLoading?"default":"pointer",lineHeight:1.3,textAlign:"left"}}>{q}</button>
              )}
            </div>}

            {/* Chat messages */}
            {aiChat.length > 0 && <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14,maxHeight:"50vh",overflowY:"auto"}}>
              {aiChat.map((m,i) => <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                <div style={{maxWidth:"85%",padding:"10px 14px",borderRadius:10,background:m.role==="user"?C.bg+"18":C.bg,color:m.role==="user"?C.bg:C.dk,fontSize:12,fontFamily:BD,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{m.content}</div>
              </div>)}
              {aiLoading && <div style={{display:"flex",justifyContent:"flex-start"}}><div style={{padding:"10px 14px",borderRadius:10,background:C.bg,color:C.gr,fontSize:12,fontFamily:BD}}>Analizando tus datos…</div></div>}
            </div>}

            {aiError && <div style={{padding:"10px 14px",background:C.rd+"20",border:"1px solid "+C.rd+"40",borderRadius:8,fontSize:11,fontFamily:BD,color:"#ffb0b0",marginBottom:12,lineHeight:1.5}}>⚠ {aiError}</div>}

            {/* Input */}
            <div style={{display:"flex",gap:8}}>
              <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => { if(e.key==="Enter") askAI(aiInput); }} placeholder="Pregunta algo sobre tu negocio…" disabled={aiLoading} style={{flex:1,padding:"12px 16px",border:"none",borderRadius:8,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              <button onClick={() => askAI(aiInput)} disabled={aiLoading || !aiInput.trim()} style={{padding:"12px 20px",background:aiInput.trim()&&!aiLoading?"linear-gradient(135deg,#c4956a,#d4a030)":C.bg+"40",color:aiInput.trim()&&!aiLoading?C.dk:C.bg+"60",border:"none",borderRadius:8,fontSize:12,fontFamily:BD,fontWeight:700,cursor:aiInput.trim()&&!aiLoading?"pointer":"default"}}>Enviar</button>
            </div>
            <div style={{fontSize:9,fontFamily:BD,color:C.bg+"50",marginTop:8,lineHeight:1.4}}>La IA analiza un resumen de tus datos reales. Las cifras son estimaciones para decidir, no contabilidad. No compartas las respuestas fuera de tu equipo.</div>
          </div>

        </Sec>
        </>;
      })()}

      {view === "a-prospectos" && (() => {
        const distUsers = users.filter(u => u.role === "distributor");
        const fDist = ed._pDist || "all";
        const list = prospects.filter(p => fDist === "all" || p.distributor === fDist);
        const stageOf = s => PSTAGES.find(x => x[0] === s) || PSTAGES[0];
        return <Sec title={"🎯 " + t("prospectos")} sub="Asigna contactos a tus distribuidores para que los trabajen" right={<Btn small onClick={() => { setModal("newProspect"); setEd({name:"",city:"",country:"",email:"",phone:"",web:"",instagram:"",noteAdmin:"",distributor:distUsers[0]?.co||"",_pDist:fDist}); }}>{t("nuevoProspecto")}</Btn>}>
          <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
            {[["all",t("tous")+" ("+prospects.length+")"], ...distUsers.map(u => [u.co, u.co+" ("+prospects.filter(p => p.distributor===u.co).length+")"])].map(([v,l]) =>
              <button key={v} onClick={() => setEd(p => ({...p, _pDist:v}))} style={{padding:"6px 14px",background:fDist===v?C.dk:"transparent",color:fDist===v?C.bg:C.gr,border:"1px solid "+(fDist===v?C.dk:C.ln),cursor:"pointer",fontSize:11,fontFamily:BD,fontWeight:600,borderRadius:20}}>{l}</button>)}
          </div>
          {list.length === 0 ? <div style={{textAlign:"center",padding:36,background:C.wh,border:"1px dashed "+C.ln,borderRadius:10,fontSize:12,fontFamily:BD,color:C.gr2}}>{t("sinProspectos")}</div> :
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:10}}>
            {list.map(p => { const st = stageOf(p.stage); return (
              <div key={p.id} style={{background:C.wh,border:"1px solid "+C.ln,borderLeft:"4px solid "+st[2],borderRadius:10,padding:"14px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                  <div style={{minWidth:0}}>
                    <div style={{fontSize:13,fontFamily:BD,fontWeight:700,color:C.dk}}>{p.name}</div>
                    <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:2}}>{[p.city,p.country].filter(Boolean).join(", ")||"—"} · <span style={{color:C.bl}}>{p.distributor}</span></div>
                  </div>
                  <Badge l={t(st[1])} c={st[2]} />
                </div>
                <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
                  {p.email && <a href={"mailto:"+p.email} style={{fontSize:10,fontFamily:BD,color:C.dk,background:C.bg,padding:"4px 10px",borderRadius:12,textDecoration:"none",border:"1px solid "+C.ln}}>✉ Email</a>}
                  {p.phone && <a href={"tel:"+p.phone} style={{fontSize:10,fontFamily:BD,color:C.dk,background:C.bg,padding:"4px 10px",borderRadius:12,textDecoration:"none",border:"1px solid "+C.ln}}>📞 {p.phone}</a>}
                  {p.web && <a href={p.web.startsWith("http")?p.web:"https://"+p.web} target="_blank" rel="noreferrer" style={{fontSize:10,fontFamily:BD,color:C.dk,background:C.bg,padding:"4px 10px",borderRadius:12,textDecoration:"none",border:"1px solid "+C.ln}}>🌐 Web</a>}
                  {p.instagram && <a href={"https://instagram.com/"+p.instagram.replace("@","")} target="_blank" rel="noreferrer" style={{fontSize:10,fontFamily:BD,color:C.dk,background:C.bg,padding:"4px 10px",borderRadius:12,textDecoration:"none",border:"1px solid "+C.ln}}>📷 {p.instagram}</a>}
                </div>
                {p.noteAdmin && <div style={{fontSize:10,fontFamily:BD,color:"#7a5c3a",background:"#e8d5c030",border:"1px solid #e8d5c0",borderRadius:6,padding:"6px 10px",marginTop:10,lineHeight:1.5}}>📝 {p.noteAdmin}</div>}
                {p.noteDist && <div style={{fontSize:10,fontFamily:BD,color:C.gr,background:C.bg,borderRadius:6,padding:"6px 10px",marginTop:6,lineHeight:1.5}}>💬 {p.distributor}: {p.noteDist}</div>}
                <div style={{display:"flex",gap:6,marginTop:10}}>
                  <button onClick={() => { setModal("newProspect"); setEd({...p, _editing:true, _pDist:fDist}); }} style={{flex:1,padding:"6px 0",background:"transparent",border:"1px solid "+C.ln,borderRadius:6,fontSize:10,fontFamily:BD,fontWeight:600,color:C.dk,cursor:"pointer"}}>{t("modifier")||"Editar"}</button>
                  <button onClick={() => askConfirm(t("confirmarEliminar"), () => { setProspects(x => x.filter(y => y.id !== p.id)); dbDeleteProspect(p.id); })} style={{padding:"6px 12px",background:"transparent",border:"1px solid "+C.rd+"50",borderRadius:6,fontSize:10,fontFamily:BD,color:C.rd,cursor:"pointer"}}>✕</button>
                </div>
              </div>); })}
          </div>}
        </Sec>;
      })()}

      {view === "d-prospectos" && (() => {
        const myProspects = prospects.filter(p => p.distributor === user.co);
        const fStage = ed._pStage || "all";
        const list = myProspects.filter(p => fStage === "all" || p.stage === fStage);
        const stageOf = s => PSTAGES.find(x => x[0] === s) || PSTAGES[0];
        return <Sec title={"🎯 " + t("prospectos")} sub={t("prospectosSub")} right={<Btn small onClick={() => { setModal("newProspect"); setEd({name:"",city:"",country:"",email:"",phone:"",web:"",instagram:"",noteDist:"",distributor:user.co,_byDist:true}); }}>{t("nuevoProspecto")}</Btn>}>
          <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
            {[["all",t("tous")+" ("+myProspects.length+")"], ...PSTAGES.map(([v,k,col]) => [v, t(k)+" ("+myProspects.filter(p => p.stage===v).length+")"])].map(([v,l]) =>
              <button key={v} onClick={() => setEd(p => ({...p, _pStage:v}))} style={{padding:"6px 14px",background:fStage===v?C.dk:"transparent",color:fStage===v?C.bg:C.gr,border:"1px solid "+(fStage===v?C.dk:C.ln),cursor:"pointer",fontSize:11,fontFamily:BD,fontWeight:600,borderRadius:20}}>{l}</button>)}
          </div>
          {list.length === 0 ? <div style={{textAlign:"center",padding:36,background:C.wh,border:"1px dashed "+C.ln,borderRadius:10,fontSize:12,fontFamily:BD,color:C.gr2}}>{t("sinProspectos")}</div> :
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
            {list.map(p => { const st = stageOf(p.stage); return (
              <div key={p.id} style={{background:C.wh,border:"1px solid "+C.ln,borderLeft:"4px solid "+st[2],borderRadius:10,padding:"14px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                  <div style={{minWidth:0}}>
                    <div style={{fontSize:13,fontFamily:BD,fontWeight:700,color:C.dk}}>{p.name}</div>
                    <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:2}}>{[p.city,p.country].filter(Boolean).join(", ")||"—"}</div>
                  </div>
                  <select value={p.stage} onChange={e => { const np = {...p, stage:e.target.value}; setProspects(x => x.map(y => y.id===p.id?np:y)); dbUpdateProspect(np); }} style={{padding:"4px 8px",border:"1.5px solid "+st[2],borderRadius:14,fontFamily:BD,fontSize:10,fontWeight:700,background:st[2]+"12",color:st[2],cursor:"pointer"}}>
                    {PSTAGES.map(([v,k]) => <option key={v} value={v}>{t(k)}</option>)}
                  </select>
                </div>
                <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
                  {p.email && <a href={"mailto:"+p.email} style={{fontSize:10,fontFamily:BD,color:C.dk,background:C.bg,padding:"4px 10px",borderRadius:12,textDecoration:"none",border:"1px solid "+C.ln}}>✉ Email</a>}
                  {p.phone && <a href={"tel:"+p.phone} style={{fontSize:10,fontFamily:BD,color:C.dk,background:C.bg,padding:"4px 10px",borderRadius:12,textDecoration:"none",border:"1px solid "+C.ln}}>📞 {p.phone}</a>}
                  {p.web && <a href={p.web.startsWith("http")?p.web:"https://"+p.web} target="_blank" rel="noreferrer" style={{fontSize:10,fontFamily:BD,color:C.dk,background:C.bg,padding:"4px 10px",borderRadius:12,textDecoration:"none",border:"1px solid "+C.ln}}>🌐 Web</a>}
                  {p.instagram && <a href={"https://instagram.com/"+p.instagram.replace("@","")} target="_blank" rel="noreferrer" style={{fontSize:10,fontFamily:BD,color:C.dk,background:C.bg,padding:"4px 10px",borderRadius:12,textDecoration:"none",border:"1px solid "+C.ln}}>📷 IG</a>}
                </div>
                {p.noteAdmin && <div style={{fontSize:10,fontFamily:BD,color:"#7a5c3a",background:"#e8d5c030",border:"1px solid #e8d5c0",borderRadius:6,padding:"6px 10px",marginTop:10,lineHeight:1.5}}>📝 {t("notaMinue")}: {p.noteAdmin}</div>}
                <div style={{marginTop:8}}>
                  <div style={{fontSize:9,fontFamily:BD,color:C.gr,marginBottom:3,fontWeight:600}}>{t("misNotas").toUpperCase()}</div>
                  <textarea defaultValue={p.noteDist} onBlur={e => { if(e.target.value !== p.noteDist){ const np = {...p, noteDist:e.target.value}; setProspects(x => x.map(y => y.id===p.id?np:y)); dbUpdateProspect(np); toast(t("borradorGuardado")||"Guardado"); } }} rows={2} style={{width:"100%",padding:8,border:"1px solid "+C.ln,borderRadius:6,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
                </div>
              </div>); })}
          </div>}
        </Sec>;
      })()}

      {view === "a-negocio" && (() => {
        // Compute derived metrics from orders
        const totalCost = (pid) => { const c = productCosts[pid]; if (!c) return 0; return (c.supplier||0)+(c.freight||0)+(c.customs||0)+(c.packaging||0); };
        const productsWithCost = products.filter(p => totalCost(p.id) > 0).length;
        const avgCost = productsWithCost > 0 ? products.reduce((s,p) => s + totalCost(p.id), 0) / productsWithCost : 0;

        // Auto-computed from orders
        const now = Date.now();
        const parseDate = (d) => { const parts = (d||"").split("/"); return parts.length===3 ? new Date(parts[2]+"-"+parts[1].padStart(2,"0")+"-"+parts[0].padStart(2,"0")).getTime() : 0; };
        const last30 = orders.filter(o => { const t = parseDate(o.date); return t && (now-t) < 30*86400000; });
        const monthlyVolume = last30.reduce((s,o) => s + (o.items||0), 0);
        const monthlyRevenue = last30.reduce((s,o) => s + (o.total||0), 0);
        // Channel mix
        const channelMix = {direct:0, faire:0, distributor:0};
        last30.forEach(o => { const d = (o.dist||"").toLowerCase(); if (d==="faire") channelMix.faire += o.items||0; else if (d==="direct"||d==="directo"||!d) channelMix.direct += o.items||0; else channelMix.distributor += o.items||0; });
        // Recompra
        const clientOrderCounts = {};
        orders.forEach(o => { clientOrderCounts[o.client] = (clientOrderCounts[o.client]||0)+1; });
        const repeaters = Object.values(clientOrderCounts).filter(c => c > 1).length;
        const oneShot = Object.values(clientOrderCounts).filter(c => c === 1).length;
        const totalClientsWithOrders = repeaters + oneShot;
        const repeatRate = totalClientsWithOrders > 0 ? (repeaters/totalClientsWithOrders*100) : 0;
        // Defect rate
        const totalDefectUnits = defectives.reduce((s,d) => s + (d.quantity||0), 0);
        const totalSoldUnits = orders.reduce((s,o) => s + (o.items||0), 0);
        const defectRate = totalSoldUnits > 0 ? (totalDefectUnits/totalSoldUnits*100) : 0;
        // Fixed costs monthly normalized
        const monthlyFixed = fixedCosts.reduce((s,fc) => s + (fc.frequency==="yearly" ? fc.amount/12 : fc.frequency==="quarterly" ? fc.amount/3 : fc.amount), 0);

        const tab = ed._negTab || "overview";
        const setTab = (t) => setEd(p => ({...p, _negTab:t}));

        return <>
        <Sec title={t("datosNegocio")} sub="Configura los costes y parámetros que alimentan el motor de decisiones">

          {/* TABS */}
          <div style={{display:"flex",gap:4,marginBottom:18,flexWrap:"wrap",borderBottom:"1px solid "+C.ln,paddingBottom:10}}>
            {[["overview","📊 Resumen"],["costs","🏷 Costes por producto"],["channels","🚚 Costes por canal"],["fixed","🏢 Costes fijos"],["auto","🤖 Datos automáticos"]].map(([v,l]) =>
              <button key={v} onClick={() => setTab(v)} style={{padding:"7px 14px",background:tab===v?C.dk:"transparent",color:tab===v?C.bg:C.gr,border:"1px solid "+(tab===v?C.dk:"transparent"),cursor:"pointer",fontSize:11,fontFamily:BD,fontWeight:600,borderRadius:20}}>{l}</button>
            )}
          </div>

          {/* OVERVIEW */}
          {tab === "overview" && <>
            <div style={{padding:"12px 16px",background:CL.gn+"08",border:"1px solid "+CL.gn+"25",borderRadius:8,marginBottom:16,fontSize:12,fontFamily:BD,color:C.dk,lineHeight:1.6}}>
              💡 Esta sección es la base del <strong>motor de decisiones</strong>. Cuanto más completa esté, mejores serán las recomendaciones. Lo que rellenas tú (costes) + lo que se calcula solo (volumen, recompra) = inteligencia real.
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10,marginBottom:18}}>
              {[
                ["Coste medio/gafa",avgCost>0?fmt(avgCost)+" €":"Sin datos",productsWithCost>0?productsWithCost+"/"+products.length+" productos":"Configura costes",avgCost>0?CL.gn:"#c47a00"],
                ["Volumen mensual",monthlyVolume+" uds",fmt(monthlyRevenue)+" € (30d)",C.bl],
                ["Tasa recompra",repeatRate.toFixed(0)+"%",repeaters+" repiten · "+oneShot+" una vez",repeatRate>40?CL.gn:"#c47a00"],
                ["Tasa defectos",defectRate.toFixed(1)+"%",totalDefectUnits+" uds reportadas",defectRate<3?CL.gn:C.rd],
                ["Costes fijos/mes",monthlyFixed>0?fmt(monthlyFixed)+" €":"Sin datos",fixedCosts.length+" partidas",monthlyFixed>0?C.dk:"#c47a00"]
              ].map(([label,val,sub,col],i) =>
                <div key={i} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"14px 16px"}}>
                  <div style={{fontSize:9,fontFamily:BD,color:C.gr2,letterSpacing:1,fontWeight:600,textTransform:"uppercase"}}>{label}</div>
                  <div style={{fontSize:22,fontFamily:DP,fontWeight:400,color:col,marginTop:6,lineHeight:1}}>{val}</div>
                  <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:4}}>{sub}</div>
                </div>
              )}
            </div>

            {/* COMPLETENESS CHECKLIST */}
            <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"16px 18px"}}>
              <div style={{fontSize:12,fontFamily:BD,fontWeight:700,color:C.dk,marginBottom:12}}>✅ Estado de configuración</div>
              {[
                ["Costes por producto",productsWithCost,products.length,"costs"],
                ["Costes por canal",Object.values(channelConfig).filter(c => c.avgShippingEU > 0 || c.commission > 0 || c.commissionNew > 0).length,3,"channels"],
                ["Costes fijos",fixedCosts.length > 0 ? 1 : 0,1,"fixed"]
              ].map(([label,done,total,goTab],i) => { const pct = total>0?(done/total*100):0; const complete = pct >= 100; return (
                <div key={i} onClick={() => setTab(goTab)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<2?"1px solid "+C.bg2:"none",cursor:"pointer"}}>
                  <div style={{width:24,height:24,borderRadius:12,background:complete?CL.gn:pct>0?"#f0a020":C.ln,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{complete?"✓":pct>0?"!":"·"}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontFamily:BD,fontWeight:600,color:C.dk}}>{label}</div>
                    <div style={{height:5,background:C.bg,borderRadius:3,marginTop:5,overflow:"hidden"}}><div style={{height:"100%",width:pct+"%",background:complete?CL.gn:"#f0a020",borderRadius:3}} /></div>
                  </div>
                  <span style={{fontSize:11,fontFamily:BD,color:C.gr,fontWeight:600}}>{typeof done==="number"&&total>1?done+"/"+total:complete?"OK":"Pendiente"}</span>
                  <span style={{fontSize:14,color:C.bl}}>→</span>
                </div>
              ); })}
            </div>
          </>}

          {/* PRODUCT COSTS */}
          {tab === "costs" && <>
            <div style={{padding:"12px 16px",background:C.bl+"08",border:"1px solid "+C.bl+"25",borderRadius:8,marginBottom:14,fontSize:11,fontFamily:BD,color:C.dk,lineHeight:1.6}}>
              🏷 Introduce el coste real de cada gafa: <strong>proveedor + flete + aduana + packaging</strong>. La plataforma calcula el coste total y, con tu precio de venta, el margen real. Puedes dejar en 0 lo que no apliques.
            </div>
            <input placeholder="🔍 Buscar modelo, color, SKU..." value={ed._costSearch||""} onChange={e => setEd(p => ({...p, _costSearch:e.target.value}))} style={{padding:"8px 14px",border:"1px solid "+C.ln,borderRadius:20,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,width:"min(260px,50vw)",marginBottom:14}} />
            <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,overflow:"hidden"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderBottom:"2px solid "+C.ln,background:C.bg,fontSize:9,fontFamily:BD,color:C.gr,fontWeight:700,letterSpacing:0.5,textTransform:"uppercase"}}>
                <span style={{flex:"1 1 140px",minWidth:100}}>Producto</span>
                <span style={{width:62,textAlign:"center"}}>Proveedor</span>
                <span style={{width:55,textAlign:"center"}}>Flete</span>
                <span style={{width:55,textAlign:"center"}}>Aduana</span>
                <span style={{width:62,textAlign:"center"}}>Packaging</span>
                <span style={{width:60,textAlign:"center"}}>Coste</span>
                <span style={{width:75,textAlign:"center"}}>Margen</span>
              </div>
              {products.filter(p => !ed._costSearch || p.model.toLowerCase().includes(ed._costSearch.toLowerCase()) || p.color.toLowerCase().includes(ed._costSearch.toLowerCase()) || (p.sku||"").toLowerCase().includes(ed._costSearch.toLowerCase())).map((p,i) => {
                const c = productCosts[p.id] || {supplier:0,freight:0,customs:0,packaging:0};
                const tot = (c.supplier||0)+(c.freight||0)+(c.customs||0)+(c.packaging||0);
                const sellPrice = p.col === "Acetato" ? (p.fixedPrice||0) : 22.90; // base wholesale ref
                const margin = sellPrice > 0 && tot > 0 ? ((sellPrice-tot)/sellPrice*100) : null;
                const upd = (field,val) => { const nc = {...c, [field]:parseFloat(val)||0}; setProductCosts(prev => ({...prev, [p.id]:nc})); };
                const save = () => dbSaveProductCost(p.id, productCosts[p.id]||c);
                return <div key={p.id} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderBottom:"1px solid "+C.bg2,background:i%2?C.bg:C.wh}}>
                  <div style={{flex:"1 1 140px",minWidth:100,display:"flex",alignItems:"center",gap:8}}>
                    {p.imageUrl && <div style={{width:28,height:28,borderRadius:3,overflow:"hidden",background:C.wh,border:"1px solid "+C.ln,flexShrink:0}}><img src={p.imageUrl} style={{width:"100%",height:"100%",objectFit:"contain"}} /></div>}
                    <div style={{minWidth:0}}><div style={{fontSize:11,fontFamily:BD,fontWeight:600,color:C.dk,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.model}</div><div style={{fontSize:9,fontFamily:BD,color:C.gr}}>{p.color}</div></div>
                  </div>
                  {["supplier","freight","customs","packaging"].map((f,fi) => <input key={f} type="number" step="0.01" value={c[f]||""} onChange={e => upd(f,e.target.value)} onBlur={save} placeholder="0" style={{width:fi===0||fi===3?62:55,padding:"5px 4px",border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,textAlign:"center",boxSizing:"border-box"}} />)}
                  <span style={{width:60,textAlign:"center",fontSize:12,fontFamily:DP,fontWeight:600,color:tot>0?C.dk:C.gr2}}>{tot>0?fmt(tot)+"€":"—"}</span>
                  <span style={{width:75,textAlign:"center",fontSize:11,fontFamily:BD,fontWeight:700,color:margin===null?C.gr2:margin>50?CL.gn:margin>30?"#c47a00":C.rd}}>{margin===null?"—":margin.toFixed(0)+"%"}</span>
                </div>;
              })}
            </div>
            <div style={{fontSize:10,fontFamily:BD,color:C.gr2,marginTop:8,lineHeight:1.5}}>💡 Margen calculado sobre precio wholesale base (22,90 € Essential/Icons · precio fijo Acetato). Se guarda automáticamente al salir de cada casilla.</div>
          </>}

          {/* CHANNEL COSTS */}
          {tab === "channels" && <>
            <div style={{padding:"12px 16px",background:"#8e44ad08",border:"1px solid #8e44ad25",borderRadius:8,marginBottom:14,fontSize:11,fontFamily:BD,color:C.dk,lineHeight:1.6}}>
              🚚 Define los costes de cada canal para calcular el <strong>margen NETO real</strong>. Aquí es donde se ve qué canal te deja más dinero de verdad después de comisiones y envíos.
            </div>
            {[
              ["direct","🌐 Venta Directa (plataforma B2B)",C.gn],
              ["faire","Faire","#000"],
              ["distributor","🤝 Distribuidores",C.bl]
            ].map(([key,label,col]) => { const cfg = channelConfig[key]||{}; const upd = (field,val) => { const nc = {...channelConfig, [key]:{...cfg, [field]:val}}; setChannelConfig(nc); dbSaveChannelConfig(nc); }; return (
              <div key={key} style={{background:C.wh,border:"1.5px solid "+col+"30",borderRadius:8,padding:"16px 18px",marginBottom:12}}>
                <div style={{fontSize:13,fontFamily:BD,fontWeight:700,color:col,marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
                  {key==="faire" && <span style={{width:18,height:18,borderRadius:9,background:"#000",color:"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700}}>F</span>}
                  {label}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:12}}>
                  {key==="faire" ? <>
                    <div><div style={{fontSize:9,fontFamily:BD,color:C.gr,marginBottom:3,fontWeight:600}}>COMISIÓN CLIENTE NUEVO (%)</div><input type="number" step="0.1" value={cfg.commissionNew||""} onChange={e => upd("commissionNew",parseFloat(e.target.value)||0)} placeholder="17" style={{width:"100%",padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
                    <div><div style={{fontSize:9,fontFamily:BD,color:C.gr,marginBottom:3,fontWeight:600}}>COMISIÓN RECURRENTE (%)</div><input type="number" step="0.1" value={cfg.commissionRecurring||""} onChange={e => upd("commissionRecurring",parseFloat(e.target.value)||0)} placeholder="10" style={{width:"100%",padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
                  </> : <div><div style={{fontSize:9,fontFamily:BD,color:C.gr,marginBottom:3,fontWeight:600}}>COMISIÓN (%)</div><input type="number" step="0.1" value={cfg.commission||""} onChange={e => upd("commission",parseFloat(e.target.value)||0)} placeholder={key==="distributor"?"15":"0"} style={{width:"100%",padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>}
                  <div>
                    <div style={{fontSize:9,fontFamily:BD,color:C.gr,marginBottom:3,fontWeight:600}}>QUIÉN PAGA ENVÍO</div>
                    <select value={cfg.whoPaysShipping||"minue"} onChange={e => upd("whoPaysShipping",e.target.value)} style={{width:"100%",padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                      <option value="minue">Minuë (coste mío)</option>
                      <option value="client">Cliente/Tienda</option>
                    </select>
                  </div>
                  <div><div style={{fontSize:9,fontFamily:BD,color:C.gr,marginBottom:3,fontWeight:600}}>ENVÍO MEDIO UE (€)</div><input type="number" step="0.01" value={cfg.avgShippingEU||""} onChange={e => upd("avgShippingEU",parseFloat(e.target.value)||0)} placeholder="0" style={{width:"100%",padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
                  <div><div style={{fontSize:9,fontFamily:BD,color:C.gr,marginBottom:3,fontWeight:600}}>ENVÍO MEDIO INTL (€)</div><input type="number" step="0.01" value={cfg.avgShippingIntl||""} onChange={e => upd("avgShippingIntl",parseFloat(e.target.value)||0)} placeholder="0" style={{width:"100%",padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
                </div>
              </div>
            ); })}
          </>}

          {/* FIXED COSTS */}
          {tab === "fixed" && <>
            <div style={{padding:"12px 16px",background:"#c47a0008",border:"1px solid #c47a0025",borderRadius:8,marginBottom:14,fontSize:11,fontFamily:BD,color:C.dk,lineHeight:1.6}}>
              🏢 Los costes fijos del negocio (alquiler, SaaS, gestoría, dominio, etc.). Sirven para calcular tu <strong>punto de equilibrio</strong> y el margen neto real. Esto enlazará con la futura app de finanzas.
            </div>
            <Btn small onClick={() => { setModal("newFixedCost"); setEd({name:"",category:"fijos",amount:0,frequency:"monthly"}); }} style={{marginBottom:14}}>+ Añadir coste fijo</Btn>
            {fixedCosts.length === 0 ? <div style={{textAlign:"center",padding:30,fontSize:12,fontFamily:BD,color:C.gr2,background:C.wh,border:"1px dashed "+C.ln,borderRadius:8}}>Aún no has añadido costes fijos.</div> :
            <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,overflow:"hidden"}}>
              {fixedCosts.map((fc,i) => { const monthly = fc.frequency==="yearly" ? fc.amount/12 : fc.frequency==="quarterly" ? fc.amount/3 : fc.amount; const catColors = {COGS:"#722f37",operacion:C.bl,tecnologia:"#8e44ad",marketing:"#c47a00",personal:CL.gn,fijos:C.dk,impuestos:C.rd,otros:C.gr2}; return (
                <div key={fc.id} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderBottom:i<fixedCosts.length-1?"1px solid "+C.bg2:"none",background:i%2?C.bg:C.wh}}>
                  <div style={{width:8,height:8,borderRadius:4,background:catColors[fc.category]||C.gr2,flexShrink:0}} />
                  <div style={{flex:1}}><div style={{fontSize:12,fontFamily:BD,fontWeight:600,color:C.dk}}>{fc.name}</div><div style={{fontSize:9,fontFamily:BD,color:C.gr,textTransform:"capitalize"}}>{fc.category} · {fc.frequency==="monthly"?"Mensual":fc.frequency==="quarterly"?"Trimestral":"Anual"}</div></div>
                  <div style={{textAlign:"right"}}><div style={{fontSize:13,fontFamily:DP,fontWeight:600,color:C.dk}}>{fmt(fc.amount)} €</div>{fc.frequency!=="monthly" && <div style={{fontSize:9,fontFamily:BD,color:C.gr}}>{fmt(monthly)} €/mes</div>}</div>
                  <button onClick={() => askConfirm("¿Eliminar este coste fijo?", () => { setFixedCosts(p => p.filter(x => x.id !== fc.id)); dbDeleteFixedCost(fc.id); })} style={{background:"none",border:"none",color:C.rd,cursor:"pointer",fontSize:16,padding:"0 4px"}}>×</button>
                </div>
              ); })}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",background:C.dk,color:C.bg}}>
                <span style={{fontSize:11,fontFamily:BD,fontWeight:600}}>TOTAL MENSUAL NORMALIZADO</span>
                <span style={{fontSize:16,fontFamily:DP,fontWeight:600}}>{fmt(monthlyFixed)} €</span>
              </div>
            </div>}
          </>}

          {/* AUTO DATA */}
          {tab === "auto" && <>
            <div style={{padding:"12px 16px",background:CL.gn+"08",border:"1px solid "+CL.gn+"25",borderRadius:8,marginBottom:16,fontSize:11,fontFamily:BD,color:C.dk,lineHeight:1.6}}>
              🤖 Estos datos se calculan <strong>automáticamente</strong> de tus pedidos. No tienes que rellenar nada — se actualizan solos con cada venta. El motor de decisiones los usa para detectar oportunidades.
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"16px 18px"}}>
                <div style={{fontSize:10,fontFamily:BD,color:C.gr2,letterSpacing:1,fontWeight:600,textTransform:"uppercase",marginBottom:10}}>📦 Mix de canal (30 días)</div>
                {[["Directo",channelMix.direct,C.gn],["Faire",channelMix.faire,"#000"],["Distribuidores",channelMix.distributor,C.bl]].map(([l,v,c]) => { const tot = channelMix.direct+channelMix.faire+channelMix.distributor; const pct = tot>0?(v/tot*100):0; return (
                  <div key={l} style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontFamily:BD,marginBottom:3}}><span style={{color:C.dk}}>{l}</span><span style={{color:c,fontWeight:700}}>{v} uds ({pct.toFixed(0)}%)</span></div><div style={{height:6,background:C.bg,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:pct+"%",background:c,borderRadius:3}} /></div></div>
                ); })}
              </div>
              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"16px 18px"}}>
                <div style={{fontSize:10,fontFamily:BD,color:C.gr2,letterSpacing:1,fontWeight:600,textTransform:"uppercase",marginBottom:10}}>🔄 Recompra</div>
                <div style={{fontSize:28,fontFamily:DP,fontWeight:400,color:repeatRate>40?CL.gn:"#c47a00",lineHeight:1}}>{repeatRate.toFixed(0)}%</div>
                <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginTop:6,lineHeight:1.6}}>{repeaters} clientes repiten<br/>{oneShot} compraron una sola vez</div>
                <div style={{fontSize:10,fontFamily:BD,color:repeatRate>40?CL.gn:"#c47a00",marginTop:8,padding:"6px 10px",background:(repeatRate>40?CL.gn:"#c47a00")+"12",borderRadius:4}}>{repeatRate>40?"✓ Buena retención":"⚠ Foco en retención: muchos one-shot"}</div>
              </div>
              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"16px 18px"}}>
                <div style={{fontSize:10,fontFamily:BD,color:C.gr2,letterSpacing:1,fontWeight:600,textTransform:"uppercase",marginBottom:10}}>⚠️ Tasa de defectos</div>
                <div style={{fontSize:28,fontFamily:DP,fontWeight:400,color:defectRate<3?CL.gn:C.rd,lineHeight:1}}>{defectRate.toFixed(1)}%</div>
                <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginTop:6,lineHeight:1.6}}>{totalDefectUnits} uds defectuosas<br/>de {totalSoldUnits} vendidas (histórico)</div>
              </div>
              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"16px 18px"}}>
                <div style={{fontSize:10,fontFamily:BD,color:C.gr2,letterSpacing:1,fontWeight:600,textTransform:"uppercase",marginBottom:10}}>📈 Volumen mensual</div>
                <div style={{fontSize:28,fontFamily:DP,fontWeight:400,color:C.dk,lineHeight:1}}>{monthlyVolume} <span style={{fontSize:14,color:C.gr}}>uds</span></div>
                <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginTop:6}}>{fmt(monthlyRevenue)} € en 30 días</div>
              </div>
            </div>
          </>}

        </Sec>
        </>;
      })()}

      {view === "a-users" && <Sec title={t("gestionUsers")} right={<Btn small onClick={() => { setModal("newUser"); setEd({role:"client",name:"",co:"",email:"",pw:"",lang:"fr",commRate:0,active:true}); }}>{t("nouvelUser")}</Btn>}>
        <div style={{display:"flex",gap:6,marginBottom:12}}>
          {[["all",t("tous")],["client",t("client")],["distributor",t("distributeur")],["pending",t("pendientes")]].map(([v,l]) => {
            const count = v === "pending" ? users.filter(u => u.role !== "admin" && u.active === false).length : v === "all" ? 0 : users.filter(u => u.role === v).length;
            return (
            <button key={v} onClick={() => setUserFilter(v)} style={{padding:"5px 14px",background:userFilter===v?C.dk:v==="pending"&&count>0?"#f39c1215":"transparent",color:userFilter===v?C.bg:v==="pending"&&count>0?"#f39c12":C.gr,border:"1px solid "+(userFilter===v?C.dk:v==="pending"&&count>0?"#f39c12":C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:500,borderRadius:20}}>{l} {(v!=="all"&&count>0) && <span style={{fontSize:9,color:userFilter===v?C.bg+"99":C.gr2}}>({count})</span>}</button>
            );
          })}
        </div>
        <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>
          {users.filter(u => u.role !== "admin" && (userFilter === "all" ? true : userFilter === "pending" ? u.active === false : u.role === userFilter)).map((u, i) => {
            const hasClientEntry = u.role === "client" && clients.find(c => c.companyEmail === u.email || c.name === u.co || c.contact === u.name);
            const clientEntry = hasClientEntry;
            return (
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderBottom:"1px solid "+C.bg2,cursor:"pointer",opacity:u.active===false?0.6:1,flexWrap:"wrap"}} onClick={() => { setModal("editUser"); setEd({...u, origEmail: u.email}); }}>
              <Badge l={u.role === "distributor" ? t("distributeur") : u.role === "team" ? t("employe") : t("client")} c={u.role === "distributor" ? C.bl : u.role === "team" ? "#a8c8e8" : C.gn} />
              <div style={{flex:1,minWidth:140}}>
                <div style={{display:"flex",alignItems:"baseline",gap:6,flexWrap:"wrap"}}>
                  <span style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>{u.name}</span>
                  <span style={{fontSize:11,fontFamily:BD,color:C.gr}}>{u.co}</span>
                </div>
                <div style={{fontSize:10,fontFamily:BD,color:C.gr2,marginTop:1}}>
                  {u.email}{u.city ? " · "+u.city : ""}{u.country ? " ("+u.country+")" : ""}{u.phone ? " · "+u.phone : ""}
                </div>
              </div>
              {u.notes && <span style={{fontSize:9,fontFamily:BD,color:C.bl,background:C.bl+"15",padding:"2px 6px",borderRadius:10}}>📝</span>}
              {u.commRate > 0 && <span style={{fontSize:10,fontFamily:BD,color:C.yl}}>{u.commRate}%</span>}
              {u.role === "client" && (clientEntry ? <button onClick={(e) => { e.stopPropagation(); setModal("editClient"); setEd({...clientEntry, _tab:"resume"}); }} style={{padding:"4px 10px",background:C.gn+"15",color:C.gn,border:"1px solid "+C.gn+"30",borderRadius:4,fontSize:10,fontFamily:BD,fontWeight:600,cursor:"pointer"}}>👤 Ver perfil</button>
                : <button onClick={async (e) => {
                  e.stopPropagation();
                  const tempId = Date.now();
                  const newClient = {id:tempId, name:u.co, contact:u.name, city:u.city||"", country:u.country||"FR", channel:u.channel||"Direct", customPrice:0, priceEssential:0, priceIcons:0, priceAcetato:0, earlyPay:false, status:"prospect", notes:u.notes||"", orders:0, total:0, phone:u.phone||"", companyEmail:u.email};
                  setClients(p => [...p, newClient]);
                  let realId = tempId;
                  if(dbReady) {
                    try {
                      const {data, error} = await supabase.from("clients").insert({name:newClient.name, contact:newClient.contact, city:newClient.city, country:newClient.country, channel:newClient.channel, status:"prospect", phone:newClient.phone, company_email:newClient.companyEmail}).select().single();
                      if (error) console.log("Client insert error:", error);
                      if (data?.id) { realId = data.id; setClients(p => p.map(c => c.id === tempId ? {...c, id: data.id} : c)); }
                    } catch(e){ console.log("DB error:", e); }
                  }
                  setTimeout(() => { setModal("editClient"); setEd({...newClient, id:realId, _tab:"resume"}); }, 100);
                }} style={{padding:"4px 10px",background:"#f0a02015",color:"#c47a00",border:"1px solid #f0a02030",borderRadius:4,fontSize:10,fontFamily:BD,fontWeight:600,cursor:"pointer"}}>+ Crear cliente</button>)}
              <Badge l={u.active !== false ? t("userActif") : t("userInactif")} c={u.active !== false ? C.gn : C.rd} />
            </div>
          );})}
        </div>
        <div style={{marginTop:16,padding:"14px 16px",background:C.wh,border:"1px solid "+C.ln,borderRadius:6}}>
          <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginBottom:8,fontWeight:500}}>Admin</div>
          {users.filter(u => u.role === "admin").map((u, i) => (
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0"}}>
              <Badge l="Admin" c={C.dk} />
              <span style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>{u.name}</span>
              <span style={{fontSize:11,fontFamily:BD,color:C.gr2}}>{u.email}</span>
            </div>
          ))}
        </div>
      </Sec>}

      {/* TEAM DASHBOARD */}
      {view === "e-dash" && <>
        {/* HEADER */}
        <div style={{padding:"min(28px, 5vw) min(20px, 4vw) min(20px, 4vw)",background:"linear-gradient(135deg,"+CL.dk+","+CL.dk+"dd)",color:CL.bg}}>
          <div style={{fontSize:"min(24px, 5.5vw)",fontFamily:DP,fontWeight:400,marginBottom:4}}>Hola, {user.name} ✦</div>
          <div style={{fontSize:11,fontFamily:BD,opacity:0.7}}>{new Date().toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long"})}  ·  {t("employe")} Minuë</div>
        </div>

        <div style={{padding:"20px min(20px, 4vw)"}}>
          {/* MI DÍA - panel operativo */}
          {(() => {
            const ordToPrep = orders.filter(o => o.status === "confirmed");
            const ordToShip = orders.filter(o => o.status === "preparing");
            const myTasks = tasks.filter(tk => tk.status !== "fait" && (tk.assignee === user.name || tk.assignee === user.email));
            const unreadMsgs = conversations.filter(c => c.status === "open" && c.messages.some(m => (m.fromRole !== "admin" && m.fromRole !== "team") && !m.read));
            const stockOut = products.filter(p => p.stock === 0);
            const myLeads = tasks.filter(tk => tk.area === "commercial" && tk.status !== "fait" && (tk.assignee === user.name || tk.assignee === user.email));

            return <div style={{background:"linear-gradient(135deg,#fff8e6,#fff)",border:"2px solid #f0a020"+"30",borderRadius:12,padding:"18px 20px",marginBottom:20}}>
              <div style={{fontSize:16,fontFamily:DP,color:C.dk,fontWeight:600,marginBottom:14}}>📋 Mi día de hoy</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10}}>
                <div onClick={() => { setOrdSubTab("prep"); setView("a-ord"); }} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
                  <div style={{fontSize:26}}>📦</div>
                  <div>
                    <div style={{fontSize:20,fontFamily:DP,fontWeight:600,color:ordToPrep.length>0?C.yl:C.gn,lineHeight:1}}>{ordToPrep.length}</div>
                    <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:3,fontWeight:600}}>A preparar</div>
                  </div>
                </div>
                <div onClick={() => { setOrdSubTab("prep"); setView("a-ord"); }} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
                  <div style={{fontSize:26}}>🚚</div>
                  <div>
                    <div style={{fontSize:20,fontFamily:DP,fontWeight:600,color:ordToShip.length>0?C.bl:C.gn,lineHeight:1}}>{ordToShip.length}</div>
                    <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:3,fontWeight:600}}>A enviar</div>
                  </div>
                </div>
                <div onClick={() => setView("a-tasks")} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
                  <div style={{fontSize:26}}>✅</div>
                  <div>
                    <div style={{fontSize:20,fontFamily:DP,fontWeight:600,color:myTasks.length>0?C.bl:C.gn,lineHeight:1}}>{myTasks.length}</div>
                    <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:3,fontWeight:600}}>Mis tareas</div>
                  </div>
                </div>
                <div onClick={() => setView("a-msg")} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
                  <div style={{fontSize:26}}>💬</div>
                  <div>
                    <div style={{fontSize:20,fontFamily:DP,fontWeight:600,color:unreadMsgs.length>0?"#e74c3c":C.gn,lineHeight:1}}>{unreadMsgs.length}</div>
                    <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:3,fontWeight:600}}>Mensajes sin leer</div>
                  </div>
                </div>
                <div onClick={() => setView("e-comercial")} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
                  <div style={{fontSize:26}}>🤝</div>
                  <div>
                    <div style={{fontSize:20,fontFamily:DP,fontWeight:600,color:myLeads.length>0?"#8e44ad":C.gn,lineHeight:1}}>{myLeads.length}</div>
                    <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:3,fontWeight:600}}>Mis leads</div>
                  </div>
                </div>
                <div onClick={() => setView("a-stock")} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
                  <div style={{fontSize:26}}>⚠️</div>
                  <div>
                    <div style={{fontSize:20,fontFamily:DP,fontWeight:600,color:stockOut.length>0?C.rd:C.gn,lineHeight:1}}>{stockOut.length}</div>
                    <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:3,fontWeight:600}}>Sin stock</div>
                  </div>
                </div>
              </div>
              <div style={{display:"flex",gap:6,marginTop:14,flexWrap:"wrap"}}>
                <button onClick={() => setView("e-fichaje")} style={{padding:"8px 14px",background:C.dk,color:C.bg,border:"none",borderRadius:5,fontSize:11,fontFamily:BD,fontWeight:600,cursor:"pointer"}}>⏱ Fichar</button>
                <button onClick={() => { setModal("newOrd"); setEd({client:"",dist:"Direct",lines:[]}); }} style={{padding:"8px 14px",background:"transparent",color:C.dk,border:"1px solid "+C.dk,borderRadius:5,fontSize:11,fontFamily:BD,fontWeight:600,cursor:"pointer"}}>+ Crear pedido</button>
                <button onClick={() => { setModal("importFaire"); setEd({faireRef:"",client:"",faireDate:new Date().toISOString().split("T")[0],lines:[],faireCommission:17,subtotal:0}); }} style={{padding:"8px 14px",background:"transparent",color:"#000",border:"1px solid #000",borderRadius:5,fontSize:11,fontFamily:BD,fontWeight:600,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6}}><span style={{width:16,height:16,borderRadius:8,background:"#000",color:"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,fontFamily:BD}}>F</span> Importar Faire</button>
              </div>
            </div>;
          })()}

          {/* PEDIDOS A PREPARAR */}
          {orders.filter(o => o.status === "confirmed").length > 0 && <div style={{marginBottom:18}}>
            <div style={{fontSize:13,fontFamily:BD,fontWeight:700,color:C.dk,marginBottom:10}}>📦 Pedidos a preparar HOY ({orders.filter(o => o.status === "confirmed").length})</div>
            <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,overflow:"hidden"}}>
              {orders.filter(o => o.status === "confirmed").slice(0,5).map((o,i) => (
                <div key={i} onClick={() => { setModal("editOrd"); setEd({...o, idx:orders.indexOf(o)}); }} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderBottom:i<4?"1px solid "+C.bg2:"none",cursor:"pointer",flexWrap:"wrap"}}>
                  <span style={{fontSize:12,fontFamily:DP,color:C.dk,fontWeight:600}}>{o.id}</span>
                  <span style={{fontSize:11,fontFamily:BD,color:C.gr,flex:1}}>{o.client}</span>
                  <span style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600}}>{o.items} uds</span>
                  <span style={{fontSize:11,fontFamily:BD,color:C.dk}}>{fmt(o.total)} €</span>
                  <button onClick={(e) => { e.stopPropagation(); setOrders(p => p.map(x => x.id === o.id ? {...x, status:"preparing"} : x)); logOrderChange(o.id, "Estado: confirmed → preparing", "Pasado a preparación"); }} style={{padding:"5px 10px",background:C.yl,color:"#fff",border:"none",borderRadius:4,fontSize:10,fontFamily:BD,fontWeight:600,cursor:"pointer"}}>→ Preparar</button>
                </div>
              ))}
            </div>
            {orders.filter(o => o.status === "confirmed").length > 5 && <button onClick={() => { setOrdSubTab("prep"); setView("a-ord"); }} style={{marginTop:6,padding:"7px 12px",background:"transparent",color:C.gr,border:"1px solid "+C.ln,borderRadius:4,fontSize:10,fontFamily:BD,cursor:"pointer"}}>Ver todos →</button>}
          </div>}

          {/* PEDIDOS A ENVIAR */}
          {orders.filter(o => o.status === "preparing").length > 0 && <div style={{marginBottom:18}}>
            <div style={{fontSize:13,fontFamily:BD,fontWeight:700,color:C.dk,marginBottom:10}}>🚚 Pedidos a enviar HOY ({orders.filter(o => o.status === "preparing").length})</div>
            <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,overflow:"hidden"}}>
              {orders.filter(o => o.status === "preparing").slice(0,5).map((o,i) => (
                <div key={i} onClick={() => { setModal("editOrd"); setEd({...o, idx:orders.indexOf(o)}); }} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderBottom:i<4?"1px solid "+C.bg2:"none",cursor:"pointer",flexWrap:"wrap"}}>
                  <span style={{fontSize:12,fontFamily:DP,color:C.dk,fontWeight:600}}>{o.id}</span>
                  <span style={{fontSize:11,fontFamily:BD,color:C.gr,flex:1}}>{o.client}</span>
                  <span style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600}}>{o.items} uds</span>
                  <span style={{fontSize:11,fontFamily:BD,color:C.dk}}>{fmt(o.total)} €</span>
                  <button onClick={(e) => { e.stopPropagation(); setOrders(p => p.map(x => x.id === o.id ? {...x, status:"shipped"} : x)); logOrderChange(o.id, "Estado: preparing → shipped", "Marcado como enviado"); }} style={{padding:"5px 10px",background:C.bl,color:"#fff",border:"none",borderRadius:4,fontSize:10,fontFamily:BD,fontWeight:600,cursor:"pointer"}}>→ Enviar</button>
                </div>
              ))}
            </div>
          </div>}

          {/* MIS TAREAS */}
          {(() => { const my = tasks.filter(tk => tk.status !== "fait" && (tk.assignee === user.name || tk.assignee === user.email)); return my.length > 0 ? <div style={{marginBottom:18}}>
            <div style={{fontSize:13,fontFamily:BD,fontWeight:700,color:C.dk,marginBottom:10}}>✅ Mis tareas pendientes ({my.length})</div>
            <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,overflow:"hidden"}}>
              {my.slice(0,5).map((tk,i) => (
                <div key={i} onClick={() => { setModal("editTask"); setEd({...tk}); }} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderBottom:i<4?"1px solid "+C.bg2:"none",cursor:"pointer"}}>
                  <span style={{width:8,height:8,borderRadius:4,background:tk.priority==="haute"?C.rd:tk.priority==="moyenne"?C.yl:C.gr,flexShrink:0}} />
                  <span style={{fontSize:12,fontFamily:BD,fontWeight:600,color:C.dk,flex:1}}>{tk.title}</span>
                  <Badge l={tk.area==="commercial"?"Comercial":tk.area==="defectos"?"Defectos":tk.area==="proveedor"?"Proveedor":tk.area} c={tk.area==="commercial"?"#8e44ad":tk.area==="defectos"?C.rd:tk.area==="proveedor"?C.yl:C.bl} />
                </div>
              ))}
            </div>
          </div> : null; })()}

          {/* STOCK ALERTS */}
          {products.filter(p => p.stock < 5).length > 0 && <div style={{marginBottom:18}}>
            <div style={{fontSize:13,fontFamily:BD,fontWeight:700,color:C.dk,marginBottom:10}}>⚠️ Stock crítico ({products.filter(p => p.stock < 5).length})</div>
            <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,overflow:"hidden"}}>
              {products.filter(p => p.stock < 5).slice(0,5).map((p,i) => (
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderBottom:i<4?"1px solid "+C.bg2:"none"}}>
                  <span style={{width:8,height:8,borderRadius:4,background:p.stock===0?C.rd:C.yl,flexShrink:0}} />
                  <span style={{fontSize:12,fontFamily:BD,fontWeight:600,color:C.dk,flex:1}}>{p.model} · {p.color}</span>
                  <span style={{fontSize:10,fontFamily:BD,color:C.gr2}}>{p.col}</span>
                  <span style={{fontSize:12,fontFamily:BD,fontWeight:700,color:p.stock===0?C.rd:C.yl,minWidth:24,textAlign:"right"}}>{p.stock}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setView("a-stock")} style={{marginTop:6,padding:"7px 12px",background:"transparent",color:C.gr,border:"1px solid "+C.ln,borderRadius:4,fontSize:10,fontFamily:BD,cursor:"pointer"}}>Ver stock →</button>
          </div>}
        </div>
      </>}

      {/* OLD e-dash (replaced) */}
      {false && view === "e-dash-OLD" && <>
        <div style={{padding:"min(24px, 4vw) min(16px, 3vw) 0"}}>
          <div style={{fontSize:"min(22px, 5vw)",fontFamily:DP,fontWeight:400,marginBottom:4,color:C.dk}}>{t("bienvenida")}, {user.name} ✦</div>
          <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginBottom:16}}>{t("employe")} Minuë</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:8,marginBottom:20}}>
            {renderKPI(t("aExpedier"), String(orders.filter(o => o.status === "confirmed" || o.status === "preparing").length), C.yl, () => { setOrdSubTab("prep"); setView("a-ord"); })}
            {renderKPI(t("misTareas"), String(tasks.filter(tk => tk.status !== "fait" && (tk.assignee === user.name || tk.assignee === user.email)).length), C.bl, () => setView("a-tasks"))}
            {renderKPI(t("leads"), String(tasks.filter(tk => tk.area === "commercial" && tk.status !== "fait").length), "#8e44ad", () => setView("e-comercial"))}
            {renderKPI(t("defectuosos"), String(defectives.filter(d => d.status !== "resolved").length), C.rd, () => setView("e-almacen"))}
            {renderKPI(t("sinStock"), String(products.filter(p => p.stock === 0).length), C.rd, () => setView("a-stock"))}
          </div>
        </div>

        {/* PEDIDOS POR ENVIAR */}
        {orders.filter(o => o.status === "confirmed" || o.status === "preparing").length > 0 && <Sec title={t("aExpedier")+" ("+orders.filter(o => o.status === "confirmed" || o.status === "preparing").length+")"}>
          <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>
            {orders.filter(o => o.status === "confirmed" || o.status === "preparing").slice(0,5).map((o,i) => renderOrderRow(o, i, false, true))}
          </div>
          <Btn ghost onClick={() => { setOrdSubTab("prep"); setView("a-ord"); }} style={{marginTop:8,width:"100%"}}>{t("preparacion")} →</Btn>
        </Sec>}

        {/* MIS TAREAS */}
        {(() => { const my = tasks.filter(tk => tk.status !== "fait" && (tk.assignee === user.name || tk.assignee === user.email)); return my.length > 0 ? <Sec title={t("misTareas")+" ("+my.length+")"}>
          {my.slice(0,5).map((tk,i) => (
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:C.wh,border:"1px solid "+C.ln,borderRadius:6,marginBottom:6,cursor:"pointer"}} onClick={() => { setModal("editTask"); setEd({...tk}); }}>
              <span style={{width:8,height:8,borderRadius:4,background:tk.priority==="haute"?C.rd:tk.priority==="moyenne"?C.yl:C.gr,flexShrink:0}} />
              <span style={{fontSize:12,fontFamily:BD,fontWeight:600,color:C.dk,flex:1}}>{tk.title}</span>
              <Badge l={tk.area==="commercial"?t("commercial"):tk.area==="defectos"?t("defectuosos"):tk.area==="proveedor"?t("proveedor"):t(tk.area)} c={tk.area==="commercial"?"#8e44ad":tk.area==="defectos"?C.rd:tk.area==="proveedor"?C.yl:C.bl} />
            </div>
          ))}
        </Sec> : null; })()}

        {/* REPORTE STOCK */}
        <Sec title={t("reporteStock")}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
            <div style={{background:C.gn+"10",border:"1px solid "+C.gn+"30",borderRadius:8,padding:"10px",textAlign:"center"}}>
              <div style={{fontSize:18,fontFamily:BD,fontWeight:700,color:C.gn}}>{products.filter(p => p.stock >= 10).length}</div>
              <div style={{fontSize:9,fontFamily:BD,color:C.gr}}>{t("enStock")}</div>
            </div>
            <div style={{background:C.yl+"10",border:"1px solid "+C.yl+"30",borderRadius:8,padding:"10px",textAlign:"center"}}>
              <div style={{fontSize:18,fontFamily:BD,fontWeight:700,color:C.yl}}>{products.filter(p => p.stock > 0 && p.stock < 10).length}</div>
              <div style={{fontSize:9,fontFamily:BD,color:C.gr}}>{t("stockAlerta")}</div>
            </div>
            <div style={{background:C.rd+"10",border:"1px solid "+C.rd+"30",borderRadius:8,padding:"10px",textAlign:"center"}}>
              <div style={{fontSize:18,fontFamily:BD,fontWeight:700,color:C.rd}}>{products.filter(p => p.stock === 0).length}</div>
              <div style={{fontSize:9,fontFamily:BD,color:C.gr}}>{t("sinStock")}</div>
            </div>
          </div>
          {products.filter(p => p.stock < 5).length > 0 && <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>
            {products.filter(p => p.stock < 5).slice(0,8).map((p,i) => (
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",borderBottom:"1px solid "+C.bg2,fontSize:12,fontFamily:BD}}>
                <span style={{width:8,height:8,borderRadius:4,background:p.stock===0?C.rd:C.yl,flexShrink:0}} />
                <span style={{fontWeight:600,color:C.dk,flex:1}}>{p.model} {p.color}</span>
                <span style={{fontSize:10,color:C.gr}}>{p.col}</span>
                <span style={{fontWeight:700,color:p.stock===0?C.rd:C.yl}}>{p.stock}</span>
              </div>
            ))}
          </div>}
        </Sec>

        {/* RESUMEN LOGISTICA */}
        <Sec title={t("logistica")}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"14px",cursor:"pointer"}} onClick={() => setView("e-logistica")}>
              <div style={{fontSize:16,fontFamily:BD,fontWeight:700,color:C.yl}}>{orders.filter(o => o.status === "confirmed" || o.status === "preparing").length}</div>
              <div style={{fontSize:10,fontFamily:BD,color:C.gr}}>{t("aExpedier")}</div>
            </div>
            <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"14px",cursor:"pointer"}} onClick={() => setView("e-logistica")}>
              <div style={{fontSize:16,fontFamily:BD,fontWeight:700,color:C.bl}}>{tasks.filter(tk => tk.area === "proveedor" && tk.status !== "fait").length}</div>
              <div style={{fontSize:10,fontFamily:BD,color:C.gr}}>{t("mercanciaPendiente")}</div>
            </div>
          </div>
        </Sec>
      </>}

      {/* ═══ ALMACÉN (admin + team) ═══ */}
      {(view === "a-almacen" || view === "e-almacen") && <>
        <Sec title={t("almacen")} sub={t("almacenSub")}>
          {/* PACKAGING INVENTORY */}
          <div style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:8}}>{t("packagingInventario")}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8,marginBottom:14}}>
            {[["fundas",t("fundasStock"),"🕶"],["gamuzas",t("gamuzasStock"),"🧤"],["cajasEnvio",t("cajasEnvio"),"📦"],["cajitasGafa",t("cajitasGafa"),"🎁"],["tarjetasTecnicas",t("tarjetasTecnicas"),"📋"],["expositores",t("expositor"),"🗄"]].map(([k,label,icon]) => (
              <div key={k} style={{background:C.wh,border:"1px solid "+(packStock[k]<20?C.rd+"50":packStock[k]<50?C.yl+"50":C.ln),borderRadius:8,padding:"14px",textAlign:"center"}}>
                <div style={{fontSize:18,marginBottom:4}}>{icon}</div>
                <div style={{fontSize:22,fontFamily:BD,fontWeight:700,color:packStock[k]<20?C.rd:packStock[k]<50?C.yl:C.gn}}>{packStock[k]}</div>
                <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:2}}>{label}</div>
                <div style={{display:"flex",gap:4,marginTop:8,justifyContent:"center"}}>
                  <button onClick={() => { const nq = Math.max(0,packStock[k]-1); dbUpdatePackInv(k, nq, "-1"); }} style={{width:26,height:26,background:C.bg,border:"1px solid "+C.ln,borderRadius:3,cursor:"pointer",fontSize:13,color:C.dk}}>-</button>
                  <input type="number" value={packStock[k]} onChange={e => { const nq = parseInt(e.target.value)||0; dbUpdatePackInv(k, nq, "Manual"); }} style={{width:44,textAlign:"center",border:"1px solid "+C.ln,borderRadius:3,fontSize:12,fontFamily:BD,fontWeight:600,color:C.dk,background:C.bg}} />
                  <button onClick={() => { const nq = packStock[k]+1; dbUpdatePackInv(k, nq, "+1"); }} style={{width:26,height:26,background:C.bg,border:"1px solid "+C.ln,borderRadius:3,cursor:"pointer",fontSize:13,color:C.dk}}>+</button>
                </div>
              </div>
            ))}
          </div>

          {/* FUNDAS POR COLOR */}
          <div style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:8}}>🎨 Fundas por color</div>
          <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:8}}>Disponibilidad de fundas de color para los pedidos de clientes</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8,marginBottom:20}}>
            {[["fundaCrema","Crema","#f0e8d9"],["fundaPistacho","Pistacho","#a8c89a"],["fundaBabyBlue","Baby Blue","#a8c8d4"],["fundaYellowAmalfi","Amalfi","#f0d878"],["fundaNaranja","Naranja","#e89858"]].map(([k,label,color]) => (
              <div key={k} style={{background:C.wh,border:"1px solid "+(packStock[k]<10?C.rd+"50":packStock[k]<20?C.yl+"50":C.ln),borderRadius:8,padding:"14px",textAlign:"center"}}>
                <div style={{width:36,height:36,borderRadius:18,background:color,border:"2px solid "+C.ln,margin:"0 auto 8px"}}></div>
                <div style={{fontSize:22,fontFamily:BD,fontWeight:700,color:packStock[k]<10?C.rd:packStock[k]<20?C.yl:C.gn}}>{packStock[k]||0}</div>
                <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:2}}>{label}</div>
                <div style={{display:"flex",gap:4,marginTop:8,justifyContent:"center"}}>
                  <button onClick={() => { const nq = Math.max(0,(packStock[k]||0)-1); dbUpdatePackInv(k, nq, "-1"); }} style={{width:26,height:26,background:C.bg,border:"1px solid "+C.ln,borderRadius:3,cursor:"pointer",fontSize:13,color:C.dk}}>-</button>
                  <input type="number" value={packStock[k]||0} onChange={e => { const nq = parseInt(e.target.value)||0; dbUpdatePackInv(k, nq, "Manual"); }} style={{width:44,textAlign:"center",border:"1px solid "+C.ln,borderRadius:3,fontSize:12,fontFamily:BD,fontWeight:600,color:C.dk,background:C.bg}} />
                  <button onClick={() => { const nq = (packStock[k]||0)+1; dbUpdatePackInv(k, nq, "+1"); }} style={{width:26,height:26,background:C.bg,border:"1px solid "+C.ln,borderRadius:3,cursor:"pointer",fontSize:13,color:C.dk}}>+</button>
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* PRODUCTOS DEFECTUOSOS */}
        <Sec title={t("defectuosos")+" ("+defectives.filter(d => d.status !== "resolved").length+")"} sub={t("defectuososSub")} right={<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{defectives.filter(d => d.status !== "resolved").length > 0 && <>
          <Btn small ghost onClick={() => {
            const pending = defectives.filter(d => d.status !== "resolved");
            const grouped = {};
            pending.forEach(d => {
              const key = d.model+"|"+d.color;
              if (!grouped[key]) grouped[key] = {model:d.model, color:d.color, sku:d.sku, total:0, items:[]};
              grouped[key].total += d.quantity;
              grouped[key].items.push(d);
            });
            const entries = Object.values(grouped).sort((a,b) => b.total - a.total);
            const totalUnits = entries.reduce((s,e) => s+e.total, 0);
            const reportNum = "DEF-"+new Date().getFullYear()+"-"+String(Math.floor(Math.random()*9999)).padStart(4,"0");
            const today = new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"});
            const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${reportNum} — Defective Products Report — Minuë Opticians</title><style>
              @page { margin: 1.8cm; size: A4; }
              body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #18332f; line-height: 1.5; padding: 0; }
              .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #18332f; padding-bottom: 18px; margin-bottom: 28px; }
              .brand { font-family: Georgia, serif; font-size: 32px; font-weight: 400; letter-spacing: 1px; color: #18332f; margin-bottom: 2px; }
              .brand-sub { font-size: 10px; color: #888; letter-spacing: 3px; text-transform: uppercase; }
              .doc-title { text-align: right; }
              .doc-num { font-size: 22px; font-family: Georgia, serif; color: #18332f; font-weight: 400; }
              .doc-date { font-size: 11px; color: #888; margin-top: 4px; }
              .badge { display: inline-block; padding: 4px 12px; border-radius: 3px; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; font-weight: 600; margin-top: 8px; background: #e74c3c; color: white; }
              h1 { font-family: Georgia, serif; font-size: 22px; font-weight: 400; color: #18332f; margin: 24px 0 6px; }
              .intro { background: #fafafa; border-left: 3px solid #18332f; padding: 14px 18px; margin-bottom: 24px; font-size: 12px; line-height: 1.7; color: #444; }
              .summary { display: flex; gap: 12px; margin-bottom: 24px; }
              .summary-card { flex: 1; background: #f8efe6; padding: 14px 16px; border-radius: 8px; text-align: center; }
              .summary-num { font-size: 28px; font-family: Georgia, serif; font-weight: 400; color: #18332f; line-height: 1; }
              .summary-label { font-size: 9px; color: #888; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 4px; }
              table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px; }
              th { background: #18332f; color: #f8efe6; padding: 11px 12px; text-align: left; font-weight: 500; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; }
              th.center, td.center { text-align: center; }
              td { padding: 10px 12px; border-bottom: 1px solid #eee; vertical-align: top; }
              tr.group-header td { background: #f8efe6; font-weight: 600; padding: 12px 14px; }
              tr.group-header .model { font-size: 13px; color: #18332f; }
              tr.group-header .sku { font-size: 9px; color: #888; font-weight: 400; }
              tr.group-header .units { float: right; background: #e74c3c; color: white; padding: 3px 10px; border-radius: 10px; font-size: 10px; font-weight: 600; }
              .detail { font-size: 10px; color: #666; padding-left: 14px; }
              .footer { margin-top: 40px; padding-top: 18px; border-top: 1px solid #ddd; font-size: 9px; color: #888; line-height: 1.8; }
              .request { background: #fff8e6; border: 1px solid #f0a020; padding: 14px 16px; border-radius: 6px; margin-top: 20px; font-size: 11px; line-height: 1.7; }
              .request strong { color: #c4502a; }
              @media print { .no-print { display: none; } }
            </style></head><body>
              <div class="header">
                <div>
                  <img src="https://cdn.shopify.com/s/files/1/0052/2797/0629/files/LOGO_VERDE_MINUE.png?v=1613555706" alt="Minuë" style="height:50px;width:auto;display:block;margin-bottom:4px" />
                  <div class="brand-sub">Opticians · Wholesale Eyewear</div>
                </div>
                <div class="doc-title">
                  <div class="doc-num">${reportNum}</div>
                  <div class="doc-date">${today}</div>
                  <div class="badge">DEFECTIVE PRODUCTS</div>
                </div>
              </div>

              <h1>Defective Products Report</h1>
              <div class="intro">
                <strong>To: Supplier</strong><br>
                This report contains all defective items detected at our warehouse since the last quality review. We kindly request your assistance in addressing the issues described below.
              </div>

              <div class="summary">
                <div class="summary-card">
                  <div class="summary-num">${entries.length}</div>
                  <div class="summary-label">Distinct Models</div>
                </div>
                <div class="summary-card">
                  <div class="summary-num">${totalUnits}</div>
                  <div class="summary-label">Total Defective Units</div>
                </div>
                <div class="summary-card">
                  <div class="summary-num">${pending.length}</div>
                  <div class="summary-label">Defect Reports</div>
                </div>
              </div>

              <table>
                <thead><tr><th>Product Detail</th><th class="center">Qty</th><th>Date Reported</th></tr></thead>
                <tbody>
                  ${entries.map(g => {
                    let rows = `<tr class="group-header"><td colspan="3"><span class="units">${g.total} units</span><span class="model">${g.model} — ${g.color}</span><br><span class="sku">SKU: ${g.sku || "—"}</span></td></tr>`;
                    g.items.forEach(d => {
                      const desc = d.description || "(No description provided)";
                      const date = d.created_at ? new Date(d.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}) : "—";
                      rows += `<tr><td class="detail">${desc}</td><td class="center">${d.quantity}</td><td>${date}</td></tr>`;
                    });
                    return rows;
                  }).join("")}
                </tbody>
              </table>

              <div class="request">
                <strong>Action Requested:</strong><br>
                Please review the defective items listed above and confirm one of the following options:<br>
                1. <strong>Replacement</strong> — send replacement units at no cost in the next shipment.<br>
                2. <strong>Credit Note</strong> — issue a credit note for the affected items.<br>
                3. <strong>Other</strong> — please specify your proposed resolution.<br><br>
                We appreciate your prompt response within <strong>14 business days</strong> from the date of this report.
              </div>

              <div class="footer">
                <strong>Minuë Opticians</strong> · Alejandro Carrasco Díaz · NIF: ES77843808D<br>
                C/ Gutiérrez de Alba 2, 41010 Sevilla, Spain<br>
                Email: hola@minueopticians.com · www.minueopticians.com<br><br>
                Report generated on ${today} from b2b.minueopticians.com. This document is for the exclusive use of the addressed supplier and contains commercially sensitive information.
              </div>
            </body></html>`;
            const w = window.open("","_blank");
            w.document.write(html);
            w.document.close();
            setTimeout(() => w.print(), 500);
          }}>📄 Export PDF (EN)</Btn>
          <Btn small ghost onClick={() => {
            const pending = defectives.filter(d => d.status !== "resolved");
            const headers = ["Model","Color","SKU","Quantity","Description","Date Reported","Reported By"];
            const rows = pending.map(d => [
              d.model||"",
              d.color||"",
              d.sku||"",
              d.quantity||0,
              (d.description||"").replace(/"/g,'""').replace(/\n/g,' '),
              d.created_at ? new Date(d.created_at).toLocaleDateString("en-GB") : "",
              d.created_by||""
            ]);
            exportCSV("minue_defective_products_"+new Date().toISOString().slice(0,10)+".csv", headers, rows);
          }}>📊 Export CSV</Btn>
        </>}<Btn small onClick={() => { setModal("newDefect"); setEd({model:"",color:"",sku:"",quantity:1,description:""}); }}>{t("reportarDefecto")}</Btn></div>}>
          {(() => {
            const grouped = {};
            defectives.filter(d => d.status !== "resolved").forEach(d => {
              const key = d.model+"|"+d.color;
              if (!grouped[key]) grouped[key] = {model:d.model,color:d.color,sku:d.sku,total:0,items:[]};
              grouped[key].total += d.quantity;
              grouped[key].items.push(d);
            });
            const entries = Object.values(grouped).sort((a,b) => b.total - a.total);
            if (entries.length === 0) return <div style={{textAlign:"center",padding:30,fontSize:12,fontFamily:BD,color:C.gr2}}>✓ Sin defectos pendientes</div>;
            return entries.map((g, i) => (
              <div key={i} style={{background:C.wh,border:"1px solid "+C.rd+"30",borderRadius:8,marginBottom:8,overflow:"hidden"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px"}}>
                  <span style={{fontSize:16}}>⚠</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontFamily:BD,fontWeight:700,color:C.dk}}>{g.model} {g.color}</div>
                    <div style={{fontSize:10,fontFamily:BD,color:C.gr}}>{g.sku}</div>
                  </div>
                  <div style={{background:C.rd+"15",borderRadius:20,padding:"4px 12px"}}>
                    <span style={{fontSize:16,fontFamily:BD,fontWeight:700,color:C.rd}}>{g.total}</span>
                    <span style={{fontSize:9,fontFamily:BD,color:C.rd,marginLeft:3}}>uds</span>
                  </div>
                </div>
                {g.items.map((d, j) => (
                  <div key={j} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 14px 6px 42px",borderTop:"1px solid "+C.bg2,fontSize:11,fontFamily:BD}}>
                    <span style={{color:C.gr,flex:1}}>{d.description || "Sin descripción"}</span>
                    <span style={{color:C.gr}}>x{d.quantity}</span>
                    <span style={{fontSize:9,color:C.gr}}>{d.created_by} · {d.created_at ? new Date(d.created_at).toLocaleDateString("es") : ""}</span>
                    <button onClick={() => dbUpdateDefective({...d, status:"resolved"})} style={{background:"none",border:"none",color:C.gn,cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:600}}>✓ Resolver</button>
                  </div>
                ))}
              </div>
            ));
          })()}
          {defectives.filter(d => d.status === "resolved").length > 0 && <>
            <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:14,marginBottom:6}}>{t("resolu")} ({defectives.filter(d => d.status === "resolved").length})</div>
            {defectives.filter(d => d.status === "resolved").slice(0,5).map((d, i) => (
              <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 14px",fontSize:11,fontFamily:BD,color:C.gr,opacity:0.5}}>
                <span style={{color:C.gn}}>✓</span> {d.model} {d.color} x{d.quantity}
              </div>
            ))}
          </>}
        </Sec>
      </>}

      {/* ═══ LOGÍSTICA (admin + team) ═══ */}
      {(view === "a-logistica" || view === "e-logistica") && <>
        {/* PEDIDOS POR ENVIAR */}
        <Sec title={t("aExpedier")} sub={orders.filter(o => o.status === "confirmed" || o.status === "preparing").length+" "+t("commandes")}>
          {(() => {
            const toShip = orders.filter(o => o.status === "confirmed" || o.status === "preparing");
            if (toShip.length === 0) return <div style={{textAlign:"center",padding:30,fontSize:12,fontFamily:BD,color:C.gr2}}>✓ {t("aucuneCmd")}</div>;
            return <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>
              {toShip.map((o,i) => renderOrderRow(o, orders.indexOf(o), role==="admin", true))}
            </div>;
          })()}
        </Sec>

        {/* ENVÍOS EN TRÁNSITO */}
        <Sec title={t("expedie")} sub={orders.filter(o => o.status === "shipped" || o.status === "partial").length+" "+t("commandes")}>
          <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>
            {orders.filter(o => o.status === "shipped" || o.status === "partial").map((o,i) => renderOrderRow(o, orders.indexOf(o), role==="admin", true))}
            {orders.filter(o => o.status === "shipped" || o.status === "partial").length === 0 && <div style={{textAlign:"center",padding:20,fontSize:12,fontFamily:BD,color:C.gr2}}>—</div>}
          </div>
        </Sec>

        {/* MERCANCÍA PENDIENTE PROVEEDOR */}
        <Sec title={t("mercanciaPendiente")} right={<Btn small onClick={() => { setModal("newTask"); setEd({title:"",desc:"",priority:"moyenne",area:"proveedor",status:"aFaire",dueDate:"",assignee:user.name}); }}>{t("nouveau")}</Btn>}>
          {(() => {
            const provTasks = tasks.filter(tk => tk.area === "proveedor");
            if (provTasks.length === 0) return <div style={{textAlign:"center",padding:20,fontSize:12,fontFamily:BD,color:C.gr2}}>{t("sinPedidosProveedor")}</div>;
            return provTasks.map((tk, i) => (
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:C.wh,border:"1px solid "+C.ln,borderRadius:6,marginBottom:6,cursor:"pointer"}} onClick={() => { setModal("editTask"); setEd({...tk}); }}>
                <span style={{fontSize:14}}>{tk.status === "fait" ? "📦" : "🚚"}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontFamily:BD,fontWeight:600,color:C.dk}}>{tk.title}</div>
                  {tk.desc && <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:1}}>{tk.desc.substring(0,80)}</div>}
                </div>
                {tk.dueDate && <span style={{fontSize:10,fontFamily:BD,color:C.bl,background:C.bl+"10",padding:"2px 8px",borderRadius:3}}>{t("fechaPrevista")}: {tk.dueDate}</span>}
                <Badge l={tk.status === "fait" ? t("livre") : t("enAttente")} c={tk.status === "fait" ? C.gn : C.yl} />
              </div>
            ));
          })()}
        </Sec>
      </>}

      {/* ═══ COMERCIAL ADMIN ═══ */}
      {view === "a-comercial" && <>
        <Sec title={t("commercial")} sub={t("comercialSub")}>
          {(() => {
            const comTasks = tasks.filter(tk => tk.area === "commercial");
            const nuevo = comTasks.filter(tk => tk.status === "aFaire");
            const contactado = comTasks.filter(tk => tk.status === "enCours" && tk.priority !== "haute");
            const negociacion = comTasks.filter(tk => tk.status === "enCours" && tk.priority === "haute");
            const ganados = comTasks.filter(tk => tk.status === "fait");
            return <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:20}}>
              <div style={{background:"#3498db10",border:"1px solid #3498db30",borderRadius:8,padding:"12px 10px",textAlign:"center"}}>
                <div style={{fontSize:20,fontFamily:BD,fontWeight:700,color:"#3498db"}}>{nuevo.length}</div>
                <div style={{fontSize:9,fontFamily:BD,color:C.gr}}>{t("nuevoLead")}</div>
              </div>
              <div style={{background:"#f39c1210",border:"1px solid #f39c1230",borderRadius:8,padding:"12px 10px",textAlign:"center"}}>
                <div style={{fontSize:20,fontFamily:BD,fontWeight:700,color:"#f39c12"}}>{contactado.length}</div>
                <div style={{fontSize:9,fontFamily:BD,color:C.gr}}>{t("contactado")}</div>
              </div>
              <div style={{background:"#8e44ad10",border:"1px solid #8e44ad30",borderRadius:8,padding:"12px 10px",textAlign:"center"}}>
                <div style={{fontSize:20,fontFamily:BD,fontWeight:700,color:"#8e44ad"}}>{negociacion.length}</div>
                <div style={{fontSize:9,fontFamily:BD,color:C.gr}}>{t("enNegociacion")}</div>
              </div>
              <div style={{background:C.gn+"10",border:"1px solid "+C.gn+"30",borderRadius:8,padding:"12px 10px",textAlign:"center"}}>
                <div style={{fontSize:20,fontFamily:BD,fontWeight:700,color:C.gn}}>{ganados.length}</div>
                <div style={{fontSize:9,fontFamily:BD,color:C.gr}}>{t("ganado")}</div>
              </div>
            </div>;
          })()}
        </Sec>
        <Sec title={t("seguimiento")} right={<Btn small onClick={() => { setModal("newTask"); setEd({title:"",desc:"",priority:"moyenne",area:"commercial",status:"aFaire",dueDate:"",assignee:""}); }}>{t("nuevoLead")}</Btn>}>
          {(() => {
            const leads = tasks.filter(tk => tk.area === "commercial" && tk.status !== "fait");
            if (leads.length === 0) return <div style={{textAlign:"center",padding:30,fontSize:12,fontFamily:BD,color:C.gr2}}>{t("sinLeads")}</div>;
            return leads.map((tk, i) => {
              const stColor = tk.status === "aFaire" ? "#3498db" : tk.priority === "haute" ? "#8e44ad" : "#f39c12";
              const stLabel = tk.status === "aFaire" ? t("nuevoLead") : tk.priority === "haute" ? t("enNegociacion") : t("contactado");
              return (
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:C.wh,border:"1px solid "+C.ln,borderRadius:8,marginBottom:8,cursor:"pointer"}} onClick={() => { setModal("editTask"); setEd({...tk}); }}>
                  <div style={{width:10,height:10,borderRadius:5,background:stColor,flexShrink:0}} />
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontFamily:BD,fontWeight:600,color:C.dk}}>{tk.title}</div>
                    {tk.desc && <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:2,lineHeight:1.4}}>{tk.desc.substring(0,120)}</div>}
                    {tk.assignee && <div style={{fontSize:9,fontFamily:BD,color:C.bl,marginTop:3}}>→ {tk.assignee}</div>}
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <Badge l={stLabel} c={stColor} />
                    {tk.dueDate && <div style={{fontSize:9,fontFamily:BD,color:C.gr,marginTop:4}}>{t("proximaAccion")}: {tk.dueDate}</div>}
                  </div>
                </div>
              );
            });
          })()}
        </Sec>
        <Sec title={t("aRecuperar")} sub={t("aRecuperarSub")}>
          {(() => {
            const withOrders = {};
            orders.forEach(o => { withOrders[o.client] = true; });
            const noOrders = clients.filter(c => !withOrders[c.name] && (c.status === "active" || c.status === "prospect"));
            if (noOrders.length === 0) return <div style={{textAlign:"center",padding:20,fontSize:12,fontFamily:BD,color:C.gr2}}>{t("todosClientesPedidos")}</div>;
            return noOrders.slice(0,10).map((c,i) => (
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:C.wh,border:"1px solid "+C.ln,borderRadius:6,marginBottom:6}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontFamily:BD,fontWeight:600,color:C.dk}}>{c.name}</div>
                  <div style={{fontSize:10,fontFamily:BD,color:C.gr}}>{c.contact} · {c.city} · {c.channel}</div>
                </div>
                <Badge l={t("sinPedidos")} c={C.rd} />
                <Btn small ghost onClick={() => { setModal("newTask"); setEd({title:t("seguimiento")+": "+c.name,desc:c.contact+" · "+(c.companyEmail||c.phone||""),priority:"moyenne",area:"commercial",status:"aFaire",dueDate:"",assignee:""}); }}>{t("seguimiento")}</Btn>
              </div>
            ));
          })()}
        </Sec>
      </>}

      {view === "a-stats" && <Sec title={t("tableauBord")}>
        {/* PAYMENT ACTION BANNER */}
        {orders.filter(o => o.status === "confirmed" && !o.payMethod).length > 0 && (
          <div onClick={() => setView("a-ord")} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",background:"linear-gradient(135deg,#fff8e6,#ffe999)",border:"1px solid #f0a020"+"60",borderRadius:10,marginBottom:14,cursor:"pointer"}}>
            <div style={{fontSize:22}}>💳</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontFamily:BD,color:C.dk,fontWeight:700}}>{orders.filter(o => o.status === "confirmed" && !o.payMethod).length} pedidos sin pago configurado</div>
              <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginTop:2}}>Selecciona método y envía link al cliente</div>
            </div>
            <span style={{fontSize:11,fontFamily:BD,color:"#f0a020",fontWeight:600}}>→ Configurar</span>
          </div>
        )}
        {orders.filter(o => o.pay === "overdue").length > 0 && (
          <div onClick={() => setView("a-ord")} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",background:"#fff0f0",border:"1px solid "+C.rd+"40",borderRadius:10,marginBottom:14,cursor:"pointer"}}>
            <div style={{fontSize:22}}>⚠️</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontFamily:BD,color:C.dk,fontWeight:700}}>{orders.filter(o => o.pay === "overdue").length} pagos vencidos</div>
              <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginTop:2}}>Hacer seguimiento urgente</div>
            </div>
            <span style={{fontSize:11,fontFamily:BD,color:C.rd,fontWeight:600}}>→ Revisar</span>
          </div>
        )}
        {users.filter(u => u.active === false && u.role !== "admin").length > 0 && (
          <div onClick={() => { setView("a-users"); setUserFilter("pending"); }} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:"#f39c12"+"12",border:"1px solid #f39c12"+"40",borderRadius:8,marginBottom:16,cursor:"pointer"}}>
            <span style={{width:10,height:10,borderRadius:5,background:"#f39c12",flexShrink:0}} />
            <span style={{fontSize:13,fontFamily:BD,color:C.dk,fontWeight:600}}>{users.filter(u => u.active === false && u.role !== "admin").length} {t("solicitudes")}</span>
            <span style={{fontSize:11,fontFamily:BD,color:C.gr,flex:1}}>→ {t("voirTout")}</span>
          </div>
        )}
        {/* KPI ROW */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10,marginBottom:22}}>
          {renderKPI(t("ca"), fmt(orders.reduce((s,o) => s+o.total, 0))+" €", C.gn)}
          {renderKPI(t("commandes"), String(orders.length))}
          {renderKPI(t("unites"), String(orders.reduce((s,o) => s+o.items, 0)))}
          {renderKPI(t("clients"), String(clients.length))}
          {renderKPI(t("produits"), String(products.length))}
          {renderKPI(t("panierMoyen"), orders.length ? fmt(orders.reduce((s,o) => s+o.total, 0)/orders.length)+" €" : "—")}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12,marginBottom:12}}>
          {/* URGENT TASKS */}
          <div style={{background:C.wh,borderRadius:8,padding:0,overflow:"hidden",border:"1px solid "+C.ln}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderBottom:"1px solid "+C.ln,background:C.rd+"08"}}>
              <span style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700}}>{t("tareas")} · <span style={{color:C.rd}}>{t("haute")}</span></span>
              <Btn small ghost onClick={() => setView("a-tasks")}>{t("voirTout")}</Btn>
            </div>
            <div style={{padding:"10px 16px"}}>
              {tasks.filter(tk => tk.priority === "haute" && tk.status !== "fait").length === 0
                ? <div style={{fontSize:12,fontFamily:BD,color:C.gn,padding:12,textAlign:"center",fontWeight:500}}>✓ Sin tareas urgentes</div>
                : tasks.filter(tk => tk.priority === "haute" && tk.status !== "fait").slice(0,4).map((tk,i) => (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 0",borderBottom:"1px solid "+C.bg2,cursor:"pointer"}} onClick={() => { setModal("editTask"); setEd({...tk}); }}>
                    <span style={{width:8,height:8,borderRadius:4,background:C.rd,flexShrink:0}} />
                    <span style={{fontSize:12,fontFamily:BD,color:C.dk,flex:1}}>{tk.title}</span>
                    <Badge l={t(tk.status)} c={tk.status==="enCours"?C.yl:C.gr} />
                  </div>
                ))
              }
            </div>
          </div>

          {/* LOW STOCK */}
          <div style={{background:C.wh,borderRadius:8,padding:0,overflow:"hidden",border:"1px solid "+C.ln}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderBottom:"1px solid "+C.ln,background:C.yl+"08"}}>
              <span style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700}}>{t("stockBajo")}</span>
              <Btn small ghost onClick={() => setView("a-stock")}>{t("voirTout")}</Btn>
            </div>
            <div style={{padding:"6px 16px"}}>
              {products.filter(p => p.stock < 10).sort((a,b) => a.stock - b.stock).slice(0,6).map((p,i) => (
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:"1px solid "+C.bg2}}>
                  {p.imageUrl ? <img src={p.imageUrl} style={{width:30,height:30,objectFit:"contain",borderRadius:4}} /> : <span style={{width:30,height:30,background:C.bg,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,color:C.ln}}>—</span>}
                  <span style={{fontSize:12,fontFamily:BD,color:C.dk,flex:1,fontWeight:500}}>{p.model} <span style={{color:C.gr,fontWeight:400}}>{p.color}</span></span>
                  <span style={{fontSize:14,fontWeight:700,fontFamily:BD,color:p.stock<5?C.rd:C.yl,background:p.stock<5?C.rd+"10":C.yl+"10",padding:"2px 8px",borderRadius:10}}>{p.stock}</span>
                </div>
              ))}
              {products.filter(p => p.stock < 10).length === 0 && <div style={{fontSize:12,fontFamily:BD,color:C.gn,padding:12,textAlign:"center",fontWeight:500}}>✓ Stock OK</div>}
            </div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12,marginBottom:12}}>
          {/* RECENT ORDERS */}
          <div style={{background:C.wh,borderRadius:8,padding:0,overflow:"hidden",border:"1px solid "+C.ln}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderBottom:"1px solid "+C.ln}}>
              <span style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700}}>{t("commandes")} récentes</span>
              <Btn small ghost onClick={() => setView("a-ord")}>{t("voirTout")}</Btn>
            </div>
            <div style={{padding:"6px 16px"}}>
              {orders.slice(0,5).map((o,i) => (
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:"1px solid "+C.bg2}}>
                  <span style={{fontSize:12,fontWeight:700,fontFamily:BD,color:C.dk}}>{o.id}</span>
                  <span style={{fontSize:12,fontFamily:BD,color:C.gr,flex:1}}>{o.client}</span>
                  <span style={{fontSize:11,fontFamily:BD,color:C.gr2}}>{o.date}</span>
                  <span style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>{fmt(o.total)} €</span>
                  <Badge l={SL[o.status]} c={SC[o.status]} />
                </div>
              ))}
              {orders.length === 0 && <div style={{fontSize:12,fontFamily:BD,color:C.gr2,padding:14,textAlign:"center"}}>—</div>}
            </div>
          </div>

          {/* PENDING PAYMENTS */}
          <div style={{background:C.wh,borderRadius:8,padding:0,overflow:"hidden",border:"1px solid "+C.ln}}>
            <div style={{padding:"12px 16px",borderBottom:"1px solid "+C.ln,background:C.bl+"06"}}>
              <span style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700}}>{t("enAttente")} · {t("paiement")}</span>
            </div>
            <div style={{padding:"6px 16px"}}>
              {orders.filter(o => o.pay === "pending" || o.pay === "invoiced").length === 0
                ? <div style={{fontSize:12,fontFamily:BD,color:C.gn,padding:12,textAlign:"center",fontWeight:500}}>✓ Todo cobrado</div>
                : orders.filter(o => o.pay === "pending" || o.pay === "invoiced").slice(0,5).map((o,i) => (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:"1px solid "+C.bg2}}>
                    <span style={{fontSize:12,fontWeight:700,fontFamily:BD,color:C.dk}}>{o.id}</span>
                    <span style={{fontSize:12,fontFamily:BD,color:C.gr,flex:1}}>{o.client}</span>
                    <span style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>{fmt(o.total)} €</span>
                    <Badge l={PL[o.pay]} c={PC[o.pay]} />
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12}}>
          {/* CHANNELS */}
          <div style={{background:C.wh,borderRadius:8,padding:0,overflow:"hidden",border:"1px solid "+C.ln}}>
            <div style={{padding:"12px 16px",borderBottom:"1px solid "+C.ln}}>
              <span style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700}}>{t("canaux")}</span>
            </div>
            <div style={{padding:"12px 16px"}}>
              {(() => {
                const channels = {};
                orders.forEach(o => { channels[o.dist] = (channels[o.dist]||0) + o.total; });
                const total = Object.values(channels).reduce((s,v) => s+v, 0) || 1;
                const colors = {"Agent Sud":C.dk,"Direct":C.gn,"Faire":C.yl};
                return Object.entries(channels).sort((a,b) => b[1]-a[1]).map(([ch,val],i) => (
                  <div key={i} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontFamily:BD,fontSize:12,marginBottom:4}}><span style={{fontWeight:600}}>{ch}</span><span style={{color:C.gr}}>{fmt(val)} € ({Math.round(val/total*100)}%)</span></div>
                    <div style={{height:6,background:C.bg2,borderRadius:3}}><div style={{height:6,background:colors[ch]||C.bl,borderRadius:3,width:Math.round(val/total*100)+"%"}} /></div>
                  </div>
                ));
              })()}
              {orders.length === 0 && <div style={{fontSize:12,fontFamily:BD,color:C.gr2,textAlign:"center",padding:10}}>—</div>}
            </div>
          </div>

          {/* CUSTOM PRICES */}
          <div style={{background:C.wh,borderRadius:8,padding:0,overflow:"hidden",border:"1px solid "+C.ln}}>
            <div style={{padding:"12px 16px",borderBottom:"1px solid "+C.ln}}>
              <span style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700}}>{t("clients")} · {t("prixCustom")}</span>
            </div>
            <div style={{padding:"8px 16px"}}>
            {clients.filter(c => c.customPrice > 0).length
              ? clients.filter(c => c.customPrice > 0).map((c, i) => <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontFamily:BD,fontSize:11,borderBottom:"1px solid "+C.bg2}}><span>{c.name} <span style={{color:C.gr2}}>({c.country||"—"})</span></span><span style={{color:C.bl,fontWeight:600}}>{fmt(c.customPrice)} €</span></div>)
              : <div style={{fontSize:11,color:C.gr2,fontFamily:BD,textAlign:"center"}}>{t("tousStandard")}</div>
            }
            {clients.filter(c => c.earlyPay).length > 0 && <>
              <div style={{fontSize:10,fontFamily:BD,color:C.gn,marginTop:10,fontWeight:600}}>Early Pay (-3%)</div>
              {clients.filter(c => c.earlyPay).map((c,i) => <div key={i} style={{fontSize:11,fontFamily:BD,color:C.dk,padding:"3px 0"}}>{c.name}</div>)}
            </>}
            </div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12,marginTop:12}}>
          {/* TOP SELLING */}
          <div style={{background:C.wh,borderRadius:8,overflow:"hidden",border:"1px solid "+C.ln}}>
            <div style={{padding:"12px 16px",borderBottom:"1px solid "+C.ln}}>
              <span style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700}}>{t("topVentas")}</span>
            </div>
            <div style={{padding:"8px 16px"}}>
              {(() => { const sold = {}; orders.forEach(o => (o.lines||[]).forEach(l => { sold[l.model] = (sold[l.model]||0) + (l.qty||0); })); return Object.entries(sold).sort((a,b) => b[1]-a[1]).slice(0,6).map(([model,qty],i) => {
                const p = products.find(x => x.model === model);
                return (<div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:"1px solid "+C.bg2}}>
                  <span style={{fontSize:11,fontFamily:BD,color:C.gr2,fontWeight:700,minWidth:20}}>{i+1}.</span>
                  {p?.imageUrl ? <img src={p.imageUrl} style={{width:28,height:28,objectFit:"contain",borderRadius:3}} /> : <span style={{width:28}} />}
                  <span style={{fontSize:12,fontFamily:BD,color:C.dk,flex:1,fontWeight:500}}>{model}</span>
                  <span style={{fontSize:13,fontWeight:700,fontFamily:BD,color:C.gn}}>{qty} uds</span>
                </div>);
              }); })()}
              {orders.length === 0 && <div style={{fontSize:12,fontFamily:BD,color:C.gr2,padding:10,textAlign:"center"}}>—</div>}
            </div>
          </div>

          {/* CLIENTS BY COUNTRY */}
          <div style={{background:C.wh,borderRadius:8,overflow:"hidden",border:"1px solid "+C.ln}}>
            <div style={{padding:"12px 16px",borderBottom:"1px solid "+C.ln}}>
              <span style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700}}>{t("clientsPays")}</span>
            </div>
            <div style={{padding:"12px 16px"}}>
              {(() => { const cc = {}; clients.forEach(c => { const k = c.country || "—"; cc[k] = (cc[k]||0)+1; }); const total = clients.length || 1; const flags = {FR:"🇫🇷",ES:"🇪🇸",DE:"🇩🇪",US:"🇺🇸",IT:"🇮🇹",PT:"🇵🇹",BE:"🇧🇪",NL:"🇳🇱",UK:"🇬🇧",CH:"🇨🇭",CO:"🇨🇴",MX:"🇲🇽"}; return Object.entries(cc).sort((a,b) => b[1]-a[1]).slice(0,8).map(([co,n],i) => (
                <div key={i} style={{marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontFamily:BD,fontSize:12,marginBottom:3}}>
                    <span style={{fontWeight:500}}>{flags[co]||"🌍"} {co}</span>
                    <span style={{color:C.gr}}>{n} ({Math.round(n/total*100)}%)</span>
                  </div>
                  <div style={{height:5,background:C.bg2,borderRadius:3}}><div style={{height:5,background:C.gn,borderRadius:3,width:Math.round(n/total*100)+"%"}} /></div>
                </div>
              )); })()}
              {clients.length === 0 && <div style={{fontSize:12,fontFamily:BD,color:C.gr2,padding:10,textAlign:"center"}}>—</div>}
            </div>
          </div>
        </div>
      </Sec>}
      {/* PACKAGING VIEWS */}
      {(view === "c-pack" || view === "d-pack") && <Sec title={t("packaging")} sub={t("packagingSub")}>
        {[["Étui","packEtui"],["Display","packDisplay"],["Merchandising","packMerch"]].map(([type,key]) => {
          const items = packItems.filter(pk => pk.on && pk.type === type);
          return items.length > 0 ? <div key={type} style={{marginBottom:24}}>
            <div style={{fontSize:16,fontFamily:DP,color:C.dk,fontWeight:500,marginBottom:12}}>{t(key)}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
              {items.map((pk,i) => (
                <div key={pk.id} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,overflow:"hidden"}}>
                  {pk.imageUrl ? <div style={{height:140,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                    <img src={pk.imageUrl} alt="" style={{width:"100%",height:"100%",objectFit:"contain",padding:8}} />
                  </div> : <div style={{height:140,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:DP,fontSize:24,color:C.ln,letterSpacing:2}}>MINUË</div>}
                  <div style={{padding:"14px 16px"}}>
                    <div style={{fontSize:13,fontFamily:BD,color:C.dk,fontWeight:600}}>{(pk.name&&pk.name[lang])||pk.name?.fr||""}</div>
                    <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginTop:6,lineHeight:1.5}}>{(pk.desc&&pk.desc[lang])||pk.desc?.fr||""}</div>
                  </div>
                </div>
              ))}
            </div>
          </div> : null;
        })}
      </Sec>}

      {view === "a-pack" && <Sec title={t("packaging")} sub={t("packagingSub")} right={<Btn small onClick={() => { setModal("newPack"); setEd({type:"Étui",name:{fr:"",es:"",en:"",it:""},desc:{fr:"",es:"",en:"",it:""},imageUrl:"",on:true}); }}>{t("nouveauPack")}</Btn>}>
        {[["Étui","packEtui"],["Display","packDisplay"],["Merchandising","packMerch"]].map(([type,key]) => {
          const items = packItems.filter(pk => pk.type === type);
          return items.length > 0 ? <div key={type} style={{marginBottom:24}}>
            <div style={{fontSize:16,fontFamily:DP,color:C.dk,fontWeight:500,marginBottom:12}}>{t(key)}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
              {items.map((pk,i) => (
                <div key={pk.id} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,overflow:"hidden",opacity:pk.on?1:0.4,cursor:"pointer"}} onClick={() => { setModal("editPack"); setEd({...pk}); }}>
                  {pk.imageUrl ? <div style={{height:120,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                    <img src={pk.imageUrl} alt="" style={{width:"100%",height:"100%",objectFit:"contain",padding:6}} />
                  </div> : <div style={{height:120,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:DP,fontSize:20,color:C.ln}}>MINUË</div>}
                  <div style={{padding:"12px 14px"}}>
                    <div style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:600}}>{(pk.name&&pk.name[lang])||pk.name?.fr||""}</div>
                    <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:4,lineHeight:1.4}}>{((pk.desc&&pk.desc[lang])||pk.desc?.fr||"").substring(0,80)}</div>
                    {!pk.on && <Badge l="OFF" c={C.rd} />}
                  </div>
                </div>
              ))}
            </div>
          </div> : null;
        })}
      </Sec>}

      {/* FAQ VIEWS */}
      {(view === "c-help" || view === "d-help" || view === "a-faq") && <Sec title={t("faq")} sub={t("faqSub")} right={(role === "admin" || role === "team") ? <Btn small onClick={() => { setModal("newFaq"); setEd({q:{fr:"",es:"",en:"",it:""},a:{fr:"",es:"",en:"",it:""},on:true}); }}>{t("nouvelleFaq")}</Btn> : null}>
        <div style={{maxWidth:700}}>
          {faqs.filter(f => (role === "admin" || role === "team") ? true : f.on).map((f, i) => (
            <div key={i} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,marginBottom:8,opacity:f.on?1:0.4,overflow:"hidden"}}>
              <button onClick={() => setHelpExpanded(helpExpanded === f.id ? null : f.id)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",background:"none",border:"none",cursor:"pointer",textAlign:"left"}}>
                <span style={{fontSize:13,fontFamily:BD,color:C.dk,fontWeight:600,flex:1,paddingRight:8}}>{(f.q && f.q[lang]) || f.q?.fr || ""}</span>
                <span style={{fontSize:16,color:C.gr,fontFamily:BD,flexShrink:0,transform:helpExpanded===f.id?"rotate(45deg)":"none",transition:"transform 0.2s"}}>+</span>
              </button>
              {helpExpanded === f.id && <div style={{padding:"0 18px 16px",fontSize:12,fontFamily:BD,color:C.gr,lineHeight:1.7}}>
                {(f.a && f.a[lang]) || f.a?.fr || ""}
                {(role === "admin" || role === "team") && <div style={{marginTop:10}}><Btn small ghost onClick={() => { setModal("editFaq"); setEd({...f}); }}>{t("editer")}</Btn></div>}
              </div>}
            </div>
          ))}
          {faqs.filter(f => (role === "admin" || role === "team") ? true : f.on).length === 0 && <div style={{fontSize:12,fontFamily:BD,color:C.gr2,textAlign:"center",padding:30}}>—</div>}
        </div>
      </Sec>}

      {/* ═══ EMPLOYEE CLOCK IN/OUT ═══ */}
      {view === "e-fichaje" && <Sec title={t("fichaje")} sub="Calle Ardilla 13, Sevilla">
        <div style={{maxWidth:400,margin:"0 auto",textAlign:"center"}}>
          <div style={{width:120,height:120,borderRadius:60,background:clockStatus==="in"?"#2d6b4f18":"#18332f08",border:"2px solid "+(clockStatus==="in"?"#2d6b4f":"#18332f20"),display:"flex",alignItems:"center",justifyContent:"center",margin:"20px auto",fontSize:40}}>{clockStatus==="in"?"🟢":"⚪"}</div>
          <div style={{fontSize:18,fontWeight:600,marginBottom:6}}>{clockStatus==="in"?t("fichado"):t("noFichado")}</div>
          <div style={{fontSize:12,color:CL.dk+"60",marginBottom:24}}>{new Date().toLocaleDateString(lang,{weekday:"long",day:"numeric",month:"long"})}</div>
          {geoError && <div style={{fontSize:11,color:"#e74c3c",background:"#e74c3c08",border:"1px solid #e74c3c20",borderRadius:6,padding:"10px 14px",marginBottom:16}}>{geoError}</div>}
          <div style={{display:"flex",gap:12,justifyContent:"center",marginBottom:30}}>
            <button onClick={() => doTimeclock("in")} disabled={clockStatus==="in"} style={{padding:"14px 32px",background:clockStatus==="in"?"#18332f30":"#2d6b4f",color:"#fff",border:"none",borderRadius:6,fontSize:13,fontFamily:BD,fontWeight:600,cursor:clockStatus==="in"?"default":"pointer",opacity:clockStatus==="in"?0.4:1}}>{t("ficharEntrada")}</button>
            <button onClick={() => doTimeclock("out")} disabled={clockStatus!=="in"} style={{padding:"14px 32px",background:clockStatus!=="in"?"#18332f30":"#e74c3c",color:"#fff",border:"none",borderRadius:6,fontSize:13,fontFamily:BD,fontWeight:600,cursor:clockStatus!=="in"?"default":"pointer",opacity:clockStatus!=="in"?0.4:1}}>{t("ficharSalida")}</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:30}}>
            {[["horasHoy",getHours(timeclock,user?.email,new Date(new Date().setHours(0,0,0,0)),new Date())],["horasSemana",getHours(timeclock,user?.email,new Date(new Date().setDate(new Date().getDate()-new Date().getDay()+1)),new Date())],["horasMes",getHours(timeclock,user?.email,new Date(new Date().getFullYear(),new Date().getMonth(),1),new Date())]].map(([k,v]) => <div key={k} style={{background:"#fff",border:"1px solid #18332f10",borderRadius:8,padding:14,textAlign:"center"}}><div style={{fontSize:22,fontWeight:300,fontFamily:DP}}>{v.toFixed(1)}h</div><div style={{fontSize:10,color:CL.dk+"60"}}>{t(k)}</div></div>)}
          </div>
          <div style={{textAlign:"left"}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>{t("historialFichajes")}</div>
            {timeclock.filter(r => r.user_email === user?.email).slice(0,20).map((r,i) => <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 12px",background:i%2?"transparent":"#18332f04",borderRadius:4,fontSize:11}}>
              <span style={{fontWeight:500,color:r.type==="in"?"#2d6b4f":"#e74c3c"}}>{r.type==="in"?"▶ "+t("entrada"):"◼ "+t("salida")}</span>
              <span style={{color:CL.dk+"60"}}>{new Date(r.timestamp).toLocaleString(lang,{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}</span>
              <span style={{color:CL.dk+"40"}}>{r.distance_m || r.distance || "—"}m</span>
            </div>)}
            {timeclock.filter(r => r.user_email === user?.email).length === 0 && <div style={{fontSize:12,color:CL.dk+"40",textAlign:"center",padding:20}}>{t("sinFichajes")}</div>}
          </div>
        </div>
      </Sec>}

      {/* ═══ ADMIN RECOMMENDATIONS SECTION ═══ */}
      {view === "a-recom" && <Sec title={t("recomendaciones")} sub="Asigna diseños recomendados a cada cliente">
        {(() => {
          const allClients = users.filter(u => u.role === "client");
          const selectedClient = ed?._recClient || allClients[0]?.email;
          const client = allClients.find(c => c.email === selectedClient);
          const clientRecs = recommendations[selectedClient] || [];
          const recProducts = clientRecs.map(id => products.find(p => p.id === id)).filter(Boolean);
          return <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:20}}>
            {/* Client list */}
            <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"12px 0",maxHeight:"70vh",overflowY:"auto"}}>
              <div style={{padding:"0 14px 10px",borderBottom:"1px solid "+C.ln,fontSize:10,fontFamily:BD,color:C.gr,fontWeight:600,letterSpacing:0.5}}>CLIENTES ({allClients.length})</div>
              {allClients.map(c => {
                const recCount = (recommendations[c.email]||[]).length;
                return <div key={c.email} onClick={() => setEd(p => ({...p, _recClient:c.email}))} style={{padding:"10px 14px",cursor:"pointer",background:selectedClient===c.email?C.dk+"10":"transparent",borderLeft:"3px solid "+(selectedClient===c.email?C.dk:"transparent")}}>
                  <div style={{fontSize:12,fontFamily:BD,fontWeight:600,color:C.dk}}>{c.co || c.name}</div>
                  <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:2}}>{c.name} {recCount > 0 && <span style={{color:C.bl,fontWeight:600}}>· {recCount} rec.</span>}</div>
                </div>;
              })}
            </div>
            {/* Recommendations area */}
            <div>
              {client ? <>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <div>
                    <div style={{fontSize:16,fontFamily:DP,fontWeight:600,color:C.dk}}>{client.co || client.name}</div>
                    <div style={{fontSize:11,fontFamily:BD,color:C.gr}}>{client.email} · {clientRecs.length} diseños recomendados</div>
                  </div>
                  <Btn small onClick={() => { setModal("addRecommendation"); setEd(p => ({...p, _recClient:selectedClient, _recSearch:""})); }}>+ {t("agregarRec")}</Btn>
                </div>
                {recProducts.length === 0 ? <div style={{textAlign:"center",padding:40,color:C.gr,fontFamily:BD,fontSize:13,background:C.wh,border:"1px dashed "+C.ln,borderRadius:8}}>Sin recomendaciones. Click "+ Añadir recomendación" para empezar.</div> :
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10}}>
                  {recProducts.map(p => <div key={p.id} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,overflow:"hidden",position:"relative"}}>
                    <div style={{height:110,background:C.wh,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                      {p.imageUrl ? <img src={p.imageUrl} style={{width:"100%",height:"100%",objectFit:"contain",padding:8}} /> : <span style={{fontSize:20,color:C.ln,fontFamily:DP}}>MINUË</span>}
                    </div>
                    <div style={{padding:"8px 12px",background:"#faf6f1"}}>
                      <div style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>{p.model}</div>
                      <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:6}}>{p.color}</div>
                      <button onClick={() => dbRemoveRecommendation(selectedClient, p.id)} style={{width:"100%",padding:"5px 0",background:"transparent",color:C.rd,border:"1px solid "+C.rd+"30",fontSize:9,cursor:"pointer",fontFamily:BD,borderRadius:3,fontWeight:500}}>× Quitar</button>
                    </div>
                  </div>)}
                </div>}
              </> : <div style={{textAlign:"center",padding:60,color:C.gr,fontFamily:BD}}>Selecciona un cliente</div>}
            </div>
          </div>;
        })()}
      </Sec>}

      {/* ═══ ADMIN EMPLOYEES SECTION ═══ */}
      {view === "a-empleados" && <Sec title={t("empleados")} sub={t("fichaje") + " · Calle Ardilla 13, Sevilla · " + MAX_DISTANCE + "m max"}>
        {(() => { const teamUsers = users.filter(u => u.role === "team"); const now = new Date(); const today = new Date(now.getFullYear(),now.getMonth(),now.getDate()); const weekStart = new Date(today); weekStart.setDate(today.getDate()-today.getDay()+1); const monthStart = new Date(now.getFullYear(),now.getMonth(),1); return teamUsers.length === 0 ? <div style={{textAlign:"center",padding:40,color:CL.dk+"40"}}>{t("noResults")}</div> : teamUsers.map(emp => {
          const empRecs = timeclock.filter(r => r.user_email === emp.email);
          const lastRec = empRecs[0];
          const isIn = lastRec?.type === "in";
          const hToday = getHours(timeclock,emp.email,today,now);
          const hWeek = getHours(timeclock,emp.email,weekStart,now);
          const hMonth = getHours(timeclock,emp.email,monthStart,now);
          const uniqueDays = new Set(empRecs.filter(r=>r.type==="in").map(r=>new Date(r.timestamp).toDateString())).size;
          return <div key={emp.email} style={{background:"#fff",border:"1px solid #18332f10",borderRadius:8,padding:20,marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:40,height:40,borderRadius:20,background:CL.dk+"10",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:600}}>{emp.name?.charAt(0)}</div>
                <div><div style={{fontWeight:600,fontSize:14}}>{emp.name}</div><div style={{fontSize:11,color:CL.dk+"60"}}>{emp.email}</div></div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:8,height:8,borderRadius:4,background:isIn?"#2d6b4f":"#ccc"}}></div>
                <span style={{fontSize:11,color:isIn?"#2d6b4f":CL.dk+"40",fontWeight:500}}>{isIn?t("fichado"):t("noFichado")}</span>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:10,marginBottom:16}}>
              {[["horasHoy",hToday.toFixed(1)+"h"],["horasSemana",hWeek.toFixed(1)+"h"],["horasMes",hMonth.toFixed(1)+"h"],["diasTrabajados",uniqueDays],["mediaHoras",uniqueDays>0?(hMonth/uniqueDays).toFixed(1)+"h":"—"]].map(([k,v]) => <div key={k} style={{textAlign:"center",padding:"10px 4px",background:"#18332f04",borderRadius:6}}><div style={{fontSize:18,fontWeight:300,fontFamily:DP}}>{v}</div><div style={{fontSize:9,color:CL.dk+"60",letterSpacing:0.3}}>{t(k)}</div></div>)}
            </div>
            <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>{t("historialFichajes")}</div>
            <div style={{maxHeight:200,overflow:"auto"}}>
              {empRecs.slice(0,30).map((r,i) => <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 10px",background:i%2?"transparent":"#18332f04",borderRadius:4,fontSize:11}}>
                <span style={{fontWeight:500,color:r.type==="in"?"#2d6b4f":"#e74c3c",minWidth:60}}>{r.type==="in"?"▶ "+t("entrada"):"◼ "+t("salida")}</span>
                <span style={{color:CL.dk+"80"}}>{new Date(r.timestamp).toLocaleString(lang,{weekday:"short",day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}</span>
                <span style={{color:CL.dk+"40"}}>{r.distance_m || r.distance || "—"}m</span>
              </div>)}
              {empRecs.length === 0 && <div style={{fontSize:11,color:CL.dk+"40",textAlign:"center",padding:16}}>{t("sinFichajes")}</div>}
            </div>
          </div>; })
        })()}
      </Sec>}

      {/* TOASTS */}
      {toasts.length > 0 && <div style={{position:"fixed",bottom:140,left:"50%",transform:"translateX(-50%)",zIndex:300,display:"flex",flexDirection:"column",gap:8,alignItems:"center",pointerEvents:"none",width:"min(420px, calc(100vw - 32px))"}}>
        {toasts.map(tt => <div key={tt.id} style={{padding:"12px 20px",borderRadius:10,background:tt.type==="error"?"#7a2828":tt.type==="info"?CL.dk:"#1d4435",color:"#f8efe6",fontSize:12,fontFamily:BD,fontWeight:600,boxShadow:"0 8px 24px rgba(0,0,0,0.25)",display:"flex",alignItems:"center",gap:10,maxWidth:"100%",animation:"toastIn 0.25s ease"}}>
          <span style={{fontSize:15}}>{tt.type==="error"?"✕":tt.type==="info"?"ℹ":"✓"}</span>
          <span style={{lineHeight:1.4}}>{tt.msg}</span>
        </div>)}
        <style>{`@keyframes toastIn { from { opacity:0; transform: translateY(12px);} to { opacity:1; transform: translateY(0);} }`}</style>
      </div>}

      {/* CONFIRM DIALOG */}
      {confirmBox && <div onClick={() => setConfirmBox(null)} style={{position:"fixed",inset:0,background:"rgba(24,51,47,0.45)",backdropFilter:"blur(3px)",WebkitBackdropFilter:"blur(3px)",zIndex:310,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
        <div onClick={e => e.stopPropagation()} style={{background:"#fff",borderRadius:14,padding:"26px 28px",width:"min(380px, 100%)",boxShadow:"0 16px 48px rgba(0,0,0,0.3)",textAlign:"center"}}>
          <div style={{width:48,height:48,borderRadius:24,background:"#fef0f0",color:C.rd,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"0 auto 14px"}}>!</div>
          <div style={{fontSize:14,fontFamily:BD,fontWeight:700,color:C.dk,marginBottom:6}}>{t("confirmacion")||"Confirmación"}</div>
          <div style={{fontSize:12,fontFamily:BD,color:C.gr,lineHeight:1.6,marginBottom:20}}>{confirmBox.msg}</div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={() => setConfirmBox(null)} style={{flex:1,padding:"11px 0",background:"transparent",border:"1px solid "+C.ln,borderRadius:7,fontSize:12,fontFamily:BD,fontWeight:600,color:C.gr,cursor:"pointer"}}>{t("annuler")||"Cancelar"}</button>
            <button onClick={() => { const fn = confirmBox.onYes; setConfirmBox(null); fn && fn(); }} style={{flex:1,padding:"11px 0",background:C.rd,border:"none",borderRadius:7,fontSize:12,fontFamily:BD,fontWeight:700,color:"#fff",cursor:"pointer"}}>{t("confirmer")||"Confirmar"}</button>
          </div>
        </div>
      </div>}

      {/* FLOATING AI BUTTON (admin + team) */}
      {(role === "admin" || role === "team") && <>
        {!aiFloatOpen && <button onClick={() => setAiFloatOpen(true)} style={{position:"fixed",bottom:76,right:20,height:52,borderRadius:26,background:"linear-gradient(135deg,#c4956a,#d4a030)",color:C.dk,border:"none",cursor:"pointer",fontSize:13,fontFamily:BD,fontWeight:700,boxShadow:"0 4px 20px rgba(196,149,106,0.45)",zIndex:170,display:"flex",alignItems:"center",gap:8,padding:"0 20px"}}>
          <span style={{fontSize:18}}>✨</span>
          <span>{role === "admin" ? "Minüe AI" : "Ayuda IA"}</span>
        </button>}

        {aiFloatOpen && <div style={{position:"fixed",bottom:20,right:20,width:"min(400px, calc(100vw - 40px))",height:"min(560px, calc(100vh - 100px))",background:"#fff",borderRadius:14,boxShadow:"0 12px 48px rgba(0,0,0,0.25)",zIndex:170,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {/* Header */}
          <div style={{background:"linear-gradient(135deg,"+C.dk+",#0f2420)",padding:"14px 16px",display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:16,background:"linear-gradient(135deg,#c4956a,#d4a030)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>✨</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontFamily:DP,fontWeight:600,color:C.bg}}>{role === "admin" ? "Minüe AI" : "Ayuda de la plataforma"}</div>
              <div style={{fontSize:9,fontFamily:BD,color:C.bg+"80"}}>{role === "admin" ? "Análisis y decisiones de negocio" : "Dudas sobre cómo usar la plataforma"}</div>
            </div>
            {floatChat.length > 0 && <button onClick={() => { setFloatChat([]); setFloatError(""); }} title="Limpiar" style={{background:"transparent",border:"none",color:C.bg+"90",cursor:"pointer",fontSize:14,padding:"2px 6px"}}>↺</button>}
            <button onClick={() => setAiFloatOpen(false)} style={{background:"transparent",border:"none",color:C.bg,cursor:"pointer",fontSize:20,padding:"0 4px",lineHeight:1}}>×</button>
          </div>

          {/* Messages */}
          <div style={{flex:1,overflowY:"auto",padding:"14px 16px",background:C.bg}}>
            {floatChat.length === 0 && <div>
              <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginBottom:10,lineHeight:1.5}}>{role === "admin" ? "Pregúntame sobre tu negocio. Analizo tus datos en tiempo real." : "Pregúntame cómo hacer cualquier cosa en la plataforma."}</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {(role === "admin"
                  ? ["¿Qué 3 decisiones tomarías hoy?","¿Qué clientes debo reactivar?","¿Qué productos tienen peor margen?"]
                  : ["¿Cómo importo un pedido de Faire?","¿Cómo cambio el estado de un pedido?","¿Cómo reporto un producto defectuoso?","¿Cómo añado un cliente nuevo?"]
                ).map((q,i) => <button key={i} onClick={() => askFloat(q)} disabled={floatLoading} style={{padding:"9px 12px",background:C.wh,border:"1px solid "+C.ln,borderRadius:8,fontSize:11,fontFamily:BD,color:C.dk,cursor:floatLoading?"default":"pointer",textAlign:"left",lineHeight:1.3}}>{q}</button>)}
              </div>
            </div>}
            {floatChat.map((m,i) => <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:8}}>
              <div style={{maxWidth:"88%",padding:"9px 13px",borderRadius:10,background:m.role==="user"?C.dk:C.wh,color:m.role==="user"?C.bg:C.dk,fontSize:12,fontFamily:BD,lineHeight:1.6,whiteSpace:"pre-wrap",border:m.role==="user"?"none":"1px solid "+C.ln}}>{m.content}</div>
            </div>)}
            {floatLoading && <div style={{display:"flex",justifyContent:"flex-start"}}><div style={{padding:"9px 13px",borderRadius:10,background:C.wh,border:"1px solid "+C.ln,color:C.gr,fontSize:12,fontFamily:BD}}>Pensando…</div></div>}
            {floatError && <div style={{padding:"9px 12px",background:C.rd+"12",border:"1px solid "+C.rd+"30",borderRadius:8,fontSize:11,fontFamily:BD,color:C.rd,lineHeight:1.5}}>⚠ {floatError}</div>}
          </div>

          {/* Input */}
          <div style={{padding:"12px 14px",borderTop:"1px solid "+C.ln,background:C.wh,display:"flex",gap:8}}>
            <input value={floatInput} onChange={e => setFloatInput(e.target.value)} onKeyDown={e => { if(e.key==="Enter") askFloat(floatInput); }} placeholder={role === "admin" ? "Pregunta sobre tu negocio…" : "¿Cómo hago…?"} disabled={floatLoading} style={{flex:1,padding:"10px 14px",border:"1px solid "+C.ln,borderRadius:8,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            <button onClick={() => askFloat(floatInput)} disabled={floatLoading || !floatInput.trim()} style={{padding:"10px 16px",background:floatInput.trim()&&!floatLoading?C.dk:C.ln,color:floatInput.trim()&&!floatLoading?C.bg:C.gr2,border:"none",borderRadius:8,fontSize:12,fontFamily:BD,fontWeight:700,cursor:floatInput.trim()&&!floatLoading?"pointer":"default"}}>→</button>
          </div>
        </div>}
      </>}

      {/* FLOATING CART BUTTON - hide on cart page */}
      {role !== "admin" && role !== "team" && cartCount > 0 && view !== "c-cart" && view !== "d-cart" && <button onClick={() => setView(role === "distributor" ? "d-cart" : "c-cart")} style={{position:"fixed",bottom:78,right:16,height:56,borderRadius:28,background:"linear-gradient(135deg,#1d4435,"+C.dk+")",color:"#f8efe6",border:"1.5px solid rgba(196,149,106,0.5)",cursor:"pointer",fontSize:13,fontFamily:BD,fontWeight:700,boxShadow:"0 6px 24px rgba(24,51,47,0.45)",zIndex:160,display:"flex",alignItems:"center",gap:10,padding:"0 20px 0 16px",animation:"toastIn 0.3s ease"}}>
        <span style={{position:"relative",fontSize:20}}>🛒<span style={{position:"absolute",top:-7,right:-10,background:"#c4956a",color:C.dk,fontSize:9,fontWeight:800,padding:"1px 5px",borderRadius:8,fontFamily:BD}}>{cartCount}</span></span>
        <span style={{display:"flex",flexDirection:"column",alignItems:"flex-start",lineHeight:1.15}}><span style={{fontSize:12}}>{t("voirPanier")}</span><span style={{fontSize:10,opacity:0.75,fontWeight:500}}>{fmt(finalTotal)} €</span></span>
      </button>}
    </div>
  );
}
