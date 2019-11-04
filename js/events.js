jQuery(function() {
  function getFilter(option) {
    const filter = option.dataset.filter;
    return filter;
  }

  function getUrl() {
    const url = new URL(location.href);
    return url;
  }

  function getParams(url) {
    const params = new URLSearchParams(url.search.slice(1));
    return params;
  }

  function setUrlParams(url, params, key, value) {
    url.searchParams.set(key.toLowerCase(), value);
    window.location.href = url;
  }

  function applyFilters() {
    const $filters = jQuery(".events__filter__option");
    if ($filters) {
      $filters.each((i, filter) => {
        jQuery(filter).on("change", function(e) {
          const value = encodeURI(e.target.value);
          const filterTitle = getFilter(e.target);
          const url = getUrl();
          const params = getParams(url);
          setUrlParams(url, params, filterTitle.toLowerCase(), value);
        });
      });
    }
  }

  function toggleMobileEventsNav(className, toggleTarget) {
    const $eventsNavToggle = jQuery(className);
    const $eventsNav = jQuery(toggleTarget);
    if ($eventsNavToggle && $eventsNav) {
      $eventsNavToggle.on("click", function(e) {
        e.preventDefault();
        $eventsNav.slideToggle();
        if (/show/gi.test($eventsNavToggle[0].innerText)) {
          $eventsNavToggle[0].innerText = "Hide Filters";
        } else if (/hide/gi.test($eventsNavToggle[0].innerText)) {
          $eventsNavToggle[0].innerText = "Show Filters";
        }
      });
    }
  }

  function eventsMobileNav() {
    const $viewOptions = jQuery(".events__nav--mobile select");
    if ($viewOptions) {
      $viewOptions.on("change", function(e) {
        const url = getUrl();
        const params = getParams(url);
        setUrlParams(url, params, "view", this.value);
      });
    }
  }

  function setHeightOfDivs(selector) {
    let t = 0;
    let t_elem;
    const $cards = jQuery(selector);
    if ($cards) {
      $cards.each(function() {
        $this = jQuery(this);
        $this.css("min-height", "0");
        if ($this.outerHeight() > t) {
          t_elem = $this;
          t = $this.outerHeight();
        }
      });
      $cards.each(function() {
        jQuery(this).css("min-height", t_elem.outerHeight());
      });
    }
  }

  function toggleVisibility(selector, value, hidden) {
    selector.val(value);
    if (hidden) {
      selector
        .parent()
        .parent()
        .removeClass("event-creator__hidden");
      return;
    }
    selector
      .parent()
      .parent()
      .addClass("event-creator__hidden");
  }

  function toggleLocationType() {
    const $locationTypeInput = jQuery("#location-type");
    const $locationAddress = jQuery("#location-address");
    const $locationNameLabel = jQuery("#location-name-label");
    const $countryLabel = jQuery("#location-country-label");
    $locationTypeInput.on("change", function() {
      $this = jQuery(this);
      if ($this.val() === "online") {
        toggleVisibility($locationAddress, "Online", false);
        $locationNameLabel.text("Online Meeting Link");
        $countryLabel.text("Where is this event based?");
        return;
      }
      toggleVisibility($locationAddress, "", true);
      $locationNameLabel.text("Location Name");
      $countryLabel.text("Country");
    });
  }

  function clearErrors(input) {
    input.one("focus", function() {
      const $this = jQuery(this);
      const input_id = $this.attr("id");
      const $label = jQuery(`label[for=${input_id}]`);
      $this.removeClass("event-creator__error");
      $label.removeClass("event-creator__error-text");
    });
  }

  function checkInputs(inputs) {
    let $allClear = true;
    inputs.each(function() {
      const $this = jQuery(this);
      clearErrors($this);
      $allClear = validateCpg($allClear);
      const input_id = $this.attr("id");
      if (!$this.val() || $this.val() === "00:00" || $this.val() === "0") {
        const $label = jQuery(`label[for=${input_id}]`);
        $label.addClass("event-creator__error-text");
        $this.addClass("event-creator__error");
        $allClear = false;
      }
    });

    return $allClear;
  }

  function validateCpg(allClear) {
    const $cpgCheck = jQuery("#cpg");
    if ($cpgCheck.length && !$cpgCheck.prop("checked")) {
      const $label = jQuery("label[for=cpg]");
      $label.addClass("event-creator__error-text");
      $cpgCheck.one("change", function() {
        $label.removeClass("event-creator__error-text");
      });
      allClear = false;
    }
    return allClear;
  }

  function updateRedirect() {
    const $eventName = jQuery("#event-name");
    const $redirect = jQuery("input[name=redirect_to]");
    if (!$redirect.val() && $eventName.length) {
      $redirect.val(
        window.location.origin + "/events/" + $eventName.val().replace(" ", "-")
      );
    }
  }

  function validateForm() {
    const $eventForm = jQuery("#event-form");
    if ($eventForm) {
      const $requiredInputs = jQuery("input,textarea,select").filter(
        "[required]"
      );
      const $submitBtn = $eventForm.find("#event-creator__submit-btn");
      $submitBtn.on("click", function(e) {
        e.preventDefault();
        const allClear = checkInputs($requiredInputs);
        if (allClear) {
          updateRedirect();
          $eventForm.submit();
        }
      });
    }
  }

  function clearImage() {
    const $deleteBtn = jQuery("#image-delete");
    const $photoUpload = jQuery("#group-photo-uploader");
    const $imageInput = jQuery("#image-url");
    if ($deleteBtn.length) {
      $deleteBtn.on("click", function(e) {
        e.preventDefault();
        $photoUpload.css("background-image", "").css("background-size", "");
        $imageInput.val("");
        $deleteBtn.hide();
      });
    }
  }

  function toggleInputAbility(input, typeValue) {
    if (input.prop("disabled") !== false) {
      input.attr("disabled", false);
      if (typeValue) {
        input.val(typeValue);
      }
      return;
    }
    input.prop("disabled", true);
  }

  function toggleLocationContainer(container, location, country, typeValue) {
    container.toggleClass("event-creator__location-edit");
    toggleInputAbility(location, typeValue);
    toggleInputAbility(country);
  }

  function clearPrePopErrors(container, selector) {
    const $errors = container.find("." + selector);
    if ($errors.length) {
      $errors.each(function() {
        const $this = jQuery(this);
        $this.removeClass(selector);
      });
    }
  }

  function handleAutocomplete(container, location, country, typeValue) {
    jQuery("#location-name").on("autocompleteselect", function(e) {
      clearPrePopErrors(container, "event-creator__error");
      clearPrePopErrors(container, "event-creator__error-text");
      toggleLocationContainer(container, location, country, typeValue);
      container.addClass("event-creator__location-edit");
    });
  }

  function editLocation() {
    const $editBtn = jQuery("#em-location-reset a");
    const $editContainer = jQuery(".event-creator__location");
    const $countryInput = jQuery("#location-country");
    const $locationType = jQuery("#location-type");
    const $locationTypeValue = $locationType.val();
    if ($editBtn) {
      handleAutocomplete(
        $editContainer,
        $countryInput,
        $locationType,
        $locationTypeValue
      );
      $editBtn.on("click", function() {
        toggleLocationContainer(
          $editContainer,
          $countryInput,
          $locationType,
          $locationTypeValue
        );
      });
    }
  }

  function toggleLightboxVisibility(lightbox) {
    lightbox.toggleClass("lightbox-show");
  }

  function toggleLightbox(lightboxID, openBtnID, closeBtnID, firstSelector) {
    const $lightbox = jQuery(lightboxID);
    if ($lightbox) {
      const $openBtn = jQuery(openBtnID);
      const $closeBtn = jQuery(closeBtnID);
      const $firstBtn = $lightbox.find(firstSelector).first();
      $openBtn.on("click", function() {
        toggleLightboxVisibility($lightbox);
        $firstBtn.focus();
        jQuery("body").addClass("noscroll");
      });
      $closeBtn.on("click", function() {
        $openBtn.focus();
        toggleLightboxVisibility($lightbox);
        jQuery("body").removeClass("noscroll");
      });
      const $lastBtn = jQuery(firstSelector).last();
      trapFocus($closeBtn, $lastBtn);
      closeByKeyboard($lightbox);
    }
  }

  function closeByKeyboard($lightbox) {
    $lightbox.on("keyup", e => {
      e.preventDefault();
      if (e.keyCode === 27) {
        toggleLightboxVisibility($lightbox);
        jQuery("body").removeClass("noscroll");
      }
    });
  }

  function trapFocus($closeBtn, $lastBtn) {
    $closeBtn.on("keydown", e => {
      if (e.keyCode === 9 && e.shiftKey) {
        e.preventDefault();
        $lastBtn.focus();
      }
    });

    $lastBtn.on("keydown", function(e) {
      if (e.keyCode === 9 && !e.shiftKey) {
        e.preventDefault();
        $closeBtn.focus();
      }
    });
  }

  function init() {
    toggleMobileEventsNav(".events__nav__toggle", ".events__nav");
    toggleMobileEventsNav(".events__filter__toggle", ".events__filter");
    eventsMobileNav();
    applyFilters();
    window.addEventListener("resize", function() {
      setHeightOfDivs(".events__tags");
      setHeightOfDivs(".event-card__description");
    });
    setHeightOfDivs(".events__tags");
    setHeightOfDivs(".event-card__description");
    toggleLocationType();
    validateForm();
    clearImage();
    editLocation();
    toggleLightbox(
      "#attendees-lightbox",
      "#open-attendees-lightbox",
      "#close-attendees-lightbox",
      ".events-single__username a"
    );
    toggleLightbox(
      "#events-share-lightbox",
      "#open-events-share-lightbox",
      "#close-events-share-lightbox",
      "a"
    );
  }

  init();
});
