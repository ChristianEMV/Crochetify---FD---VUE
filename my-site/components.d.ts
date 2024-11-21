
export {}

declare module 'vue' {
  export interface GlobalComponents {
    BAlert: typeof import('bootstrap-vue-next/components/BAlert')['BAlert']
    BButton: typeof import('bootstrap-vue-next/components/BButton')['BButton']
    BCard: typeof import('bootstrap-vue-next/components/BCard')['BCard']
    BCardBody: typeof import('bootstrap-vue-next/components/BCard')['BCardBody']
    BCardImg: typeof import('bootstrap-vue-next/components/BCard')['BCardImg']
    BCol: typeof import('bootstrap-vue-next/components/BContainer')['BCol']
    BCollapse: typeof import('bootstrap-vue-next/components/BCollapse')['BCollapse']
    BForm: typeof import('bootstrap-vue-next/components/BForm')['BForm']
    BFormCheckboxGroup: typeof import('bootstrap-vue-next/components/BFormCheckbox')['BFormCheckboxGroup']
    BFormGroup: typeof import('bootstrap-vue-next/components/BFormGroup')['BFormGroup']
    BFormInput: typeof import('bootstrap-vue-next/components/BFormInput')['BFormInput']
    BFormSelect: typeof import('bootstrap-vue-next/components/BFormSelect')['BFormSelect']
    BImg: typeof import('bootstrap-vue-next/components/BImg')['BImg']
    BModal: typeof import('bootstrap-vue-next/components/BModal')['BModal']
    BPagination: typeof import('bootstrap-vue-next/components/BPagination')['BPagination']
    BRow: typeof import('bootstrap-vue-next/components/BContainer')['BRow']
    BSpinner: typeof import('bootstrap-vue-next/components/BSpinner')['BSpinner']
    BTable: typeof import('bootstrap-vue-next/components/BTable')['BTable']
    CardInfo: typeof import('./src/components/CardInfo.vue')['default']
    Grafic: typeof import('./src/components/Grafic.vue')['default']
    IconCommunity: typeof import('./src/components/icons/IconCommunity.vue')['default']
    IconDocumentation: typeof import('./src/components/icons/IconDocumentation.vue')['default']
    IconEcosystem: typeof import('./src/components/icons/IconEcosystem.vue')['default']
    IconSupport: typeof import('./src/components/icons/IconSupport.vue')['default']
    IconTooling: typeof import('./src/components/icons/IconTooling.vue')['default']
    Navbar: typeof import('./src/components/Navbar.vue')['default']
    ProductTable: typeof import('./src/components/ProductTable.vue')['default']
    RouterLink: typeof import('vue-router')['RouterLink']
    RouterView: typeof import('vue-router')['RouterView']
    ShipmentsComponent: typeof import('./src/components/ShipmentsComponent.vue')['default']
    Sidebar: typeof import('./src/components/Sidebar.vue')['default']
    UsersComponent: typeof import('./src/components/UsersComponent.vue')['default']
  }
}
