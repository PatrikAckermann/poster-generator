export async function getFonts() {
  if (typeof queryLocalFonts !== "undefined") {
    var sortedFontList = []
    var fontList = await eval("queryLocalFonts()")
    fontList.forEach(x => {
      if(!sortedFontList.includes(x.family)) {
        sortedFontList.push(x.family)
      }
    })
    return sortedFontList //Only supported on Chromium. Won't work in firefox. The npm builder also doesn't know it
  }
  return new Promise((res, rej) => {res(["Arial", "Poppins"])})
}