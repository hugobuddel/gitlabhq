let hasUserDefinedProjectPath = false;

const deriveProjectPathFromUrl = ($projectImportUrl, projectPath) => {
  if (hasUserDefinedProjectPath) {
    return;
  }

  let importUrl = $projectImportUrl.val().trim();
  if (importUrl.length === 0) {
    return;
  }

  /*
    \/?: remove trailing slash
    (\.git\/?)?: remove trailing .git (with optional trailing slash)
    (\?.*)?: remove query string
    (#.*)?: remove fragment identifier
  */
  importUrl = importUrl.replace(/\/?(\.git\/?)?(\?.*)?(#.*)?$/, '');

  // extract everything after the last slash
  const pathMatch = /\/([^/]+)$/.exec(importUrl);
  if (pathMatch) {
    const projectPathInputs = document.querySelectorAll(projectPath);
    projectPathInputs.forEach((el) => {
      const input = el;
      input.value = pathMatch[1];
    });
  }
};

const bindEvents = () => {
  const $newProjectForm = $('#new_project');
  const $projectImportUrl = $('#project_import_url');
  const $projectPath = $('#project_path');
  const $useTemplateBtn = $('.template-button > input');
  const $projectFieldsForm = $('.project-fields-form');
  const $selectedTemplateText = $('.selected-template');
  const $changeTemplateBtn = $('.change-template');
  const $selectedIcon = $('.selected-icon svg');
  const $templateProjectNameInput = $('#template-project-name #project_path');

  if ($newProjectForm.length !== 1) {
    return;
  }

  $('.how_to_import_link').on('click', (e) => {
    e.preventDefault();
    $(e.currentTarget).next('.modal').show();
  });

  $('.modal-header .close').on('click', () => {
    $('.modal').hide();
  });

  $('.btn_import_gitlab_project').on('click', () => {
    const importHref = $('a.btn_import_gitlab_project').attr('href');
    $('.btn_import_gitlab_project').attr('href', `${importHref}?namespace_id=${$('#project_namespace_id').val()}&path=${$projectPath.val()}`);
  });

  function chooseTemplate() {
    $('.template-option').hide();
    $projectFieldsForm.addClass('selected');
    $selectedIcon.removeClass('active');
    const value = $(this).val();
    const templates = {
      rails: {
        text: 'Ruby on Rails',
        icon: '.selected-icon .icon-rails',
      },
      express: {
        text: 'NodeJS Express',
        icon: '.selected-icon .icon-node-express',
      },
      spring: {
        text: 'Spring',
        icon: '.selected-icon .icon-java-spring',
      },
    };

    const selectedTemplate = templates[value];
    $selectedTemplateText.text(selectedTemplate.text);
    $(selectedTemplate.icon).addClass('active');
    $templateProjectNameInput.focus();
  }

  $useTemplateBtn.on('change', chooseTemplate);

  $changeTemplateBtn.on('click', () => {
    $('.template-option').show();
    $projectFieldsForm.removeClass('selected');
    $useTemplateBtn.prop('checked', false);
  });

  $newProjectForm.on('submit', () => {
    $projectPath.val($projectPath.val().trim());
  });

  $projectPath.on('keyup', () => {
    hasUserDefinedProjectPath = $projectPath.val().trim().length > 0;
  });

  $projectImportUrl.keyup(() => deriveProjectPathFromUrl($projectImportUrl, '#project_path'));
};

document.addEventListener('DOMContentLoaded', bindEvents);

export default {
  bindEvents,
  deriveProjectPathFromUrl,
};
