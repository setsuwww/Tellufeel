import CreateConfessionView from './CreateConfessionView.vue'

describe('<CreateConfessionView />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(CreateConfessionView)
  })
})