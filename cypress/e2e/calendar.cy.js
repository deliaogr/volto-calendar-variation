import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Calendar Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Add Calendar', () => {
    // Change page title
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Calendar Page');

    cy.get('.documentFirstHeading').contains('Calendar Page');

    cy.getSlate().click();

    // Add listing
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get(".blocks-chooser .ui.form .field.searchbox input[type='text']").type(
      'listing',
    );
    cy.get('.button.listing').click({ force: true });

    // Select Calendar variation
    cy.get(
      '.inline.field.field-wrapper-variation .ui.grid .react-select__value-container',
    ).click();
    cy.get('.react-select__option').contains('Calendar').click();

    // Select Event type
    cy.contains('Add criteria').click();
    cy.get('.react-select__menu').contains('Type').click();

    cy.get(
      '#default-query-0-querystring .fields .field .react-select-container',
    )
      .contains('Select')
      .click();
    cy.get('.react-select__menu').contains('Event').click();

    // Select relative path
    cy.contains('Add criteria').click();
    cy.get('.react-select__menu').contains('Location').click();

    cy.contains('Absolute path').click();
    cy.get('.react-select__menu').contains('Relative path').click();

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // Then the page view should contain the calendar
    cy.contains('Calendar Page');
    cy.get('.block.listing.calendar');

    // Create an event
    cy.createContent({
      contentType: 'Event',
      contentId: 'event-1',
      contentTitle: 'Event 1',
      path: 'cypress/my-page',
    });

    cy.reload();

    // Verify that the event is displayed in the calendar
    // It should be an hour event initially
    cy.contains('Event 1').get('.task.task--timed');
    cy.get('.edit').click();
    cy.wait(300);

    // Modify the event
    cy.get('.task').click();
    cy.contains('Whole Day').click();
    cy.get('.modal .actions button.ui.basic.circular.primary.right').click();

    // Check that the event has been modified
    cy.get('.task.task--active-full-day, .task.task--past-full-day');
  });
});
