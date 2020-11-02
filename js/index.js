'use strict';

// Main
$(document).ready(() => {
  headline();
  init();
  mobile();
  transizioni();
  preview();
  tips();
  tracker();
  tornaSu();
  vr();
});

/**
 * Funzione gestione inizializzazione API
 * @param {object} iframe Nodo DOM del lettore
 * @param {string} version Versione APP
 * @param {string} urlid ID Modello
 * @param {object} client Lettore modello
 */
function caricaModello(iframe, version, urlid, client) {
  let cliccato = false;

  client = new Sketchfab(version, iframe);

  client.init(urlid, {
    success: function onSuccess(api) {
      api.load();
      api.start();
      api.addEventListener('viewerready', () => {
        // Dichiarazione Variabili
        let durata = 3;
        let fattore = 0.3;
        let minRadius = 5;
        let maxRadius = 10;

        $('#api-frame').removeClass('invisibile');
        $('#cover-3d').addClass('animated fadeOut')
        .delay(500).addClass('nascosto');
        $('#container-3d button').addClass('visibile');
        // INIZIO DEBUGGING
        /* $(document).on('mousemove', () => {
          api.getCameraLookAt( function(err, camera) {
              console.log(camera.position);
              console.log(camera.target);
          });
        });
 
        api.getAnnotationList(function(err, annotations) {
          console.log(annotations);
        }); */
        // FINE DEBUGGING

        // Animazioni
        api.lookat(
          [-222, -190, 148],
          [14, -14, -31],
          durata
        );
        
        setTimeout(function() {
          api.lookat(
            [194, -195, 182],
            [0, -48, 42],
            durata
          );
        }, 3000);
        setTimeout(function() {
          api.lookat(
            [-6, -277, 66],
            [0, -47, 42],
            3
          );
        }, 6000);
        setTimeout(function() {
          api.lookat(
            [-160, -164, 115],
            [3, -33, 15],
            durata
          );
        }, 9000);
        setTimeout(function() {
          api.gotoAnnotation(0);
        }, 10000);

        // Screenshot
        $('#screenshot').on('click tap', () => {
          api.getScreenShot((err, result) => {
            if (!err) {
              let height = $('#api-frame').height();
              let width = $('#api-frame').width();
              let popup = window.open(result, '_blank',
              'height = '+ height +', width = '+ width +
              'fullscreen=no, '+
              'toolbar=no, '+
              'status=no, '+
              'menubar=no, '+
              'scrollbars=no, '+
              'resizable=yes, '+
              'directories=no, '+
              'location=no, '+
              'left='+ (($(window).width() / 2) - (width / 2)) +', '+
              'top='+ (($(window).height() / 2) - (height / 2)) +', '+
              'screenX='+ (($(window).width() / 2) - (width / 2)) +', '+
              'screenY='+ (($(window).height() / 2) - (height / 2)) +'');

              popup.document
              .write('<body style="margin: 0; padding: 0;">'+
              '<img src="'+ result +'" alt="3D Screenshot" />'+
              '<a href="'+ result +'" style="background-color: gray; color: black; bottom: 0; font-family: Arial, Helvetica, sans-serif; padding: 1em 16px; position: absolute; right: 0; text-transform: uppercase; text-decoration: none;" download>'+
              'Download'+
              '</a>'+
              '</body>');
            }
          });
        });
        // Zoom
        api.zoom = (fattore, durata, minRadius, maxRadius) => {
          api.getCameraLookAt((err, camera) => {
            if (!err) {
              let posizioneAttuale = camera.position;
              let x = posizioneAttuale[0];
              let y = posizioneAttuale[1];
              let z = posizioneAttuale[2];
              let target = camera.target;
              let rho = Math.sqrt((x * x) + (y * y) + (z * z)), phi, theta;

              if (isNaN(minRadius)) {
                  minRadius = 0.1;
              }

              if (isNaN(maxRadius)) {
                  maxRadius = Infinity;
              }

              if (rho === minRadius || rho === maxRadius) {
                  return;
              }

              rho = (rho * fattore);

              if (rho < minRadius && fattore < 1) {
                  rho = minRadius;
              } else if (rho > maxRadius && fattore > 1) {
                  rho = maxRadius;
              }

              phi = Math.atan2(y, x);
              theta = Math.atan2((Math.sqrt((x * x) + (y * y))), z);
              x = (rho * Math.sin(theta) * Math.cos(phi));
              y = (rho * Math.sin(theta) * Math.sin(phi));
              z = (rho * Math.cos(theta));

              api.setCameraLookAt([x, y, z], target, durata);
            }
          });
        };
        $('#zoom-in').on('click tap', () => {
          api.zoom(1 - fattore, durata, minRadius, maxRadius);
        });
        $('#zoom-out').on('click tap', () => {
          api.zoom(1 + fattore, durata, minRadius, maxRadius);
        });
      });
    },
    error: function onError(callback) {
      $('#container-3d').append(callback);
    },
    annotation_cycle: 0,
    annotations_visible: 0,
    autospin: 0,
    autostart: 1,
    camera: 1,
    fps_speed: 60,
    preload: 1,
    ui_stop: 0,
    transparent: 1,
  });
}

/**
 * Funzione Gestione Headline
 */
function headline() {
  $(window).on('resize', function() {
    if ($(this).width() >= 992) {
      $('#modale').removeClass('nascondi').appendTo('#headline');
      $('.tip').on('mouseover', function() {
        $('#modale #name').html($(this).attr('data-name'));
        $('#modale #mark').html($(this).attr('data-mark'));
        $('#modale #prezzo').html($(this).attr('data-price'));
        $('#modale #anteprima img')
        .attr('src', 'img/'+ $(this).attr('data-image'));
        $('#modale #height').html($(this).attr('data-height'));
        $('#modale #width').html($(this).attr('data-width'));
        $('#modale #deep').html($(this).attr('data-deep'));
        $('#modale #sh').html($(this).attr('data-sh'));
        $('#modale #weight').html($(this).attr('data-weight'));
        // Se il selettore è oltre la metà della finestra
        if ($(this).offset().left > ($(window).width() / 2 - 60)) {
          $('#modale').css({
            'left': $(this).offset().left - (($('#modale').width() / 3) * 2),
            'top': $(this).offset().top - 150,
          });
        } else {
          $('#modale').css({
            'left': $(this).offset().left + 60,
            'top': $(this).offset().top - 500,
          });
        }
        $('#modale').addClass('sopra').delay(300).addClass('visibile');
      });
      $('#modale').hover(function() {}, function() {
        $(this).removeClass('visibile').delay(300).removeClass('sopra');
      });
    } else {
      $('#modale').insertAfter('#headline');
      $('.tip').on('click tap', function() {
        $('#modale #name').html($(this).attr('data-name'));
        $('#modale #mark').html($(this).attr('data-mark'));
        $('#modale #prezzo').html($(this).attr('data-price'));
        $('#modale #anteprima img')
        .attr('src', 'img/'+ $(this).attr('data-image'));
        $('#modale #height').html($(this).attr('data-height'));
        $('#modale #width').html($(this).attr('data-width'));
        $('#modale #deep').html($(this).attr('data-deep'));
        $('#modale #sh').html($(this).attr('data-sh'));
        $('#modale #weight').html($(this).attr('data-weight'));

        document.location.href='#modale';
        
        if ($(this)[0].hasAttribute('active')) {
          setTimeout(() => {
            $('#modale').removeClass('visibile');
          }, 300);

          $('#modale').removeClass('mostra');
          $('#modale').removeClass('sopra');
          $(this).removeAttr('active');
        } else {
          $('.tip').removeAttr('active');
          $(this).attr('active', '');
          $('#modale').addClass('sopra');
          $('#modale').addClass('mostra');

          setTimeout(() => {
            $('#modale').addClass('visibile');
          }, 300);
        }
      });
    }
  }).resize();
}

/**
 * Funzione Inizializzazioni
 */
function init() {
  // Dichiarazione variabili
  const iframe = $('#api-frame')[0];
  const version = '1.0.0';
  const urlid = 'eca67bc2813e4d24b7d25d52b241fe76';
  let client = null;

  // Preloader
  Pace.on('done', () => {
    $('#loading img').addClass('animated fadeOutDown');
    $('#loading').fadeOut();
  });

  // Sketchfab
  caricaModello(iframe, version, urlid, client);

  $('#carica').on('click tap', () => {
    caricaModello(iframe, version, urlid, client);

    if ($('#api-frame').hasClass('invisibile')) {
      $('#api-frame').removeClass('invisibile');
    }
  });
  
  // Carousel
  initCarousel();
}

/**
 * Funzione Inizializzazione Carousel
 */
function initCarousel() {
  $('.owl-carousel').owlCarousel({
    loop: false,
    center: false,
    margin: 32,
    stagePadding: 32,
    autoWidth: false,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayHoverPause: true,
    rewind: true,
    items: 1,
    responsive: {
      0: {
        items: 1,
        slideBy: 1,
      },
      992: {
        items: 2,
        slideBy: 2,
      },
    },
  });
}

/**
 * Funzione Gestione Responsive
 */
function mobile() {
  $(window).on('load resize', function() {
    if ($(window).width() < 992) {
      $('#container-sedia-360')
        .insertAfter($('#container-scopri'));
      $('#sedia-colore').insertAfter($('#colori article h2'));
      $('.progetto-sx img').appendTo('#progetto-mobile-1');
      $('.progetto-dx img, .progetto-dx-1 img').appendTo('#progetto-mobile-2');
      $('#container-logo-1').insertBefore('#info');
      $('#sedia-360 img').attr({
        'src': '/img/360-3-mobile/cassettiera-1.jpg',
        'data-images': '/img/360-3-mobile/cassettiera-#.jpg',
      });
      $('#claim-carousel').insertAfter('#container-sedia-360');
    } else {
      $('#container-scopri')
        .insertAfter($('#container-sedia-360'));
      $('#sedia-colore').appendTo('#colori > .disattiva');
      $('#progetto-mobile-1 img').appendTo('.progetto-sx');
      $('#progetto-mobile-2 img').appendTo('.progetto-dx');
      $('#container-logo-1').insertAfter('#info');
      $('#sedia-360 img').attr({
        'src': '/img/360-3/cassettiera-1.jpg',
        'data-images': '/img/360-3/cassettiera-#.jpg',
      });
      $('#claim-carousel').insertAfter('#sedia-1 + .owl-carousel');
    }
  });
}

/**
 * Funzione Gestione pannello tips VR
 */
function tips() {
  let aperto = false;

  $('#tips h2').removeClass('aperto');
  $('#tips article p, #explore').slideUp();
  $('.freccia').on('click tap', function() {
    if (aperto) {
      $(this).removeClass('attiva');
      $('#tips h2').removeClass('aperto');
      $('#tips article p, #explore').slideUp();
      
      aperto = false;
    } else {
      $(this).addClass('attiva');
      $('#tips h2').addClass('aperto');
      $('#tips article p, #explore').slideDown();

      aperto = true;
    }
  });
}

/**
 * Funzione Gestione preview
 */
function preview() {
  $('.selettore').on('click tap', function() {
    let id = $('.selettore-colore', this).attr('data-id');
    let tipo = $('.selettore-colore', this).attr('data-type');

    $(this).parent().find('.selettore-colore')
      .removeClass('selezionato deselezionato');
    $('.selettore-colore', this).addClass('selezionato');
    $(this).parent().find('.selettore-colore:not(".selezionato")')
      .addClass('deselezionato');
    $('.anteprima-sezione[data-type="' + tipo + '"]')
      .attr('style', 'background-image: url("img/anteprima/prosp/prosp_' +
        tipo + '_' + id + '.png");');
    $('.anteprima-fronte-sezione[data-type="' + tipo + '"]')
      .attr('style', 'background-image: url("img/anteprima/front/front_' +
        tipo + '_' + id + '.png");');
    $('.anteprima-lato-sezione[data-type="' + tipo + '"]')
      .attr('style', 'background-image: url("img/anteprima/side/side_' +
        tipo + '_' + id + '.png");');
  });
}

/**
 * Funzione Gestione Slider 360
 */
function tracker() {
  let oldRange = 0;

  $(document).on('input', '#sedia-range', function() {
    let range = $(this).val();

    if (range < 0 && range >= -360) {
      if (range < oldRange) {
        // Definisce l'ampiezza di rotazione
        let i = 4;

        do {
          $('#sedia-360 img').trigger('stepLeft');

          i--;
        } while (i > 1);
      } else {
        let i = 4;

        do {
          $('#sedia-360 img').trigger('stepRight');

          i--;
        } while (i > 1);
      }
    } else if (range > 0 && range <= 360) {
      if (range > oldRange) {
        let i = 4;

        do {
          $('#sedia-360 img').trigger('stepLeft');

          i--;
        } while (i > 1);
      } else {
        let i = 4;

        do {
          $('#sedia-360 img').trigger('stepRight');

          i--;
        } while (i > 1);
      }
    }
    oldRange = range;
  });
}

/**
 * Funzione Gestione transizioni
 */
function transizioni() {
  $(window).on('scroll', function() {
    if ($(window).width() >= 992) {
      $('#sedia-360, #spin, #sedia-1, #discover h3').addClass('sfuma');
      $('#sedia-2, .discover-lato-2 p, .colore, #container-progetti')
        .addClass('sfuma');
      if ($(this).scrollTop() >= $('#headline').offset().top +
        $('#headline').outerHeight()) {
        $('#sedia-360, #spin').removeClass('sfuma');
        $('#sedia-360').addClass('animated fadeIn');
        $('#spin').addClass('animated flipInY');
      }
      if (($('#vr').length > 0) && ($(this).scrollTop() >=
          ($('#vr').offset().top + $('#vr').outerHeight() / 2))) {
        $('#sedia-360, #spin').removeClass('sfuma');
        $('#sedia-360').addClass('animated fadeIn');
        $('#spin').addClass('animated flipInY');
      }
      if (($('#preview').length > 0) && ($(this).scrollTop() >=
          $('#preview').offset().top + $('#preview').outerHeight() / 2)) {
        $('#sedia-1, #discover h3').removeClass('sfuma');
        $('#sedia-1').addClass('animated fadeInLeft');
        $('#discover h3').addClass('animated fadeInRight');
      } else if ($(this).scrollTop() >= $('#discover').offset().top) {
        $('#sedia-1, #discover h3').removeClass('sfuma');
        $('#sedia-1').addClass('animated fadeInLeft');
        $('#discover h3').addClass('animated fadeInRight');
      }
      if (($('#discover').length > 0) && ($(this).scrollTop() >=
          ($('#discover').offset().top + $('#discover').outerHeight() / 2))) {
        $('#container-progetti').removeClass('sfuma');
        $('#container-progetti').addClass('animated fadeInLeft');
      }
    } else {
      $('#sedia-360, #spin, #sedia-1, #discover h3').removeClass('sfuma');
      $('#sedia-2, .discover-lato-2 p, .colore, #container-progetti')
        .removeClass('sfuma');
    }
  });
}

/**
 * Funzione gestione torna su
 */
function tornaSu() {
  $(window).on('scroll', function() {
    if ($(this).scrollTop() > 0) {
      $('.torna-su').fadeIn();
      $('.torna-su').removeClass('nascondi');
    } else {
      $('.torna-su').fadeOut();
    }
  });
  $('.torna-su').on('click tap', () => {
    $('html, body').animate({
      scrollTop: 0,
    }, 'fast');
  });
}

/**
 * Funzione Gestione VR
 */
function vr() {
  $('a-scene').on('exit-vr', function() {
    window.location.reload();
  });
}