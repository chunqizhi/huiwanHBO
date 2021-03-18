import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh from './zh/zh.js' //中文
import en from './en/en.js' //英文
Vue.use(VueI18n)
const locales = {
    zh: zh,
    en: en
}
const i18n = new VueI18n({
    locale: 'zh',
    messages: locales,
})

export default i18n