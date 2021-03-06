// ==UserScript==
// @name         PokeLifeScript: AntyBan Edition
// @version      7.0.0
// @description  Dodatek do gry Pokelife
// @match        https://gra.pokelife.pl/*
// @downloadURL  https://github.com/JakubMrowca/pokelifeAnty/raw/master/PokeLifeScript.user.js
// @updateURL    https://github.com/JakubMrowca/pokelifeAnty/raw/master/PokeLifeScript.user.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_notification
// @require      https://cdnjs.cloudflare.com/ajax/libs/iScroll/5.2.0/iscroll-lite.js
// @require      https://bug7a.github.io/iconselect.js/sample/lib/control/iconselect.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.5.0/js/md5.min.js
// @require      https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.min.js
// @resource     color_picker_CSS  https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/nano.min.css
// @resource     customCSS_global  https://raw.githubusercontent.com/JakubMrowca/pokelifeAnty/master/assets/global.css?ver=7
// @resource     customCSS_style  https://raw.githubusercontent.com/JakubMrowca/pokelifeAnty/master/assets/style_0.css?ver=2
// ==/UserScript==



// Wszystkie funkcje od góry:
//
//     initSkins
//     initPodmianaObrazkow
//     initAutoGo
//     initAutoGoSettings
//     initVersionInfo
//     initAutouzupelnianieFormularzy
//     initShinyWidget
//     initPlecakTMView
//     initPlecakTrzymaneView
//     initSzybkieKlikanieWLinkiPromocyjne
//     initStatystykiLink
//     initLogger
//     initWbijanieSzkoleniowca
//     initChat
//     initPokemonyLiga
//     initZadaniaWidget
//     initPokemonDniaWidget
//     initPrzypomnienieOPracy
//     initWystawView
//     initRozbudowanyOpisDziczy
//     initPrzypomnienieORepelu
//     initSprawdzCzyMaszAktualnaWersjeBota
//     initPrzypomnienieOOpiece



// **********************
//
// zmienne globalne
//
// **********************

var config = new Object();
var AutoGoSettings = new Object();
var autoGo;
var previousPageContent = null;
var pokemonData;
var region;
var zarobek;
var lastSeeShoutId;
var timeoutMin = 300;
var timeoutMax = 400;
var styles = [];
var domain = "https://bra2ns.pl/"


var activeScript = [];
var run;
var throwCommand = null;
var actionCommand = null;



// **********************
//
// funkcja do zapisu do bazy
//
// **********************

function requestDomainPost(url, data, callback) {
   return;
}

function requestDomain(url, callback) {
    return;
}

function updateConfig(config, callback) {
    console.log("------------");
    console.log(config);
    console.log("------------");
    requestDomainPost("pokelife/api/update_config_post.php?login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim(), JSON.stringify(config), callback != undefined ? function() { callback.call() } : null);
}



// **********************
//
// eventy do wykorzystania przy pisaniu dodatków
//
// **********************

window.onReloadSidebarFunctions = [];

function onReloadSidebar(fn) {
    window.onReloadSidebarFunctions.push(fn);
}

function updateStats(){
return;}

window.onReloadMainFunctions = [];

function onReloadMain(fn) {
    window.onReloadMainFunctions.push(fn);
}

window.afterReloadMainFunctions = [];

function afterReloadMain(fn) {
    window.afterReloadMainFunctions.push(fn);
}

function getPreviousPageContent() {
    return previousPageContent;
}


var rnd = Math.floor(Math.random() * 10);
var audio = new Audio('https://www.bra2ns.pl/pokelife/stats/assets/pokemon_info.mp3');
if (rnd == 6) {
    audio = new Audio('https://www.bra2ns.pl/pokelife/stats/assets/pokemon_lavendercity.mp3');
}

function triggerSound() {
    audio.play();
    audio.volume = 0.4;
}

function stopSound() {
    audio.pause();
    audio.currentTime = 0;
}


// **********************
//
// loggery
//
// **********************
// **********************
//
// nadpisanie glownych funkcji jQuery i funkcji gry
//
// **********************

function reloadMain(selector, url, callback, callback2) {
    previousPageContent = $('body').html();
    $.get(url, function(data) {
        var THAT = $('<div>').append($(data).clone());
        window.onReloadMainFunctions.forEach(function(item) {
            item.call(THAT, url);
        })
        if (callback2 != undefined && callback2 != null) {
            callback2.call(THAT, url);
        }
        var html2 = THAT.html().replace('<script src="js/okno_glowne_reload.js"></script>', "").replace("http://api.jquery.com/scripts/events.js", "https://gra.pokelife.pl/js/zegar.js").replace("$(\"#glowne_okno\").load('gra/stowarzyszenie.php?p=2&id_budynku='++'&pozycja_x='+$( \"#buduj\" ).position().left/16+'&pozycja_y='+$( \"#buduj\" ).position().top/16+'&nic');", "");
        $("" + selector).html(html2);

        if (url.indexOf("napraw") != -1) {
            $("html, body").animate({ scrollTop: 0 }, "fast");
        }
        $.get('inc/stan.php', function(data) {
            $("#sidebar").html(data);
            window.afterReloadMainFunctions.forEach(function(item) {
                item.call();
            })
            if (callback != undefined && callback != null) {
                callback.call();
            }
        });
    });
}

function reloadMainPOST(selector, url, postData, callback, callback2) {
    previousPageContent = $('body').html();
    $.ajax({
        type: 'GET',
        url: url,
        data: {
            postData: postData
        },
        success: function(data) {
            var THAT = $('<div>').append($(data).clone());
            window.onReloadMainFunctions.forEach(function(item) {
                item.call(THAT, url);
            })
            if (callback2 != undefined && callback2 != null) {
                callback2.call(THAT, url);
            }
            $("" + selector).html(THAT.html().replace('<script src="js/okno_glowne_reload.js"></script>', ""));
            $.get('inc/stan.php', function(data) {
                $("#sidebar").html(data);
                window.afterReloadMainFunctions.forEach(function(item) {
                    item.call();
                })
                if (callback != undefined && callback != null) {
                    callback.call();
                }
            });
        }
    });
}

var pa_before = $('#sidebar .progress-bar:contains("PA")').attr("aria-valuenow");
const oldShow = jQuery.fn.html
jQuery.fn.html = function() {
    const ret = oldShow.apply(this, arguments)
    var THAT = this;
    if (this.selector == "#sidebar") {
        var pa_after = this.find('.progress-bar:contains("PA")').attr("aria-valuenow");

        if (Number(pa_after) < Number(pa_before)) {
            updateStats("wyklikanych_pa", Number(pa_before) - Number(pa_after));
        }
        pa_before = pa_after;

        if (typeof window.onReloadSidebarFunctions != undefined) {
            window.onReloadSidebarFunctions.forEach(function(item) {
                item.call(THAT);
            });
        }
    }
    return ret
}

$(document).on('click', '#zaloguj_chat', function(e) {
    $("#shout_refresher").load("gra/chat/shout.php?refresh=0");
})


$(document).off("click", ".stan-pokemon");
$(document).on("click", ".stan-pokemon", function(event) {
    reloadMain("#glowne_okno", 'gra/stan.php?p=' + $(this).attr('data-pokemon-id'));
});

$(document).on("click", ".pokazpoka", function(event) {
    //$("#podgladPoka_content").html('Wczytywanie...');
    var ukrycie = 0;
    var zmienna = $(this).attr('data-ignoruj-ukrycie');
    if (typeof zmienna !== typeof undefined && zmienna !== false) {
        ukrycie = 1;
    }
    var hala = 0;
    var zmienna2 = $(this).attr('data-ograniczenia-hali');
    if (typeof zmienna2 !== typeof undefined && zmienna2 !== false) {
        hala = 1;
    }
    var hala2 = 0;
    var zmienna3 = $(this).attr('data-pokemon-hala');
    if (typeof zmienna3 !== typeof undefined && zmienna3 !== false) {
        hala2 = 1;
    }
    var rank = 0;
    var zmienna4 = $(this).attr('data-ranking-staty');
    if (typeof zmienna4 !== typeof undefined && zmienna4 !== false) {
        rank = zmienna4;
    }

    reloadMain("#podgladPoka_content", 'gra/pokemon_skr.php?nopanel&p=' + $(this).attr('data-id-pokemona') + '&ignoruj_ukrycie=' + ukrycie + '&ograniczenia_hali=' + hala + '&pokemon_hala=' + hala2 + '&treningi_rank=' + rank);
});


$(document).off("click", "nav a");
$(document).on("click", "nav a:not('.btn-akcja')", function(event) {
    if ($(this).attr('href').charAt(0) != '#' && !$(this).hasClass("link")) {

        if (event.originalEvent !== undefined && autoGo == true) {
            autoGo = false;
            $('#goAutoButton').html('AutoGO');
            $("#goStopReason").html("Kliknięto w menu").show();
            document.title = "Kliknięto w menu";
        }

        event.preventDefault();

        var new_buffer = $(this).attr('href');
        new_buffer = new_buffer.substr(4);
        remember_back(new_buffer);

        var url = $(this).attr('href');
        if (url.indexOf('index.php?url=') != -1) {
            url = url.replace('index.php?url=', '');
        }
        if (url.indexOf('gra/') == -1) {
            url = 'gra/' + url;
        }

        reloadMain("#glowne_okno", url);

        $('.collapse-hidefix').collapse('hide');
    }
});

$(document).on("click", function(event) {
    document.title = "PokeLife - Gra Pokemon Online";
    stopSound();
})

$(document).off("click", ".btn-akcja");
$(document).on("click", ".btn-akcja", function(event) {
    var url = $(this).attr('href');
    if ($('#hodowla-glowne b').length > 1) {
        zarobek = $('#hodowla-glowne b:nth(1)').html().split("¥")[0].replace('.', '').replace('.', '').replace('.', '');
    }

    if (event.originalEvent !== undefined && autoGo == true) {
        autoGo = false;
        $('#goAutoButton').html('AutoGO');
        $("#goStopReason").html("Kliknięto w menu").show();
        document.title = "Kliknięto w menu";
    }

    event.preventDefault();
    if (this.id != 'back_button') {

    } else {
        if ($(this).prop('prev1') != '') {
            $('#back_button').attr('href', $('#back_button').attr('prev1'));
            $('#back_button').attr('prev1', $('#back_button').attr('prev2'));
            $('#back_button').attr('prev2', $('#back_button').attr('prev3'));
            $('#back_button').attr('prev3', $('#back_button').attr('prev4'));
            $('#back_button').attr('prev4', $('#back_button').attr('prev5'));
            $('#back_button').attr('prev5', '');
        } else {
            $(this).prop('disabled', true);
        }
    }

    if ($('body').hasClass('modal-open')) {
        $('body').removeClass('modal-open');
        $('body').css({ "padding-right": "0px" });
        $('.modal-backdrop').remove();
    }

    $(this).attr("disabled", "disabled");

    if (url.startsWith("hodowla.php?sprzedaj_wszystkie=")) {
        updateStats("zarobki_z_hodowli", zarobek);
    }

    reloadMain("#glowne_okno", 'gra/' + $(this).attr('href'));
});

$(document).off("click", ".btn-edycja-nazwy-grupy");
$(document).on("click", ".btn-edycja-nazwy-grupy", function(event) {
    $("#panel_grupa_id_" + $(this).attr('data-grupa-id')).html('<form action="druzyna.php?p=2&zmien_nazwe_grupy=' + $(this).attr('data-grupa-id') + '" method="post"><div class="input-group"><input type="text" class="form-control" name="grupa_nazwa" value="' + $(this).attr('data-obecna-nazwa') + '"><span class="input-group-btn"><input class="btn btn-primary" type="submit" value="Ok"/></span></div></form>');
});

$(document).off("click", ".nauka-ataku");
$(document).on("click", ".nauka-ataku", function(event) {
    event.preventDefault();

    $("html, body").animate({ scrollTop: 0 }, "slow");

    var naucz_zamiast = $("input[name=nauczZamiast-" + $(this).attr("data-pokemon-id") + "]:checked").val();

    if ($(this).attr("data-tm-zapomniany")) {
        reloadMain("#glowne_okno", 'gra/sala.php?zabezpieczone_id=' + $(this).attr('zabezpieczone-id') + '&p=' + $(this).attr("data-pokemon-id") + '&tm_zapomniany=' + $(this).attr("data-tm-zapomniany") + '&naucz_zamiast=' + naucz_zamiast + '&zrodlo=' + $(this).attr('data-zrodlo'));
    } else if ($(this).attr("data-tm")) {
        reloadMain("#glowne_okno", 'gra/sala.php?zabezpieczone_id=' + $(this).attr('zabezpieczone-id') + '&p=' + $(this).attr("data-pokemon-id") + '&tm=' + $(this).attr("data-tm") + '&naucz_zamiast=' + naucz_zamiast + '&zrodlo=' + $(this).attr('data-zrodlo'));
    } else {
        reloadMain("#glowne_okno", 'gra/sala.php?zabezpieczone_id=' + $(this).attr('zabezpieczone-id') + '&p=' + $(this).attr("data-pokemon-id") + '&nauka_ataku=' + $(this).attr('data-nazwa-ataku') + '&naucz_zamiast=' + naucz_zamiast + '&zrodlo=' + $(this).attr('data-zrodlo'));
    }
});

$(document).off('submit', 'form');
$(document).on('submit', 'form', function(e) {
    if (!$(this).attr("form-normal-submit")) {
        e.preventDefault();

        $("html, body").animate({ scrollTop: 0 }, "fast");

        if ($('body').hasClass('modal-open') && $(this).attr("dont-close-modal") != 1) {
            $('body').removeClass('modal-open');
            $('body').css({ "padding-right": "0px" });
            $('.modal-backdrop').remove();
        } else {
            $(".modal").animate({ scrollTop: 0 }, "fast");
        }

        var postData = $(this).serializeArray();

        if ($(this).attr("form-target")) {
            reloadMainPOST($(this).attr('form-target'), 'gra/' + $(this).attr('action'), postData);
        } else {
            $("html, body").animate({ scrollTop: 0 }, "fast");
            reloadMainPOST("#glowne_okno", 'gra/' + $(this).attr('action'), postData);
        }
        var submit = $(this).closest("form").find(":submit");
        submit.attr("disabled", "disabled");
    }
});


$(document).off("change", ".select-submit");
$(document).on("change", ".select-submit", function(e) {
    e.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, "slow");

    $('body').removeClass('modal-open');
    $('body').css({ "padding-right": "0px" });
    $('.modal-backdrop').remove();

    var postData = $(this).closest('form').serializeArray();

    $("html, body").animate({ scrollTop: 0 }, "fast");

    reloadMainPOST("#glowne_okno", 'gra/' + $(this).closest('form').attr('action'), postData);
});

$(document).off("click", "#zatwierdz_reprezentacje");
$(document).on("click", "#zatwierdz_reprezentacje", function(e) {
    $("html, body").animate({ scrollTop: 0 }, "slow");

    $('body').removeClass('modal-open');
    $('body').css({ "padding-right": "0px" });
    $('.modal-backdrop').remove();

    var postData = $(this).closest('form').serializeArray();
    $("html, body").animate({ scrollTop: 0 }, "fast");

    reloadMainPOST("#glowne_okno", 'gra/' + $(this).closest('form').attr('action'), postData);
    e.preventDefault();
});

$(document).off("click", ".collapse_toggle_icon");
$(document).on("click", ".collapse_toggle_icon", function(e) {
    if ($(".collapse_toggle_icon").hasClass("glyphicon-chevron-down")) {
        $(".collapse_toggle_icon").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
    } else {
        $(".collapse_toggle_icon").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
    }
});



// **********************
//
// initPokeLifeScript
// główna funkcja gry
//
// **********************

function initPokeLifeScript() {



    // **********************
    //
    // initSkins
    // Funkcja dodająca nowe skórki do gry
    //
    // **********************



    // **********************
    //
    // initPodmianaObrazkow
    // Funkcja dodająca przypomnienie o opiece
    //
    // **********************

  

    // **********************
    //
    // initAutoGo
    // Funkcja dodająca automatyczne klikanie w wyprawy
    //
    // **********************

    function initAutoGo() {

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        var clickDelay = getRandomInt(timeoutMin, timeoutMax);
        var minToHeal = getRandomInt(20, 50);

        var blocked = false;
        var autoGoWznawianie;

        function initGoButton() {
            $('body').append('<div id="goSettingsAutoGo" style="position: fixed;cursor: pointer;top: 20px;right: 275px;font-size: 20px;text-align: center;width: 25px;height: 25px;line-height: 25px;z-index: 9999;"><span style="color: ' + $('.panel-heading').css('background-color') + ';" class="glyphicon glyphicon-cog" aria-hidden="true"></span></div>');
            $('body').append('<div id="goButton" style="opacity: 0.3;border-radius: 4px;position: fixed; cursor: pointer; top: 5px; right: 10px; font-size: 36px; text-align: center; width: 100px; height: 48px; line-height: 48px; background: ' + $('.panel-heading').css('background-color') + '; z-index: 9999">GO</div>');
            $('body').append('<div id="goAutoButton" style="border-radius: 4px;position: fixed; cursor: pointer; top: 5px; right: 122px; font-size: 36px; text-align: center; width: 140px; height: 48px; line-height: 48px; background: ' + $('.panel-heading').css('background-color') + '; z-index: 9999">AutoGO</div>');
            $('body').append('<div id="goStopReason" style="position: fixed; cursor: pointer; top: 12px; right: 271px; z-index: 99999; background: rgb(231, 201, 216); padding: 7px; border: 1px solid rgb(225, 187, 206); border-radius: 3px; display: none;"></div>');
        }
        initGoButton();

        function initPokemonIcon() {
            $('#setPokemon').remove();
            $('body').append('<div id="setPokemon" style="position: fixed; cursor: pointer; top: 0; left: 10px; z-index: 9999"></div>');

            IconSelect.COMPONENT_ICON_FILE_PATH = "";

            AutoGoSettings.iconPokemon = new IconSelect("setPokemon", {
                'selectedIconWidth': 48,
                'selectedIconHeight': 48,
                'selectedBoxPadding': 1,
                'iconsWidth': 48,
                'iconsHeight': 48,
                'boxIconSpace': 1,
                'vectoralIconNumber': 1,
                'horizontalIconNumber': 6
            });

            var selectPokemon = [];
            let i = 0;
            $.each($('.stan-pokemon'), function(index, item) {
                let src = $(item).find('img').attr('src');
                if (src != "undefined" && src != undefined) {
                    selectPokemon.push({
                        'iconFilePath': $(item).find('img').attr('src'),
                        'iconValue': function() {
                            return "&wybierz_pokemona=" + AutoGoSettings.iconPokemon.getSelectedIndex();
                        }
                    });
                    i = i + 1;
                }
            });

            selectPokemon.push({
                'iconFilePath': 'https://cdn0.iconfinder.com/data/icons/seo-smart-pack/128/grey_new_seo-05-512.png',
                'iconValue': function() {
                    if (Number($('#glowne_okno .panel-body.nopadding b').html().split(': ')[1]) <= 20) {
                        return "&wybierz_pokemona=" + config.pok20;
                    }
                    if (Number($('#glowne_okno .panel-body.nopadding b').html().split(': ')[1]) <= 40) {
                        return "&wybierz_pokemona=" + config.pok40;
                    }
                    if (Number($('#glowne_okno .panel-body.nopadding b').html().split(': ')[1]) <= 60) {
                        return "&wybierz_pokemona=" + config.pok60;
                    }
                    if (Number($('#glowne_okno .panel-body.nopadding b').html().split(': ')[1]) <= 80) {
                        return "&wybierz_pokemona=" + config.pok80;
                    }
                    return "&wybierz_pokemona=" + config.pok100;
                }
            });

            AutoGoSettings.iconPokemon.refresh(selectPokemon);
            AutoGoSettings.iconPokemon.setSelectedIndex(config.pokemonIconsIndex);

            document.getElementById('setPokemon').addEventListener('changed', function(e) {
                config.pokemonIconsIndex = AutoGoSettings.iconPokemon.getSelectedIndex();
                updateConfig(config);
            });
        }
        initPokemonIcon();

        $('#setPokemon-box-scroll .icon:last').on('click', function() {
            $('body').append('<div id="settingsPokemonIcon" style="padding: 10px; position: fixed; top: 70px; left: 10px; width: 500px; background: white; opacity: 1; border: 7px solid #d6e9c6; z-index: 999;"></div>');
            $('#settingsPokemonIcon').html("");
            $('#settingsPokemonIcon').append('<div id="exp_mod_settings" class="row"><div class="col-sm-6 first"></div><div class="col-sm-6 second"></div></div>');
            $('#exp_mod_settings .first').append('<p style=" margin: 0 0 5px; ">Pokemony 1-20</p><select data-order-id="20" style="width: 100%; padding: 5px;margin-bottom: 10px;" class="list_of_poks_in_team"></select>');
            $('#exp_mod_settings .second').append('<p style=" margin: 0 0 5px; ">Pokemony 21-40</p><select data-order-id="40" style="width: 100%; padding: 5px;margin-bottom: 10px;" class="list_of_poks_in_team"></select>');
            $('#exp_mod_settings .first').append('<p style=" margin: 0 0 5px; ">Pokemony 41-60</p><select data-order-id="60" style="width: 100%; padding: 5px;margin-bottom: 10px;" class="list_of_poks_in_team"></select>');
            $('#exp_mod_settings .second').append('<p style=" margin: 0 0 5px; ">Pokemony 61-80</p><select data-order-id="80" style="width: 100%; padding: 5px;margin-bottom: 10px;" class="list_of_poks_in_team"></select>');
            $('#exp_mod_settings .first').append('<p style=" margin: 0 0 5px; ">Pokemony 81-100</p><select data-order-id="100" style="width: 100%; padding: 5px;margin-bottom: 10px;" class="list_of_poks_in_team"></select>');

            $.each($('#sidebar .stan-pokemon:odd()'), function(index, item) {
                $('.list_of_poks_in_team').append('<option value="' + index + '">' + $(item).find('b').html() + '</option>');
            })

            $('.list_of_poks_in_team[data-order-id="20"] option[value="' + config.pok20 + '"]').prop("selected", true);
            $('.list_of_poks_in_team[data-order-id="40"] option[value="' + config.pok40 + '"]').prop("selected", true);
            $('.list_of_poks_in_team[data-order-id="60"] option[value="' + config.pok60 + '"]').prop("selected", true);
            $('.list_of_poks_in_team[data-order-id="80"] option[value="' + config.pok80 + '"]').prop("selected", true);
            $('.list_of_poks_in_team[data-order-id="100"] option[value="' + config.pok100 + '"]').prop("selected", true);
        });

        $('html').click(function(e) {
            if (e.target.id == 'settingsPokemonIcon' || $(e.target).parents('#settingsPokemonIcon').length > 0) {
                // clicked menu content or children
            } else {
                $('#settingsPokemonIcon').remove();
            }
        });


        function initPokeballIcon() {
            $('body').append('<div id="setPokeball" style="position: fixed; cursor: pointer; top: 0; left: 60px; z-index: 9999"></div>');

            AutoGoSettings.iconPokeball = new IconSelect("setPokeball", {
                'selectedIconWidth': 48,
                'selectedIconHeight': 48,
                'selectedBoxPadding': 1,
                'iconsWidth': 48,
                'iconsHeight': 48,
                'boxIconSpace': 1,
                'vectoralIconNumber': 1,
                'horizontalIconNumber': 6
            });

            var selectPokeball = [{
                    'iconFilePath': "images/pokesklep/pokeballe.jpg",
                    'iconValue': function() {
                        return '&zlap_pokemona=pokeballe';
                    }
                },
                {
                    'iconFilePath': "images/pokesklep/greatballe.jpg",
                    'iconValue': function() {
                        return '&zlap_pokemona=greatballee';
                    }
                },
                {
                    'iconFilePath': "images/pokesklep/nestballe.jpg",
                    'iconValue': function() {
                        return '&zlap_pokemona=nestballe';
                    }
                },
                {
                    'iconFilePath': "images/pokesklep/friendballe.jpg",
                    'iconValue': function() {
                        return '&zlap_pokemona=friendballe';
                    }
                },
                {
                    'iconFilePath': "images/pokesklep/nightballe.jpg",
                    'iconValue': function() {
                        return '&zlap_pokemona=nightballe';
                    }
                },
                {
                    'iconFilePath': "images/pokesklep/cherishballe.jpg",
                    'iconValue': function() {
                        return '&zlap_pokemona=cherishballe';
                    }
                },
                {
                    'iconFilePath': "images/pokesklep/lureballe.jpg",
                    'iconValue': function() {
                        return '&zlap_pokemona=lureballe';
                    }
                },
                {
                    'iconFilePath': "https://raw.githubusercontent.com/krozum/pokelife/master/assets/nb1.jpg",
                    'iconValue': function() {
                        let pokeLvlNumber = $('#glowne_okno i:nth("1")').parent().html().split("(")[1].split(" poz")[0];
                        if (pokeLvlNumber < 15) {
                            return '&zlap_pokemona=nestballe';
                        } else {
                            return '&zlap_pokemona=greatballee';
                        }
                    }
                },
                {
                    'iconFilePath': "https://raw.githubusercontent.com/krozum/pokelife/master/assets/nb2.png",
                    'iconValue': function() {
                        var d = new Date();
                        var h = d.getHours();
                        if (h >= 22 || h < 6) {
                            return '&zlap_pokemona=nightballe';
                        }
                        let pokeLvlNumber = $('#glowne_okno i:nth("1")').parent().html().split("(")[1].split(" poz")[0];
                        if (pokeLvlNumber < 15) {
                            return '&zlap_pokemona=nestballe';
                        } else {
                            return '&zlap_pokemona=greatballee';
                        }
                    }
                },
                {
                    'iconFilePath': "https://raw.githubusercontent.com/krozum/pokelife/master/assets/nb3.jpg",
                    'iconValue': function() {
                        let pokeLvlNumber = $('#glowne_okno i:nth("1")').parent().html().split("(")[1].split(" poz")[0];
                        if (pokeLvlNumber <= 5) {
                            return '&zlap_pokemona=uzyj_swarmballe';
                        } else {
                            var d = new Date();
                            var h = d.getHours();
                            if (h >= 22 || h < 6) {
                                return '&zlap_pokemona=nightballe';
                            }
                            if (pokeLvlNumber > 5 && pokeLvlNumber < 15) {
                                return '&zlap_pokemona=nestballe';
                            } else {
                                return '&zlap_pokemona=greatballee';
                            }
                        }
                    }
                },
                {
                    'iconFilePath': "https://raw.githubusercontent.com/krozum/pokelife/master/assets/nb4.jpg",
                    'iconValue': function() {
                        if ($(previousPageContent).find('.panel-body.nopadding img[src="images/trudnosc/trudnosc1.png"]').length > 0) {
                            return '&zlap_pokemona=levelballe';
                        } else {
                            var d = new Date();
                            var h = d.getHours();
                            if (h >= 22 || h < 6) {
                                return '&zlap_pokemona=nightballe';
                            }
                            let pokeLvlNumber = $('#glowne_okno i:nth("1")').parent().html().split("(")[1].split(" poz")[0];
                            if (pokeLvlNumber < 15) {
                                return '&zlap_pokemona=nestballe';
                            } else {
                                return '&zlap_pokemona=greatballee';
                            }
                        }
                    }
                },
                {
                    'iconFilePath': "https://raw.githubusercontent.com/krozum/pokelife/master/assets/nb5.jpg",
                    'iconValue': function() {
                        let pokeLvlNumber = $('#glowne_okno i:nth("1")').parent().html().split("(")[1].split(" poz")[0];
                        if ($(previousPageContent).find('.panel-body.nopadding img[src="images/trudnosc/trudnosc1.png"]').length > 0 && pokeLvlNumber <= 5) {
                            return '&zlap_pokemona=luxuryballe';
                        } else {
                            var d = new Date();
                            var h = d.getHours();
                            if (h >= 22 || h < 6) {
                                return '&zlap_pokemona=nightballe';
                            }
                            let pokeLvlNumber = $('#glowne_okno i:nth("1")').parent().html().split("(")[1].split(" poz")[0];
                            if (pokeLvlNumber < 15) {
                                return '&zlap_pokemona=nestballe';
                            } else {
                                return '&zlap_pokemona=greatballee';
                            }
                        }
                    }
                },
                {
                    'iconFilePath': "images/pokesklep/safariballe.jpg",
                    'iconValue': function() {
                        if ($('label[data-original-title="Safariball"]').length > 0) {
                            if (Number($('label[data-original-title="Safariball"]').html().split('">')[1].trim()) > 1) {
                                if (config.lapSafariballemNiezlapane == true || config.lapSafariballemNiezlapane == "true")
                                    if ($(previousPageContent).find('.panel-body.nopadding img[src="images/inne/pokeball_miniature2.png"]').length > 0) {
                                        return '&zlap_pokemona=safariballe';
                                    } else {
                                        $('button:contains("Pomiń i szukaj dalej")').click();

                                        return "";
                                    }
                                else {
                                    return '&zlap_pokemona=safariballe';
                                }
                            } else {
                                $('button:contains("Pomiń i szukaj dalej")').click();
                                return "";
                            }
                        } else {
                            autoGo = false;
                            $('#goAutoButton').html('AutoGO');
                            $("#goStopReason").html("Brak odpowiedniego pokeballa").show();
                            document.title = "Brak odpowiedniego pokeballa";
                        }
                    }
                },
                {
                    'iconFilePath': "images/pokesklep/premierballe.jpg",
                    'iconValue': function() {
                        return '&zlap_pokemona=premierballe';
                    }
                }

            ];

            AutoGoSettings.iconPokeball.refresh(selectPokeball);
            AutoGoSettings.iconPokeball.setSelectedIndex(config.pokeballIconsIndex);

            document.getElementById('setPokeball').addEventListener('changed', function(e) {
                config.pokeballIconsIndex = AutoGoSettings.iconPokeball.getSelectedIndex();
                updateConfig(config);
            });
        }
        initPokeballIcon();

        function initLocationIcon() {
            $('body').append('<div id="setLocation" style="position: fixed; cursor: pointer; top: 0; left: 117px; z-index: 9999"></div>');

            AutoGoSettings.iconLocation = new IconSelect("setLocation", {
                'selectedIconWidth': 48,
                'selectedIconHeight': 48,
                'selectedBoxPadding': 1,
                'iconsWidth': 48,
                'iconsHeight': 48,
                'boxIconSpace': 1,
                'vectoralIconNumber': 1,
                'horizontalIconNumber': 6
            });

            var icons = [];
            $.each($('#pasek_skrotow li'), function(index, item) {
                if ($(item).find('a').attr('href') != "#" && $(item).find('a').attr('href').substring(0, 9) == "gra/dzicz") {
                    icons.push({
                        'iconFilePath': $(item).find('img').attr('src'),
                        'iconValue': function() {
                            return $(item).find('a').attr('href').substring(28)
                        }
                    });
                }
            });

            AutoGoSettings.iconLocation.refresh(icons);
            AutoGoSettings.iconLocation.setSelectedIndex(config.locationIconsIndex);

            document.getElementById('setLocation').addEventListener('changed', function(e) {
                config.locationIconsIndex = AutoGoSettings.iconLocation.getSelectedIndex();
                updateConfig(config);
            });
        }
        initLocationIcon();

        function click(poLeczeniu) {
            if (poLeczeniu != true) {
                poLeczeniu = false;
            }
            var canRun = true;

            if (blocked) {
                console.log('blocked');
                canRun = false;
            } else {
                blocked = true;
                window.setTimeout(function() { blocked = false }, clickDelay);
            }

            var minHealth = 100;

            $('.stan-pokemon div.progress:first-of-type .progress-bar').each(function(index) {
                var now = $(this).attr("style").replace(/^\D+/g, '').replace('%', '').replace(';', '');
                if (minHealth > Number(now)) {
                    minHealth = Number(now);
                }
            });

            if (Number(minHealth) < Number(minToHeal)) {
                if (!poLeczeniu) {

                    var healOption = 'gra/lecznica.php?wylecz_wszystkie&tylko_komunikat'

                    if (config.useCzerwoneJagody == "true" || config.useCzerwoneJagody == true) {
                        healOption = 'gra/plecak.php?uzyj&rodzaj_przedmiotu=czerwone_jagody&tylko_komunikat&ulecz_wszystkie&zjedz_max'
                    }

                    $.get(healOption, function(data) {

                        if ($(data).hasClass("alert-danger")) {
                            console.log('Brak czerwonych jagód');
                            config.useCzerwoneJagody = false;
                            updateConfig(config);
                            window.setTimeout(function() {
                                if (autoGo) {
                                    click(poLeczeniu)
                                }
                            }, clickDelay);
                        };

                        if ($(data).find(".alert-success").length > 0 || $(data).hasClass("alert-success")) {

                            console.log('PokeLifeScript: wyleczono');

                            if ($(data).find(".alert-success strong").length > 0) {
                                var koszt = $(data).find(".alert-success strong").html().split(" ¥")[0];
                                updateStats("koszty_leczenia", koszt.replace(/\./g, ''));
                            }

                            $.get('inc/stan.php', function(data) {
                                $("#sidebar").html(data);
                                $('.btn-wybor_pokemona').attr("disabled", false);
                                $('.btn-wybor_pokemona .progress-bar').css("width", "100%");
                                $('.btn-wybor_pokemona .progress-bar span').html("100% PŻ");
                                window.setTimeout(function() {
                                    if (autoGo) {
                                        click(true)
                                    }
                                }, clickDelay);
                            });
                        }
                    });
                }
                canRun = false;
            }

            if (canRun) {
                if ($('#glowne_okno .panel-heading').length > 0) {
                    if ($('#glowne_okno').find(".panel-heading:contains('Dzienne Przeliczenie')").length > 0) {
                        console.log('PokeLifeScript: Dzienne Przeliczenie, przerwanie AutoGo');
                        autoGo = false;
                        $('#goAutoButton').html('AutoGO');
                        $("#goStopReason").html("Dzienne Przeliczenie").show();
                        document.title = "Dzienne Przeliczenie";
                    } else if ($('#glowne_okno').find(".panel-heading:contains('Łapanie Jajka')").length > 0) {
                        console.log('PokeLifeScript: idę do dziczy ' + AutoGoSettings.iconLocation.getSelectedValue().call() + ".");
                        $('#pasek_skrotow a[href="gra/dzicz.php?poluj&miejsce=' + AutoGoSettings.iconLocation.getSelectedValue().call() + '"] img').trigger('click');
                    } else if ($('h2:contains("Wybierz Pokemona")').length > 0 && activeScript.length > 0 && pokemonTrigger(
                            $('#glowne_okno i').text().trim(),
                            Number.parseInt($('.panel-body.nopadding .col-xs-9 > b').html().split("Poziom: ")[1]),
                            $('.panel-body.nopadding img[src="images/trudnosc/trudnosc1.png"]').length > 0 ? 1 :
                            $('.panel-body.nopadding img[src="images/trudnosc/trudnosc2.png"]').length > 0 ? 2 :
                            $('.panel-body.nopadding img[src="images/trudnosc/trudnosc3.png"]').length > 0 ? 3 :
                            $('.panel-body.nopadding img[src="images/trudnosc/trudnosc4.png"]').length > 0 ? 4 :
                            $('.panel-body.nopadding img[src="images/trudnosc/trudnosc5.png"]').length > 0 ? 5 : 10,
                            getTableWithType(),
                            $('.panel-body.nopadding img[src="images/inne/pokeball_miniature2.png"]').length > 0,
                            $('.panel-body.nopadding').attr('style').indexOf("background-color: #FFBB") == -1
                        ) != null) {
                        if (actionCommand == "StopAutoGo") {
                            console.log('PokeLifeScript: akcja skryptu, przerwanie AutoGo');
                            autoGo = false;
                            document.title = "Zatrzymany przez skrypt";
                        }
                        if (actionCommand == "SkipPokemon") {
                            console.log('PokeLifeScript: akcja skryptu, ominiecie pokemona');
                            $('button:contains("Pomiń i szukaj dalej")').click();
                        }
                        if (actionCommand.includes("&wybierz_pokemona=")) {
                            console.log('PokeLifeScript: akcja skryptu,  atakuje pokemona');
                            var url = "dzicz.php?miejsce=" + AutoGoSettings.iconLocation.getSelectedValue().call() + actionCommand;
                            if ($('button[href="' + url + '"]').length == 0) {
                                autoGo = false;
                                $('#goAutoButton').html('AutoGO');
                                $("#goStopReason").html("Dzicz została zmieniona").show();
                                document.title = "Dzicz została zmienion";
                            } else {
                                $('button[href="' + url + '"]').trigger('click');
                            }
                        }
                        run = null;
                        actionCommand == null;
                    } else if ($('h2:contains("Wybierz Pokemona")').length > 0 && $('.panel-body.nopadding').attr('style').indexOf("background-color: #FFBB") == -1) {
                        console.log('PokeLifeScript: spotkany Shiny, przerwanie AutoGo');
                        autoGo = false;
                        $('#goAutoButton').html('AutoGO');
                        $("#goStopReason").html("Spotkany shiny pokemon").show();
                        document.title = "Spotkany shiny pokemon";
                        triggerSound();
                        $('#refreshShinyWidget').trigger('click');
                        requestDomain("pokelife/api/update_shiny.php?pokemon_id=" + $('.panel-body.nopadding .center-block img').attr('src').split('/')[1].split('.')[0].split('s')[1] + "&login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim() + "&time=" + Date.now(), null);
                    } else if ($('h2:contains("Wybierz Pokemona")').length && $('.panel-body.nopadding img[src="images/inne/pokeball_miniature2.png"]').length > 0 && $('.panel-body.nopadding img[src="images/trudnosc/trudnoscx.png"]').length < 1 && $('.panel-body.nopadding .col-xs-9 > b').html().split("Poziom: ")[1] <= config.maxLapanyLvl) {
                        switch (Number(config.niezlapaneMode)) {
                            case 1:
                                console.log('PokeLifeScript: spotkany niezłapany pokemona, przerwanie AutoGo');
                                autoGo = false;
                                $('#goAutoButton').html('AutoGO');
                                $("#goStopReason").html("Spotkany niezłapany pokemona").show();
                                document.title = "Spotkany niezłapany pokemona";
                                triggerSound();
                                break;
                            case 2:
                                if ($('.panel-body.nopadding img[src="images/trudnosc/trudnosc4.png"]').length > 0 || $('.panel-body.nopadding img[src="images/trudnosc/trudnosc5.png"]').length > 0) {
                                    console.log('PokeLifeScript: spotkany niezłapany pokemona, przerwanie AutoGo');
                                    autoGo = false;
                                    $('#goAutoButton').html('AutoGO');
                                    $("#goStopReason").html("Spotkany niezłapany pokemona").show();
                                    document.title = "Spotkany niezłapany pokemona";
                                    triggerSound();
                                } else {
                                    console.log('PokeLifeScript: spotkany niezłapany pokemona');
                                    console.log('PokeLifeScript: atakuje pokemona');
                                    var url = "dzicz.php?miejsce=" + AutoGoSettings.iconLocation.getSelectedValue().call() + AutoGoSettings.iconPokemon.getSelectedValue().call();
                                    if ($('button[href="' + url + '"]').length == 0) {
                                        autoGo = false;
                                        $('#goAutoButton').html('AutoGO');
                                        $("#goStopReason").html("Dzicz została zmieniona").show();
                                        document.title = "Dzicz została zmieniona";
                                    } else {
                                        $('button[href="' + url + '"]').trigger('click');
                                    }
                                }
                                break;
                            case 3:
                                console.log('PokeLifeScript: spotkany niezłapany pokemona');
                                console.log('PokeLifeScript: atakuje pokemona');
                                var url = "dzicz.php?miejsce=" + AutoGoSettings.iconLocation.getSelectedValue().call() + AutoGoSettings.iconPokemon.getSelectedValue().call();
                                if ($('button[href="' + url + '"]').length == 0) {
                                    autoGo = false;
                                    $('#goAutoButton').html('AutoGO');
                                    $("#goStopReason").html("Dzicz została zmieniona").show();
                                    document.title = "Dzicz została zmieniona";
                                } else {
                                    $('button[href="' + url + '"]').trigger('click');
                                }
                                break;
                            case 4:
                                console.log('PokeLifeScript: spotkany niezłapany pokemona');
                                console.log('PokeLifeScript: atakuje pokemona');
                                var url = "dzicz.php?miejsce=" + AutoGoSettings.iconLocation.getSelectedValue().call() + AutoGoSettings.iconPokemon.getSelectedValue().call();
                                if ($('button[href="' + url + '"]').length == 0) {
                                    autoGo = false;
                                    $('#goAutoButton').html('AutoGO');
                                    $("#goStopReason").html("Dzicz została zmieniona").show();
                                    document.title = "Dzicz została zmieniona";
                                } else {
                                    $('button[href="' + url + '"]').trigger('click');
                                }
                                break;
                        }
                    } else if ($('h2:contains("Wybierz Pokemona")').length == 1) {
                        console.log('PokeLifeScript: atakuje pokemona');
                        var url = "dzicz.php?miejsce=" + AutoGoSettings.iconLocation.getSelectedValue().call() + AutoGoSettings.iconPokemon.getSelectedValue().call();
                        if ($('button[href="' + url + '"]').length == 0) {
                            autoGo = false;
                            $('#goAutoButton').html('AutoGO');
                            $("#goStopReason").html("Dzicz została zmieniona").show();
                            document.title = "Dzicz została zmienion";
                        } else {
                            $('button[href="' + url + '"]').trigger('click');
                        }
                    } else if ($("form[action='dzicz.php?zlap']").length == 1) {
                        if (AutoGoSettings.iconPokeball.getSelectedValue().call() !== "") {
                            var button = $('label[href="dzicz.php?miejsce=' + AutoGoSettings.iconLocation.getSelectedValue().call() + (throwCommand == null ? AutoGoSettings.iconPokeball.getSelectedValue().call() : throwCommand) + '"]');
                            if (config.niezlapaneMode == 4) {
                                if ($(previousPageContent).find('.panel-body.nopadding img[src="images/inne/pokeball_miniature2.png"]').length > 0) {
                                    if ($(previousPageContent).find('.panel-body.nopadding img[src="images/trudnosc/trudnosc4.png"]').length > 0 || $(previousPageContent).find('.panel-body.nopadding img[src="images/trudnosc/trudnosc5.png"]').length > 0) {
                                        button = $('label[href="dzicz.php?miejsce=' + AutoGoSettings.iconLocation.getSelectedValue().call() + '&zlap_pokemona=cherishball"]');
                                    }
                                }
                            }
                            if (button.length > 0) {
                                console.log('PokeLifeScript: rzucam pokeballa');
                                $('label[href="dzicz.php?miejsce=' + AutoGoSettings.iconLocation.getSelectedValue().call() + (throwCommand == null ? AutoGoSettings.iconPokeball.getSelectedValue().call() : throwCommand) + '"]').trigger('click');
                            } else {
                                autoGo = false;
                                $('#goAutoButton').html('AutoGO');
                                $("#goStopReason").html("Brak odpowiedniego pokeballa").show();
                                document.title = "Brak odpowiedniego pokeballa";
                                console.log('PokeLifeScript: brak odpowiedniego balla');
                            }
                        }
                        throwCommand = null;
                    } else if ($("form[action='dzicz.php?zlap_pokemona=swarmballe&miejsce=" + AutoGoSettings.iconLocation.getSelectedValue().call() + "']").length == 1) {
                        console.log('PokeLifeScript: rzucam 1 swarmballa');
                        $("form[action='dzicz.php?zlap_pokemona=swarmballe&miejsce=" + AutoGoSettings.iconLocation.getSelectedValue().call() + "']").submit();
                    } else {
                        console.log('PokeLifeScript: idę do dziczy ' + AutoGoSettings.iconLocation.getSelectedValue().call() + ".");
                        $('#pasek_skrotow a[href="gra/dzicz.php?poluj&miejsce=' + AutoGoSettings.iconLocation.getSelectedValue().call() + '"] img').trigger('click');
                    }
                }
            }
        }

        $(document).on("change", ".list_of_poks_in_team", function(event) {
            var orderId = $(this).data('order-id');
            if (orderId == 20) {
                config.pok20 = Number($(this).val());
            }
            if (orderId == 40) {
                config.pok40 = Number($(this).val());
            }
            if (orderId == 60) {
                config.pok60 = Number($(this).val());
            }
            if (orderId == 80) {
                config.pok80 = Number($(this).val());
            }
            if (orderId == 100) {
                config.pok100 = Number($(this).val());
            }
            updateConfig(config);
        });

        $(document).on("click", "#goButton", function() {
            click();
        });

        $(document).on("click", '#goAutoButton', function() {
            if (autoGo) {
                autoGo = false;
                autoGoWznawianie = false;
                $('#goAutoButton').html('AutoGO');
            } else {
                autoGo = true;
                autoGoWznawianie = false;
                $('#goAutoButton').html('STOP');
                click();
            }
        });

        $(window).keypress(function(e) {
            if (e.key === ' ' || e.key === 'Spacebar') {
                if ($('input:focus').length == 0 && $('textarea:focus').length == 0 && $('#glowne_okno .panel-heading').length == 0) {
                    e.preventDefault();
                    click();
                } else if ($('input:focus').length == 0 && $('textarea:focus').length == 0 && $('#glowne_okno .panel-heading').html() !== "Poczta" && !$('#glowne_okno .panel-heading').text().trim().startsWith("Stowarzyszenie")) {
                    e.preventDefault();
                    click();
                }
            }
        });

        onReloadMain(function() {
            if (autoGo && !autoGoWznawianie) {
                if (this.find(".panel-body > p.alert-danger").length > 0) {
                    console.log(this.find('.panel-body > p.alert-danger').html());
                    if (this.find(".panel-body > p.alert-danger:contains('Posiadasz za mało punktów akcji')").length > 0) {
                        przerwijAutoGoZPowoduBrakuPA(true);
                    } else if (this.find(".panel-body > p.alert-danger:contains('Nie masz wystarczającej ilości Punktów Akcji')").length > 0) {
                        przerwijAutoGoZPowoduBrakuPA(true);
                    } else if (this.find('.panel-body > p.alert-danger').html() == "Nie masz wystarczającej ilośći Punktów Akcji.") {
                        przerwijAutoGoZPowoduBrakuPA(true);
                    } else if (this.find('.panel-body > p.alert-danger').html() == "Baterie w twojej latarce się wyczerpały, kup nowe.") {
                        przerwijAutoGoZPowoduBrakuPA(false);
                        $("#goStopReason").html("Brak baterii").show();
                        document.title = "Brak baterii";
                    }
                }
            }
        })


        function probujWznowicAutoGo(array, autoGoBefore) {
            if (autoGoBefore) {
                if (array.length > 0) {
                    var text = array.pop();
                    switch (text) {
                        case "useNiebieskieJagody":
                            console.log('Próbuje przywrócić PA za pomocą niebieskich jagód');
                            if ($("a[href='gra/statystyki.php']").length > 0 && autoGo) {
                                reloadMain("#glowne_okno", "gra/statystyki.php", function() {
                                    window.setTimeout(function() {
                                        if ($("#statystyki b:contains('Niebieskie Jagody:')").parent().next().html().split('/')[0].trim() != $("#statystyki b:contains('Niebieskie Jagody:')").parent().next().html().split('/')[1].trim()) {
                                            if ($("a[href='gra/plecak.php']").length > 0 && autoGo) {
                                                reloadMain("#glowne_okno", "gra/plecak.php", function() {
                                                    if ($('.thumbnail-plecak img[src="images/pokesklep/niebieskie_jagody.jpg"]').length > 0) {
                                                        var ile = $('.thumbnail-plecak h5:contains("Niebieskie Jagody")').html().split(' x Niebieskie')[0];

                                                        if (ile > 40) {
                                                            ile = 40;
                                                        }
                                                        window.setTimeout(function() {
                                                            if (autoGo) {
                                                                reloadMain("#glowne_okno", "gra/plecak.php?uzyj&p=3&postData%5B0%5D%5Bname%5D=rodzaj_przedmiotu&postData%5B0%5D%5Bvalue%5D=niebieskie_jagody&postData%5B1%5D%5Bname%5D=ilosc&postData%5B1%5D%5Bvalue%5D=" + ile, function() {
                                                                    $('#goAutoButton').html('STOP');
                                                                    console.log('Przywrócono PA');
                                                                    window.setTimeout(function() {
                                                                        if (autoGo) {
                                                                            autoGoWznawianie = false;
                                                                            click();
                                                                        }
                                                                    }, 1000);
                                                                });
                                                            }
                                                        }, 1000);
                                                    } else {
                                                        console.log('Brak jagód');
                                                        window.setTimeout(function() {
                                                            if (autoGo) {
                                                                probujWznowicAutoGo(array, autoGoBefore);
                                                            }
                                                        }, 1000);
                                                    }
                                                })
                                            }
                                        } else {
                                            console.log('Wykorzystałeś limit niebieskich jagód na dzisiaj');
                                            window.setTimeout(function() {
                                                if (autoGo) {
                                                    probujWznowicAutoGo(array, autoGoBefore);
                                                }
                                            }, 1000);
                                        }
                                    }, 1000);
                                });
                            }
                            break;
                        case "useEventoweNapoje":
                            console.log('Próbuje przywrócić PA za pomocą eventowych napojów');
                            if ($("a[href='gra/statystyki.php']").length > 0 && autoGo) {
                                reloadMain("#glowne_okno", "gra/statystyki.php", function() {
                                    window.setTimeout(function() {
                                        if ($("#statystyki button[disabled!='disabled']:contains('Wypij Eventowy Napój Energetyczny')").length > 0) {
                                            window.setTimeout(function() {
                                                if (autoGo) {
                                                    reloadMain("#glowne_okno", "gra/eventowa_wisniowka.php?wypij_eventowa_wisniowke", function() {
                                                        $('#goAutoButton').html('STOP');
                                                        console.log('Przywrócono PA');
                                                        window.setTimeout(function() {
                                                            if (autoGo) {
                                                                autoGoWznawianie = false;
                                                                click();
                                                            }
                                                        }, 1000);
                                                    });
                                                }
                                            }, 1000);
                                        } else {
                                            console.log('Wykorzystałeś limit eventowych napojów na dzisiaj');
                                            window.setTimeout(function() {
                                                if (autoGo) {
                                                    probujWznowicAutoGo(array, autoGoBefore);
                                                }
                                            }, 1000);
                                        }
                                    }, 1000);
                                });
                            }
                            break;
                        case "useZieloneNapoje":
                            console.log('Próbuje przywrócić PA za pomocą zielonych napojów');
                            if ($("a[href='gra/statystyki.php']").length > 0 && autoGo) {
                                reloadMain("#glowne_okno", "gra/statystyki.php", function() {
                                    window.setTimeout(function() {
                                        var ileJuzWypitych = Number($("#statystyki b:contains('Napoje Energetyczne:')").parent().next().html().split('/')[0].trim());
                                        var ileMozna = (Number($("#statystyki b:contains('Napoje Energetyczne:')").parent().next().html().split('/')[1].trim()) - 1);
                                        if (ileJuzWypitych < ileMozna) {
                                            if ($("a[href='gra/plecak.php']").length > 0 && autoGo) {
                                                reloadMain("#glowne_okno", "gra/plecak.php", function() {
                                                    if ($('.thumbnail-plecak img[src="images/pokesklep/zielony_napoj.jpg"]').length > 0) {
                                                        window.setTimeout(function() {
                                                            if (autoGo) {
                                                                var maxPA = $('#sidebar .progress-bar:contains(" PA")').attr('aria-valuemax');
                                                                var ile = Math.floor($('#sidebar .progress-bar:contains(" PA")').attr('aria-valuemax') / 100);
                                                                var iloscNapojow = Number($('.thumbnail-plecak[data-target="#plecak-1"] h5').html().split(' x ')[0]);

                                                                var maxDoLimitow = ileMozna - ileJuzWypitych;

                                                                if (ile > iloscNapojow) {
                                                                    ile = iloscNapojow;
                                                                }

                                                                if (ile > maxDoLimitow) {
                                                                    ile = maxDoLimitow;
                                                                }

                                                                reloadMain("#glowne_okno", "gra/plecak.php?uzyj&p=1&postData%5B0%5D%5Bname%5D=rodzaj_przedmiotu&postData%5B0%5D%5Bvalue%5D=zielony_napoj&postData%5B1%5D%5Bname%5D=ilosc&postData%5B1%5D%5Bvalue%5D=" + ile, function() {
                                                                    $('#goAutoButton').html('STOP');
                                                                    console.log('Przywrócono PA');
                                                                    window.setTimeout(function() {
                                                                        if (autoGo) {
                                                                            autoGoWznawianie = false;
                                                                            click();
                                                                        }
                                                                    }, 1000);
                                                                });
                                                            }
                                                        }, 1000);
                                                    } else {
                                                        console.log('Brak napojów');
                                                        window.setTimeout(function() {
                                                            if (autoGo) {
                                                                probujWznowicAutoGo(array, autoGoBefore);
                                                            }
                                                        }, 1000);
                                                    }
                                                })
                                            }
                                        } else {
                                            console.log('Wykorzystałeś limit napojów na dzisiaj');
                                            window.setTimeout(function() {
                                                if (autoGo) {
                                                    probujWznowicAutoGo(array, autoGoBefore);
                                                }
                                            }, 1000);
                                        }
                                    }, 1000);
                                });
                            }
                            break;
                        case "useNiebieskieNapoje":
                            console.log('Próbuje przywrócić PA za pomocą eventowych i zwykłych niebieskich napojów');
                            if ($("a[href='gra/statystyki.php']").length > 0 && autoGo) {
                                reloadMain("#glowne_okno", "gra/statystyki.php", function() {
                                    window.setTimeout(function() {
                                        var ileJuzWypitych = Number($("#statystyki b:contains('Napoje Energetyczne:')").parent().next().html().split('/')[0].trim());
                                        var ileMozna = (Number($("#statystyki b:contains('Napoje Energetyczne:')").parent().next().html().split('/')[1].trim()) - 1);
                                        if (ileJuzWypitych < ileMozna) {
                                            if ($("a[href='gra/plecak.php']").length > 0 && autoGo) {
                                                reloadMain("#glowne_okno", "gra/plecak.php", function() {
                                                    if ($('.thumbnail-plecak img[src="images/pokesklep/eventowy_napoj_energetyczny.jpg"]').length > 0) {
                                                        window.setTimeout(function() {
                                                            if (autoGo) {
                                                                reloadMain("#glowne_okno", "gra/plecak.php?uzyj&p=1&postData%5B0%5D%5Bname%5D=rodzaj_przedmiotu&postData%5B0%5D%5Bvalue%5D=eventowy_napoj_energetyczny&postData%5B1%5D%5Bname%5D=ilosc&postData%5B1%5D%5Bvalue%5D=1", function() {
                                                                    $('#goAutoButton').html('STOP');
                                                                    console.log('Przywrócono PA');
                                                                    window.setTimeout(function() {
                                                                        if (autoGo) {
                                                                            autoGoWznawianie = false;
                                                                            click();
                                                                        }
                                                                    }, 1000);
                                                                });
                                                            }
                                                        }, 1000);
                                                    } else if ($('.thumbnail-plecak img[src="images/pokesklep/napoj_energetyczny.jpg"]').length > 0) {
                                                        window.setTimeout(function() {
                                                            if (autoGo) {
                                                                reloadMain("#glowne_okno", "gra/plecak.php?uzyj&p=1&postData%5B0%5D%5Bname%5D=rodzaj_przedmiotu&postData%5B0%5D%5Bvalue%5D=napoj_energetyczny&postData%5B1%5D%5Bname%5D=ilosc&postData%5B1%5D%5Bvalue%5D=1", function() {
                                                                    $('#goAutoButton').html('STOP');
                                                                    console.log('Przywrócono PA');
                                                                    window.setTimeout(function() {
                                                                        if (autoGo) {
                                                                            autoGoWznawianie = false;
                                                                            click();
                                                                        }
                                                                    }, 1000);
                                                                });
                                                            }
                                                        }, 1000);

                                                    } else {
                                                        console.log('Brak napojów');
                                                        window.setTimeout(function() {
                                                            if (autoGo) {
                                                                probujWznowicAutoGo(array, autoGoBefore);
                                                            }
                                                        }, 1000);
                                                    }
                                                })
                                            }
                                        } else {
                                            console.log('Wykorzystałeś limit napojów na dzisiaj');
                                            window.setTimeout(function() {
                                                if (autoGo) {
                                                    probujWznowicAutoGo(array, autoGoBefore);
                                                }
                                            }, 1000);
                                        }
                                    }, 1000);
                                });
                            }
                            break;
                        case "useCzerwoneNapoje":
                            console.log('Próbuje przywrócić PA za pomocą czerwonych napojów');
                            if ($("a[href='gra/statystyki.php']").length > 0 && autoGo) {
                                reloadMain("#glowne_okno", "gra/statystyki.php", function() {
                                    window.setTimeout(function() {
                                        if ($("a[href='gra/plecak.php']").length > 0 && autoGo) {
                                            reloadMain("#glowne_okno", "gra/plecak.php", function() {
                                                if ($('.thumbnail-plecak img[src="images/pokesklep/duzy_napoj_energetyczny.jpg"]').length > 0) {
                                                    window.setTimeout(function() {
                                                        if (autoGo) {
                                                            reloadMain("#glowne_okno", "gra/plecak.php?uzyj&postData%5B0%5D%5Bname%5D=rodzaj_przedmiotu&postData%5B0%5D%5Bvalue%5D=duzy_napoj_energetyczny&postData%5B1%5D%5Bname%5D=napewno&postData%5B1%5D%5Bvalue%5D=1&postData%5B2%5D%5Bname%5D=ilosc&postData%5B2%5D%5Bvalue%5D=1", function() {
                                                                $('#goAutoButton').html('STOP');
                                                                console.log('Przywrócono PA');
                                                                window.setTimeout(function() {
                                                                    if (autoGo) {
                                                                        autoGoWznawianie = false;
                                                                        click();
                                                                    }
                                                                }, 1000);
                                                            });
                                                        }
                                                    }, 1000);
                                                } else {
                                                    console.log('Brak napojów');
                                                    window.setTimeout(function() {
                                                        if (autoGo) {
                                                            probujWznowicAutoGo(array, autoGoBefore);
                                                        }
                                                    }, 1000);
                                                }
                                            })
                                        }
                                    }, 1000);
                                });
                            }
                            break;
                        default:
                            // code block
                    }
                } else {
                    autoGoWznawianie = false;
                    autoGo = false;
                    $('#goAutoButton').html('AutoGO');
                    $("#goStopReason").html("Brak PA").show();
                    document.title = "Brak PA";
                }
            } else {
                autoGoWznawianie = false;
                autoGo = false;
                $('#goAutoButton').html('AutoGO');
            }
        }

        $(document).on("click", "#goStopReason", function() {
            $(this).hide();
        })


        function przerwijAutoGoZPowoduBrakuPA(wznawiaj) {
            var d = new Date();
            var autoGoBefore = autoGo;
            autoGoWznawianie = true;
            console.log('PokeLifeScript: brak PA, próbuje wznowić');

            if (wznawiaj) {
                var array = [];
                if (config.useCzerwoneNapoje == "true" || config.useCzerwoneNapoje == true) {
                    array.push("useCzerwoneNapoje");
                }
                if (config.useZieloneNapoje == "true" || config.useZieloneNapoje == true) {
                    array.push("useZieloneNapoje");
                }
                if (config.useNiebieskieNapoje == "true" || config.useNiebieskieNapoje == true) {
                    array.push("useNiebieskieNapoje");
                }
                if (config.useEventoweNapoje == "true" || config.useEventoweNapoje == true) {
                    array.push("useEventoweNapoje");
                }
                if (config.useNiebieskieJagody == "true" || config.useNiebieskieJagody == true) {
                    array.push("useNiebieskieJagody");
                }
                if (config.useOnlyInNight == "true" || config.useOnlyInNight == true) {
                    var h = d.getHours();
                    if (h >= 22 || h < 6) {
                        window.setTimeout(function() {
                            probujWznowicAutoGo(array, autoGoBefore);
                        }, 1000);
                    } else {
                        autoGoWznawianie = false;
                        autoGo = false;
                        $('#goAutoButton').html('AutoGO');
                        $("#goStopReason").html("Brak PA").show();
                        document.title = "Brak PA";
                    }
                } else {
                    window.setTimeout(function() {
                        probujWznowicAutoGo(array, autoGoBefore);
                    }, 1000);
                }
            } else {
                autoGoWznawianie = false;
                autoGo = false;
                $('#goAutoButton').html('AutoGO');
            }
        }


        afterReloadMain(function() {
            if (autoGo && !autoGoWznawianie) {
                window.setTimeout(function() {
                    if (autoGo) {
                        click();
                    }
                }, clickDelay);
                clickDelay = getRandomInt(timeoutMin, timeoutMax);
            }
        })
    }
    initAutoGo();



    // **********************
    //
    // initAutoGoSettings
    // Funkcja dodająca ustawienia autoGo
    //
    // **********************

    function initAutoGoSettings() {

        $(document).on("click", "#goSettingsAutoGo", function() {
            if ($('#settingsAutoGo').length > 0) {
                $('#settingsAutoGo').remove();
            } else {
                $('body').append('<div id="settingsAutoGo" style="padding: 10px; position:fixed;top: 60px;right: 69px;width: 880px;background: white;opacity: 1;border: 7px solid #d6e9c6;z-index: 999;"></div>');
                $('#settingsAutoGo').append('<div class="row"><div class="col-sm-6 wznawianieSettings"><table> <tr> <th></th> <th></th> <th></th> </tr></table></div></div>');
                $('#settingsAutoGo .wznawianieSettings table').append('<col width="60"><col width="20"><col width="340">');
                $('#settingsAutoGo .wznawianieSettings table').append('<tr><td><img style="width: 40px;" src="images/pokesklep/duzy_napoj_energetyczny.jpg"></td><td><input type="checkbox" id="autoUseCzerwoneNapoje" name="autoUseCzerwoneNapoje" value="1" ' + ((config.useCzerwoneNapoje == "true" || config.useCzerwoneNapoje == true) ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; height: 50px; line-height: 44px; font-size: 14px; ">Używaj czerwonych napojów gdy zabraknie PA</label></td> </tr>');
                $('#settingsAutoGo .wznawianieSettings table').append('<tr><td><img style="width: 40px;" src="images/pokesklep/zielony_napoj.jpg"></td><td><input type="checkbox" id="autoUseZieloneNapoje" name="autoUseZieloneNapoje" value="1" ' + ((config.useZieloneNapoje == "true" || config.useZieloneNapoje == true) ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; height: 50px; line-height: 44px; font-size: 14px; ">Używaj zielonych napojów gdy zabraknie PA</label></td> </tr>');
                $('#settingsAutoGo .wznawianieSettings table').append('<tr><td><img style="width: 40px;" src="images/pokesklep/napoj_energetyczny.jpg"></td><td><input type="checkbox" id="autoUseNiebieskieNapoje" name="autoUseNiebieskieNapoje" value="1" ' + ((config.useNiebieskieNapoje == "true" || config.useNiebieskieNapoje == true) ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; line-height: 1.1; font-size: 14px; ">Używaj niebieskich napojów gdy zabraknie PA <span style="font-size: 9px">(niebieskie eventowe + niebieskie)</span></label></td> </tr>');

                $('#settingsAutoGo .wznawianieSettings table').append('<tr><td><img style="width: 40px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAHlBMVEX4+PgwMDBYwNCYmJiA6PjIyMho0OBYWFjQ+PhIsMBk4eMZAAACB0lEQVR4nO3d3Y6CMBCGYZfK3/3f8CYwHHxktmkXsVN93zNZSebRBFgEfTyIiIiIiIiIiD6rcS95ja2HqynNWz9ec+vhagISLSDR6hgyermb32R/bD3xH+mrnp3SnvOuySoDEi0g0eoRUrClXdwVl60xCmScvb1dbo1FsUBeHBAgN/U5kH2cWcuuEQWS5LVPBWtkD+OBXA4IkJsCEgZiO72SEx7Z0UXQ4nQQECA3BQTITR0Q6ThDkhvdju31YckO6F5IUkkJxF58eQQECBAgbSA5QY4FBAgQIEBeDzkd78rStG7ZshbXblyFHAuHrdX2kkCAAAESFWKtBrGn2PrRICbYdxWrfkJqAs3emBZn44EAAQLkH5ChOeRp5SDaSTBtAQECBMibINPumLqHDDZdAcQVTECAAAECpApis56O5hViIz+lyQsIECBAgBRCbOdwvvclI4gK2Wf1ITYeECBAgMSB2LZ1WJ2G/d7upQvIcR7I/ScDCBAgQKJCdC5btvQI0RYJCBAgQIAAAQIECJDvgQy5gAABAgTIBYieDpoqIFLDS8qBAAECpC+Iez9LPaT9DZVAgAAB0gnEsotQ1FMC0dsSG36dyAHx3pgSiH4BOBAgQIC8KftJgdOlgElyLxPUS7f9X1dpkH41dklBf3QLSLSAROtjIGN1YTa4RERERERERERERBS1XxA3rOR3FFuIAAAAAElFTkSuQmCC"></td><td><input type="checkbox" id="autoUseEventoweNapoje" name="autoUseEventoweNapoje" value="1" ' + ((config.useEventoweNapoje == "true" || config.useEventoweNapoje == true) ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; line-height: 1.1; font-size: 14px; ">Używaj eventowych napojów gdy zabraknie PA <span style="font-size: 9px">(te z przycisku w statystykach)</span></label></td> </tr>');
                $('#settingsAutoGo .wznawianieSettings table').append('<tr><td><img style="width: 40px;" src="images/pokesklep/niebieskie_jagody.jpg"></td><td><input type="checkbox" id="autoUseNiebieskieJagody" name="autoUseNiebieskieJagody" value="1" ' + ((config.useNiebieskieJagody == "true" || config.useNiebieskieJagody == true) ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; height: 50px; line-height: 44px; font-size: 14px; ">Używaj niebieskich jagód gdy zabraknie PA</label></td> </tr>');

                $('#settingsAutoGo .wznawianieSettings').append('<p>Bot będzie starał sie przywrócać PA w kolejności <b>Niebieskie Jagody</b> -> <b>Eventowe napoje</b> -> <b>Niebieskie napoje</b> -> <b>Zielone napoje</b> -> <b>Czerwone napoje</b></p>');

                $('#settingsAutoGo .row').append('<div class="col-sm-6 dziczSettings"><table> <tr> <th></th> <th></th> <th></th> </tr></table></div>');
                $('#settingsAutoGo .dziczSettings table').append('<col width="60"><col width="20"><col width="340">');
                $('#settingsAutoGo .dziczSettings table').append('<tr><td><img style="width: 40px;" src="images/pokesklep/czerwone_jagody.jpg"></td><td><input type="checkbox" id="autoUseCzerwoneJagody" name="autoUseCzerwoneJagody" value="1" ' + ((config.useCzerwoneJagody == "true" || config.useCzerwoneJagody == true) ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; height: 50px; line-height: 44px; font-size: 14px; ">Używaj czerwonych jagód do leczenia</label></td> </tr>');
                $('#settingsAutoGo .dziczSettings table').append('<tr style="height: 55px;"><td></td><td></td><td><p><b>Niezłapane: </b><select id="switchNiezlapane"><option value="1" ' + (Number(config.niezlapaneMode) == 1 ? 'selected' : '') + '>Zatrzymuj gdy spotkasz</option><option value="2" ' + (Number(config.niezlapaneMode) == 2 ? 'selected' : '') + '>Zatrzymuj tylko IV i V</option><option value="3" ' + (Number(config.niezlapaneMode) == 3 ? 'selected' : '') + '>Nie zatrzymuj</option><option value="4" ' + (Number(config.niezlapaneMode) == 4 ? 'selected' : '') + '>Rzucaj cherishballe w IV i V</option><select></p></td> </tr>');
                $('#settingsAutoGo .dziczSettings table').append('<tr><td><img style="width: 30px;" src="images/pokesklep/safariballe.jpg"></td><td><input type="checkbox" id="lapSafariballemNiezlapane" name="lapSafariballemNiezlapane" value="1" ' + ((config.lapSafariballemNiezlapane == "true" || config.lapSafariballemNiezlapane == true) ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; height: 50px; line-height: 44px; font-size: 14px;">Łap safariballem tylko niezłapane pokemony</label></td> </tr></tbody></table>');
                $('#settingsAutoGo .dziczSettings table').append('<tr><td></td><td><input type="checkbox" id="useOnlyInNight" name="useOnlyInNight" value="1" ' + ((config.useOnlyInNight == "true" || config.useOnlyInNight == true) ? "checked" : "") + ' style=" margin: 0; line-height: 50px; height: 50px; "></td><td><label style=" margin: 0; height: 50px; line-height: 44px; font-size: 14px; ">Używaj wznawiania PA tylko pomiędzy 22-6</label></td> </tr>');
                $('#settingsAutoGo .dziczSettings table').append('<tr style="height: 55px;"><td></td><td></td><td><p><b>Maxymalny łapany lvl: </b><input style="width: 50px" id="changeMaxLapanyLvl" type="number" value="' + config.maxLapanyLvl + '"></p></td> </tr>');
                $('#settingsAutoGo .dziczSettings table').append('<tr style="height: 55px;"><td></td><td></td><td><p><b>Kolejność widgetów: </b><select id="switchWidgetOrder"><option value="1" ' + (config.kolejnoscWidgetow == 1 ? 'selected' : '') + '>Zadania - Drużyna</option><option value="2" ' + (config.kolejnoscWidgetow == 2 ? 'selected' : '') + '>Drużyna - Zadania</option><select></p></td> </tr>');
                $('#settingsAutoGo .dziczSettings table').append('<tr style="height: 55px;"><td></td><td></td><td><p><b>Skrypt: </b> Script name:<input id="scriptName"> Script:<input style="width:150px" id="scriptText"> <button id="addNewScript">+</button</p></td> </tr>');
            }
        });

        $(document).on("change", "#switchNiezlapane", function(event) {
            config.niezlapaneMode = Number($(this).val());
            updateConfig(config);
        })

        $(document).on("change", "#changeMaxLapanyLvl", function(event) {
            config.maxLapanyLvl = $(this).val();
            updateConfig(config);
        })

        $(document).on("click", "#lapSafariballemNiezlapane", function(event) {
            var isChecked = $('#lapSafariballemNiezlapane').prop('checked');
            config.lapSafariballemNiezlapane = isChecked;
            updateConfig(config);
        });

        $(document).on("click", "#autoUseNiebieskieJagody", function(event) {
            var isChecked = $('#autoUseNiebieskieJagody').prop('checked');
            config.useNiebieskieJagody = isChecked;
            updateConfig(config);
        });

        $(document).on("click", "#autoUseCzerwoneJagody", function(event) {
            var isChecked = $('#autoUseCzerwoneJagody').prop('checked');
            config.useCzerwoneJagody = isChecked;
            updateConfig(config);
        });

        $(document).on("click", "#autoUseNiebieskieNapoje", function() {
            var isChecked = $('#autoUseNiebieskieNapoje').prop('checked');
            config.useNiebieskieNapoje = isChecked;
            updateConfig(config);
        });

        $(document).on("click", "#autoUseZieloneNapoje", function() {
            var isChecked = $('#autoUseZieloneNapoje').prop('checked');
            config.useZieloneNapoje = isChecked;
            updateConfig(config);
        });

        $(document).on("click", "#autoUseEventoweNapoje", function() {
            var isChecked = $('#autoUseEventoweNapoje').prop('checked');
            config.useEventoweNapoje = isChecked;
            updateConfig(config);
        });

        $(document).on("click", "#autoUseCzerwoneNapoje", function() {
            var isChecked = $('#autoUseCzerwoneNapoje').prop('checked');
            config.useCzerwoneNapoje = isChecked;
            updateConfig(config);
        });

        $(document).on("click", "#useOnlyInNight", function() {
            var isChecked = $('#useOnlyInNight').prop('checked');
            config.useOnlyInNight = isChecked;
            updateConfig(config);
        });

        $(document).on("click", "#addNewScript", function() {
            var text = $('#scriptText').val();
            var name = $('#scriptName').val();
            console.log(text);
            activeScript.push({ text: text, name: name });
            $('#settingsAutoGo .dziczSettings table').append('<tr style="height: 55px;"><td></td><td></td><td><p><b>' + name + '</b></p></td> </tr>');
        });

        $(document).on("change", "#switchWidgetOrder", function(event) {
            config.kolejnoscWidgetow = $(this).val();
            updateConfig(config);
            $.get('inc/stan.php', function(data) { $("#sidebar").html(data); });
        })

        $(document).on("change", "#changeMaxLapanyLvl", function(event) {
            config.maxLapanyLvl = $(this).val();
            updateConfig(config);
        })

    }
    initAutoGoSettings()



    // **********************
    //
    // initVersionInfo
    // Funkcja dodająca numer wersji na dole strony
    //
    // **********************




    // **********************
    //
    // initAutouzupelnianieFormularzy
    // Funkcja dodająca autouzupełnienie formularzy
    //
    // **********************

   

    // **********************
    //
    // initShinyWidget
    // Funkcja pokazująca ostatnie 3 złapane shiny na rynku
    //
    // **********************



    // **********************
    //
    // initPlecakTMView
    // Funkcja dodająca nowy widok do zakładki z TM w plecaku
    //
    // **********************

    function initPlecakTMView() {
        var tmData;

        var api = "https://raw.githubusercontent.com/krozum/pokelife/master/tm.json";
        $.getJSON(api, {
            format: "json"
        }).done(function(data) {
            tmData = data;
        });

        onReloadMain(function() {
            if (this.find('.panel-heading').html() === "Plecak") {
                this.find('#plecak-tm > .row > div.col-xs-4').each(function(index, val) {
                    var id = $(this).find('h3').html().split(" ")[1];
                    $(this).find("br").remove();
                    if (tmData["tm"][id - 1]["category_id"] == 1) {
                        $(this).children().css("background-color", "#f9856e");
                    } else if (tmData["tm"][id - 1]["category_id"] == 2) {
                        $(this).children().css("background-color", "#4d98b0");
                    } else if (tmData["tm"][id - 1]["category_id"] == 3) {
                        $(this).children().css("background-color", "#bdbcbb");
                    }
                    $(this).children().prepend('<br><img src="https://pokelife.pl/images/typy/' + tmData["tm"][id - 1]["type_id"] + '.png" style="width: 40px;">');
                });
            }
        })
    }
    initPlecakTMView();



    // **********************
    //
    // initPlecakTrzymaneView
    // Funkcja zmieniająca wygląd plecaka
    //
    // **********************

    function initPlecakTrzymaneView() {
        onReloadMain(function() {
            if (this.find('.panel-heading').html() === "Plecak") {
                var DATA = this;
                var arrayUzywane = [];
                var arrayJajka = [];
                var arrayMega = [];
                var arrayInne = [];
                var arrayInne2 = [];
                var arrayInne3 = [];
                var arrayInne4 = [];
                var arrayInne5 = [];
                var arrayModal = [];
                $.each(this.find('#plecak-trzymane > .row > div'), function(index, item) {
                    if ($(item).find(".modal-dialog").length > 0) {
                        arrayModal.push(item)
                    } else if ($(item).find(".caption .text-center:contains('Używa: ')").length > 0) {
                        arrayUzywane.push($(item));
                    } else if ($(item).find("img[src='images/przedmioty/100x100/lucky_egg.png']").length > 0) {
                        arrayJajka.push($(item));
                    } else if ($(item).find(".caption:contains('ite V')").length > 0) {
                        arrayMega.push($(item));
                    } else if ($(item).find(".caption:contains('ite X V')").length > 0) {
                        arrayMega.push($(item));
                    } else if ($(item).find(".caption:contains('ite Y V')").length > 0) {
                        arrayMega.push($(item));
                    } else if ($(item).find(".caption:contains(' V')").length > 0) {
                        arrayInne5.push($(item));
                    } else if ($(item).find(".caption:contains(' IV')").length > 0) {
                        arrayInne4.push($(item));
                    } else if ($(item).find(".caption strong:contains(' III')").length > 0) {
                        arrayInne3.push($(item));
                    } else if ($(item).find(".caption strong:contains(' II')").length > 0) {
                        arrayInne2.push($(item));
                    } else {
                        arrayInne.push($(item));
                    }
                    item.remove();
                })

                if (arrayUzywane.length > 0) {
                    var html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Używane</h3>";
                    $.each(arrayUzywane, function(index, item) {
                        html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                    })
                    html = html + "</div></div>"
                    this.find('#plecak-trzymane > .row').append(html);
                }

                if (arrayJajka.length > 0) {
                    html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Szczęśliwe jajko</h3>";
                    $.each(arrayJajka, function(index, item) {
                        html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                    })
                    html = html + "</div></div>"
                    this.find('#plecak-trzymane > .row').append(html);
                }

                if (arrayMega.length > 0) {
                    html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Mega kamienie</h3>";
                    $.each(arrayMega, function(index, item) {
                        html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                    })
                    html = html + "</div></div>"
                    this.find('#plecak-trzymane >.row').append(html);
                }

                if (arrayInne5.length > 0) {
                    html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Inne V</h3>";
                    $.each(arrayInne5, function(index, item) {
                        html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                    })
                    html = html + "</div></div>"
                    this.find('#plecak-trzymane > .row').append(html);
                }

                if (arrayInne4.length > 0) {
                    html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Inne IV</h3>";
                    $.each(arrayInne4, function(index, item) {
                        html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                    })
                    html = html + "</div></div>"
                    this.find('#plecak-trzymane > .row').append(html);
                }

                if (arrayInne3.length > 0) {
                    html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Inne III</h3>";
                    $.each(arrayInne3, function(index, item) {
                        html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                    })
                    html = html + "</div></div>"
                    this.find('#plecak-trzymane > .row').append(html);
                }

                if (arrayInne2.length > 0) {
                    html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Inne II</h3>";
                    $.each(arrayInne2, function(index, item) {
                        html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                    })
                    html = html + "</div></div>"
                    this.find('#plecak-trzymane > .row').append(html);
                }

                if (arrayInne.length > 0) {
                    html = "<div class='row'><div class='col-xs-12'><h3 style='text-align: center;'>Inne</h3>";
                    $.each(arrayInne, function(index, item) {
                        html = html + '<div class="col-xs-4 col-sm-3 col-md-3 col-lg-3" style="margin: 0; padding: 0;">' + item.html() + '</div>';
                    })
                    html = html + "</div></div>"
                    this.find('#plecak-trzymane > .row').append(html);
                }

                var THAT = this;
                $.each(arrayModal, function(index, item) {
                    $(item).appendTo(THAT.find('#plecak-trzymane > .row'));
                })
            }
        })
    }
    initPlecakTrzymaneView();



    // **********************
    //
    // initSzybkieKlikanieWLinkiPromocyjne
    // Funkcja dodająca szybkie klikanie w linki promocyjne
    //
    // **********************

    function initSzybkieKlikanieWLinkiPromocyjne() {

        function clickInLink(number, id) {
            if (number < 6) {
                var w = window.open("", "myWindow", "width=200,height=100");
                w.location.href = 'http://pokelife.pl/index.php?k=' + number + '&g=' + id;
                $(w).load(window.setTimeout(function() {
                    $('#klikniecie-' + number).html('TAK');
                    console.log('PokeLifeScript: klikam link ' + number);
                    window.setTimeout(function() {
                        w.close();
                        clickInLink(number + 1, id);
                    }, 300);
                }, 300));
            } else {
                window.setTimeout(function() {
                    $.get('inc/stan.php', function(data) { $("#sidebar").html(data); });
                }, 300);
            }
        }

        onReloadMain(function() {
            var DATA = this;
            if (DATA.find('.panel-heading').html() === "Promuj stronę") {
                var html = '<div class="col-xs-12" style=" text-align: center; "><button id="clickAllLinks" style=" background-color: ' + $('.panel-heading').css('background-color') + '; border: 1px solid ' + $('.panel-heading').css('background-color') + '; border-radius: 5px; padding: 2px 20px; line-height: 20px; height: 30px; ">Wyklikaj wszystkie</button></div>';
                DATA.find('.panel-body>div:first-of-type').append(html);
            }
        })

        $(document).on("click", "#clickAllLinks", function(event) {
            var id = $('#klikniecie-1').parent().find("a").attr("onclick").split(",")[1].split(")")[0];
            window.setTimeout(function() { clickInLink(1, id); }, 400);
        });
    }
    initSzybkieKlikanieWLinkiPromocyjne();



    // **********************
    //
    // initStatystykiLink
    // Funkcja dodająca link do statystyk
    //
    // **********************

 


    // **********************
    //
    // initLogger
    // Funkcja dodająca logowanie tego co wyświetla sie na ekranie
    // eventTypeId:
    // 1 - pusta wyprawa
    // 2 - walka z trenerem wygrana
    // 3 - walka z trenerem przegrana
    // 4 - spotkany pokemon
    // 5 - walka wygrana
    // 6 - walka przegrana
    // 7 - pokemon złapany
    // 8 - pokemon niezłapany
    // 9 - zebrane jagody
    // 10 - event w dziczy
    // **********************

  
    //
    // initWbijanieSzkoleniowca
    // Funkcja automatycznie przechodząca po przechowalni i zwiększaniu treningów do miniumum 7 w każdą statystyke
    //
    // **********************

    function initWbijanieSzkoleniowca() {
        var array = [];
        var affected = 0;
        var price = 0;
        var max = 0;
        var now = 0;

        //$('#pasek_skrotow > .navbar-nav').append('<li><a id="skrot_szkoleniowiec" href="#" data-toggle="tooltip" data-placement="top" title="" data-original-title="Wbijaj osiągnięcie szkoleniowca"><div class="pseudo-btn"><img src="https://raw.githubusercontent.com/krozum/pokelife/master/assets/3b79fd270c90c0dfd90763fcf1b54346-trofeo-de-campe--n-estrella-by-vexels.png"></div></a></li>');

        onReloadMain(function() {
            array = [];
            if (this.find('.panel-heading').html() === "Pokemony") {
                this.find('#pokemony-przechowalnia select[name="kolejnosc"]').parent().prepend('<button class="plugin-button" id="wbijajSzkoleniowca" style="padding: 5px 10px; border-radius: 3px; margin-bottom: 15px">Wbijaj szkoleniowca</button><br>');
                $.each(this.find('#pokemony-przechowalnia .btn-podgladpoka'), function(index, item) {
                    if (Number($(item).parent().data('poziom')) >= 5) {
                        array.push($(item).data('id-pokemona'));
                    }
                })
            }
        })

        $(document).on('click', '#skrot_szkoleniowiec', function() {
            reloadMain("#glowne_okno", 'gra/druzyna.php?p=3', function() {
                $('#wbijajSzkoleniowca').trigger('click');
            });
        });

        $(document).on('click', '#wbijajSzkoleniowca', function() {
            max = array.length;
            now = 0;
            wbijajSzkoleniowca(array);
        });

        function trenuj(array, callback) {
            if (array.length > 0) {
                window.setTimeout(function() {
                    reloadMain("#glowne_okno", "gra/" + array.pop(), function() {
                        price = Number(price) + Number($('.alert-success b:nth(1)').html().split(" ¥")[0].replace(/\./g, ''));
                        trenuj(array, callback);
                    })
                }, 1000);
            } else {
                callback.call();
            }
        }

        function wbijajSzkoleniowca(array) {
            if (array.length > 0) {
                if ($('#szkoleniowiec_progress').length < 1) {
                    $('body').append('<div id="szkoleniowiec_progress" class="" style="position: fixed;bottom: 60px;width: 500px;height: auto;z-index: 999;margin: 0 auto;left: 0;right: 0;background-color: inherit;border: none;"><div class="progress" style="margin:0;box-shadow: none;border-radius: 0; border: 1px solid black"><div class="progress-bar progress-bar-danger" role="progressbar" style="border-radius: 0; width: ' + Number((((max - array.length) * 100) / max)).toFixed(0) + '%;"> <span>' + Number((((max - array.length) * 100) / max)).toFixed(0) + '%</span></div></div></div>');
                } else {
                    $('#szkoleniowiec_progress .progress-bar').css('width', Number((((max - array.length) * 100) / max)).toFixed(0) + '%');
                    $('#szkoleniowiec_progress .progress-bar span').html(Number((((max - array.length) * 100) / max)).toFixed(0) + '%');
                }
                var id = array.pop();
                now++;

                window.setTimeout(function() {
                    reloadMain("#glowne_okno", "gra/sala.php?p=" + id + "&zrodlo=rezerwa", function() {
                        var treningi = [];
                        var i;
                        for (var j = 1; j <= 6; j++) {
                            var count = Number($('.sala_atrybuty_tabelka .row:nth(' + j + ') > div:nth(2)').html());
                            var ile = 0;
                            if (j != 6) {
                                ile = 7 - count;
                            } else {
                                ile = 35 - count;
                                ile = ile / 5;
                            }
                            if (ile > 0) {
                                affected = affected + ile;
                                treningi.push($('.sala_atrybuty_tabelka .row:nth(' + j + ') > div:nth(3) > form').attr('action') + "&postData%5B0%5D%5Bname%5D=ilosc&postData%5B0%5D%5Bvalue%5D=" + ile);
                            }
                        }
                        trenuj(treningi, function() { wbijajSzkoleniowca(array) });
                    })
                }, 1000);
            } else {
                $('#szkoleniowiec_progress').remove();
                reloadMain("#glowne_okno", 'gra/druzyna.php?p=3', function() {
                    $('#pokemony-przechowalnia select[name="kolejnosc"]').parent().prepend('<p class="alert alert-success text-center">Wykonano <b>' + affected + '</b> treningów o łącznej wartości <b>' + price + ' ¥</b></p>');
                    price = 0;
                    affected = 0;
                });
            }
        }
    }
    initWbijanieSzkoleniowca();



    // **********************
    //
    // initChat
    // Funkcja dodająca czat bota
    //
    // **********************

   


    // **********************
    //
    // initPokemonyLiga
    // Funkcja zapisuje pokemony graczy w lidze
    //
    // **********************

   


    // **********************
    //
    // initZadaniaWidget
    // Funkcja pokazująca aktualne zadania w sidebar
    //
    // **********************

    function initZadaniaWidget() {
        var d = new Date();
        var today = d.getFullYear() + "" + d.getMonth() + "" + d.getDate();
        var login = $('#wyloguj').parent().parent().html().split("<div")[0].trim();
        var zadaniaWidget;

        function refreshZadaniaWidget() {
            $.ajax({
                type: 'POST',
                url: "gra/zadania.php"
            }).done(function(response) {
                parseResponse($(response));
                $.get('inc/stan.php', function(data) { $("#sidebar").html(data); });
            })
        }
        if (config.zadaniaWidget == undefined || !config.zadaniaWidget.includes(today) || !config.zadaniaWidget.includes(login)) {
            refreshZadaniaWidget();
        } else {
            zadaniaWidget = config.zadaniaWidget;
        }

        function parseResponse(THAT) {
            var html = '<div class="panel panel-primary"><div class="panel-heading">Zadania<div class="navbar-right"><span id="refreshZadaniaWidget" style="color: white; top: 4px; font-size: 16px; right: 3px;" class="glyphicon glyphicon-refresh" aria-hidden="true"></span></div></div><table class="table table-striped table-condensed"><tbody>';
            $.each(THAT.find('#zadania_codzienne .panel-primary .panel-heading'), function(key, value) {
                if ($(value).html().split("<div")[0] !== "brak zadania") {
                    html = html + '<tr><td>' + $(value).html().split("<div")[0];
                }
                if ($(value).parent().find(".text-center").html() != undefined) {
                    $.each($(value).parent().find(".text-center p"), function(key2, value2) {
                        html = html + " - " + $(value2).html().trim();
                    })
                }
                html = html + '</tr></td>';
            });
            html = html + '</tbody></table></div>';
            zadaniaWidget = html;
            config.zadaniaWidget = html;
            updateConfig(config);
        }

        onReloadSidebar(function() {
            if (zadaniaWidget != undefined && zadaniaWidget.length > 140) {
                if (config.kolejnoscWidgetow == 1) {
                    this.find(".panel-heading:contains('Drużyna')").parent().before(zadaniaWidget);
                } else if (config.kolejnoscWidgetow == 2) {
                    this.find(".panel-heading:contains('Drużyna')").parent().after(zadaniaWidget);
                }
            }
        })

        onReloadMain(function() {
            var THAT = this;
            if (this.find('.panel-heading').html() === "Zadania") {
                parseResponse(THAT);
            }
        })

        $(document).on("click", "#refreshZadaniaWidget", function(event) {
            refreshZadaniaWidget();
            $.get('inc/stan.php', function(data) { $("#sidebar").html(data); });
        });
    }
    initZadaniaWidget();



    // **********************
    //
    // initPokemonDniaWidget
    // Funkcja dodająca pokemona dnia do sidebaru
    //
    // **********************

    function initPokemonDniaWidget() {
        var d = new Date();
        d.setMinutes(d.getMinutes() - 21);
        var today = d.getFullYear() + "" + d.getMonth() + "" + d.getDate();
        var hodowlaPokemonDniaImage;
        var hodowlaPokemonDniaStowarzyszenieImage;

        var login = $('#wyloguj').parent().parent().html().split("<div")[0].trim();

        if (!config.hodowlaPokemonDniaImage.includes(today) || !config.hodowlaPokemonDniaImage.includes(login)) {
            $.ajax({
                type: 'POST',
                url: "gra/hodowla.php"
            }).done(function(response) {
                parseResponse($(response));
            });
        } else {
            hodowlaPokemonDniaImage = config.hodowlaPokemonDniaImage.replace(today, "");
            hodowlaPokemonDniaImage = hodowlaPokemonDniaImage.replace(login, "");
            hodowlaPokemonDniaStowarzyszenieImage = config.hodowlaPokemonDniaStowarzyszenieImage.replace(today, "");
            hodowlaPokemonDniaStowarzyszenieImage = hodowlaPokemonDniaStowarzyszenieImage.replace(login, "");
        }

        function parseResponse(THAT) {
            hodowlaPokemonDniaImage = THAT.find('#hodowla-glowne img').attr('src');
            config.hodowlaPokemonDniaImage = today + "" + login + hodowlaPokemonDniaImage;
            hodowlaPokemonDniaStowarzyszenieImage = THAT.find('#hodowla-glowne img:nth(1)').attr('src');
            if (THAT.find('.panel-heading:contains("Pokemon dnia Stowa")').length == 0) {
                hodowlaPokemonDniaStowarzyszenieImage = undefined;
            }
            config.hodowlaPokemonDniaStowarzyszenieImage = today + "" + login + hodowlaPokemonDniaStowarzyszenieImage;
            updateConfig(config);
        }

        onReloadMain(function() {
            var THAT = this;
            if (this.find('.panel-heading').html() === "Hodowla Pokemon") {
                parseResponse(THAT);
            }
        })

        onReloadSidebar(function() {
            if (hodowlaPokemonDniaImage !== undefined && hodowlaPokemonDniaImage !== "undefined") {
                this.find('button[href="raport.php"]').parent().prepend('<img class="btn-akcja" href="hodowla.php?wszystkie&pokemon_dnia" src="https://gra.pokelife.pl/' + hodowlaPokemonDniaImage + '" data-toggle="tooltip" data-placement="top" title="" data-original-title="Pokemon Dnia" style="cursor: pointer; width: 50px;margin-left: 10px; float: left; ">');
                this.find('button[href="raport.php"]').parent().css('margin-top', '10px').css('padding-right', '10px');
                $('[data-toggle="tooltip"]').tooltip();
            }
            if (hodowlaPokemonDniaStowarzyszenieImage !== undefined && hodowlaPokemonDniaStowarzyszenieImage !== "undefined") {
                this.find('button[href="raport.php"]').parent().prepend('<img class="btn-akcja" href="hodowla.php?wszystkie&pokemon_dnia_stow"" src="https://gra.pokelife.pl/' + hodowlaPokemonDniaStowarzyszenieImage + '" data-toggle="tooltip" data-placement="top" title="" data-original-title="Pokemon Dnia Stowarzyszenia" style="cursor: pointer; width: 50px;margin-left: 10px; float: left; ">');
                this.find('button[href="raport.php"]').parent().css('margin-top', '10px').css('padding-right', '10px');
                $('[data-toggle="tooltip"]').tooltip();
            }
        })
    }
    initPokemonDniaWidget();



    // **********************
    //
    // initPrzypomnienieOPracy()
    // Funkcja dodająca przypomnienie o pracy po wyjściu poza obszar strony
    //
    // **********************

    function initPrzypomnienieOPracy() {
        $('body').append('<div id="jobAlertBox" style="position: fixed; width: 100%; height: 100%; background: linear-gradient(rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0) 100%); z-index: 99999; top: 0px; display: none;"><h1 style="text-align: center;color: #dadada;font-size: 90px;vertical-align: middle;">Brak aktywności</h1></div>');

        var addEvent = function(obj, evt, fn) {
            if (obj.addEventListener) {
                obj.addEventListener(evt, fn, false);
            } else if (obj.attachEvent) {
                obj.attachEvent("on" + evt, fn);
            }
        };

        addEvent(document, "mouseout", function(event) {
            event = event ? event : window.event;
            var d = new Date();
            var h = d.getHours();
            var from = event.relatedTarget || event.toElement;
            if ((!from || from.nodeName == "HTML") && event.clientY <= 10 && $('.alert-info a[href="aktywnosc.php"]').length == 0) {
                $("#jobAlertBox").css('display', 'block');
            }
        });

        addEvent(document, "mouseover", function(event) {
            $('#jobAlertBox').css('display', "none");
        });
    }
    initPrzypomnienieOPracy();



    // **********************
    //
    // initWystawView()
    // Funkcja pokazuje ceny dla danego przedmiotu
    //
    // **********************
    function initWystawView() {
        onReloadMain(function() {
            var DATA = this;
            if (this.find('.panel-heading').html() === "Targ - Wystaw Przedmioty") {
                $(DATA).find("#targ_wysprz-zwykle input[value='Wystaw']").after('<input type="button" style="width: 25%;margin-left: 3%;" class="check-price form-control btn btn-primary" value="?">');
                $(DATA).find("#targ_wysprz-zwykle input[value='Wystaw']").css("width", "70%");
                if (this.find('.panel-heading').html() === "Targ - Wystaw Przedmioty") {
                    if ($(DATA).find(".panel-primary").length > 0) {
                        initSummary(DATA);
                    }
                }
            }
        })

        $(document).off("click", "#targ_wysprz-zwykle .check-price");
        $(document).on("click", "#targ_wysprz-zwykle .check-price", function() {
            $('#marketTable').remove();
            $('body').append("<div id='marketTable' style='z-index: 999; width: 260px; height: 400px; position: fixed; right: 0; background: white; bottom: 60px;border: 2px dashed; overflow: scroll; overflow-x:hidden'></div>")

            var przedmiot = $(this).parent().parent().find("input[name='nazwa']").val();
            var THAT = $(this).parent().parent();
            THAT.find('input[name="ilosc"]').val(THAT.parent().find("div").html().split('</b> - ')[1].split(' sztuk')[0]);

            $.ajax({
                type: 'POST',
                url: "gra/targ_prz.php"
            }).done(function(response) {
                window.setTimeout(function() {
                    $.ajax({
                        type: 'POST',
                        url: "gra/targ_prz.php?szukaj&przedmiot=" + przedmiot + "&zakladka=0&value587",
                    }).done(function(response) {
                        $.ajax({
                            type: 'POST',
                            url: "gra/targ_prz.php?oferty_strona&&przedmiot=" + przedmiot + "&value587&strona=1",
                        }).done(function(response) {
                            if (response.indexOf("Brak ofert.") < 0) {
                                var max = 1;
                                if ($($(response).find("form span")[2]).html() != "-----") {
                                    var price = Number($($(response).find("form span")[2]).html().split("&nbsp;")[0].replace(/\./g, '')) * max;
                                    THAT.find('input[name="cena_yeny"]').val(price - 1);
                                } else {
                                    THAT.find('input[name="cena_yeny"]').val("brak");
                                }
                            } else {
                                THAT.find('input[name="cena_yeny"]').val("brak");
                            }

                            $(response).find("form[action='targ_prz.php?szukaj&przedmiot=" + przedmiot + "']").each(function(index, val) {
                                var img = $($(this).find("span")[0]);
                                var quantity = $($(this).find("span")[1]);
                                var price = $($(this).find("span")[2]);
                                var pricePZ = $($(this).find("span")[3]);
                                if (price.html() !== "-----") {
                                    var html = '<div style="display: table;width: 100%;height: 30px;padding: 5px;"><div style="display: table-cell;width: 70px;">' + img.html() + '</div><div style="display: table-cell;text-align: left;width: 100px;">' + quantity.html() + '</div><div style="display: table-cell;text-align: left;width: 100px;">' + price.html() + '</div><div style="display: table-cell;text-align: left;width: 70px;">' + pricePZ.html() + '</div></div>';
                                    $('#marketTable').append(html);
                                }
                            });
                        })
                    })
                }, 500);
            })
        });


        function initSummary(DATA) {
            var summaryCount = 0;
            var summarYen = 0;
            var summaryZas = 0;

            var panel = $(DATA).find(".panel-primary")[0];
            var table = $(panel).find("tr");
            $.each($(table), function(index, item) {
                var itemToSell = $(item).find("td");
                if (itemToSell.length > 5) {
                    let count = Number.parseInt(itemToSell[1].innerText);
                    let yenForEach = Number.parseInt(itemToSell[2].innerText);
                    let zasForEach = Number.parseInt(itemToSell[3].innerText);
                    if (isNaN(count))
                        count = 0;
                    if (isNaN(yenForEach))
                        yenForEach = 0;
                    if (isNaN(zasForEach))
                        zasForEach = 0;

                    summaryCount = summaryCount + count;
                    summarYen = summarYen + (count * yenForEach);
                    summaryZas = summaryZas + (count * zasForEach);
                }

            });

            var sumaJagodyCount = 0;
            var sumaJagodyYen = 0;
            var sumaJagodyZas = 0;

            $(DATA).find('#targ_wysprz-zwykle').css('margin-top', '20px');

            $(DATA).find(".panel .panel-primary:contains('Twoje oferty na targu') tbody").append(`
<tr>
<td></td>
<td id="summaryCount">` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(summaryCount) + `</td>
<td id="summarYen">` + new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(summarYen) + `</td>
<td id="summaryZas">` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(summaryZas) + ` §</td>
<td></td>
<td></td>
</tr>
`)

            $($(DATA).find(".panel .panel-primary")[0]).after(`
<div class="panel panel-primary">
<div class="panel-heading" style="cursor: pointer">Możliwy zarobek z jagód</div>
<table class="table table-strippedd">
<tbody id="JagodytoAppend">
<tr>
<th>&nbsp;</th>
<th>Ilość</th>
<th>Cena ¥</th>
<th>Cena §</th>
</tr>` + (
                $(DATA).find('input[name="nazwa_full"][value="Fioletowe Jagody"]').length > 0 ? `
<tr class="classToSum hidden"
data-count="` + (1 * $(DATA).find('input[name="nazwa_full"][value="Fioletowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-yen="` + (5000 * $(DATA).find('input[name="nazwa_full"][value="Fioletowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-zas="` + (2 * $(DATA).find('input[name="nazwa_full"][value="Fioletowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `
">
<td>
<img src="images/pokesklep/fioletowe_jagody.jpg" class="visible-lg-inline" style="width: 72px;">
</td>
<td id="summaryCount">` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format($(DATA).find('input[name="nazwa_full"][value="Fioletowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summarYen">~ ` + new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(5000 * $(DATA).find('input[name="nazwa_full"][value="Fioletowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summaryZas">~ ` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(2 * $(DATA).find('input[name="nazwa_full"][value="Fioletowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
</tr>
` : ``) + (
                $(DATA).find('input[name="nazwa_full"][value="Niebieskie Jagody"]').length > 0 ? `
<tr class="classToSum hidden"
data-count="` + (1 * $(DATA).find('input[name="nazwa_full"][value="Niebieskie Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-yen="` + (17000 * $(DATA).find('input[name="nazwa_full"][value="Niebieskie Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-zas="` + (3 * $(DATA).find('input[name="nazwa_full"][value="Niebieskie Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `
">
<td>
<img src="images/pokesklep/niebieskie_jagody.jpg" class="visible-lg-inline" style="width: 72px;">
</td>
<td id="summaryCount">` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format($(DATA).find('input[name="nazwa_full"][value="Niebieskie Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summarYen">~ ` + new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(17000 * $(DATA).find('input[name="nazwa_full"][value="Niebieskie Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summaryZas">~ ` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(3 * $(DATA).find('input[name="nazwa_full"][value="Niebieskie Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
</tr>
` : ``) + (
                $(DATA).find('input[name="nazwa_full"][value="Żółte Jagody"]').length > 0 ? `
<tr class="classToSum hidden"
data-count="` + (1 * $(DATA).find('input[name="nazwa_full"][value="Żółte Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-yen="` + (10000 * $(DATA).find('input[name="nazwa_full"][value="Żółte Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-zas="` + (3 * $(DATA).find('input[name="nazwa_full"][value="Żółte Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `
">
<td>
<img src="images/pokesklep/zolte_jagody.jpg" class="visible-lg-inline" style="width: 72px;">
</td>
<td id="summaryCount">` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format($(DATA).find('input[name="nazwa_full"][value="Żółte Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summarYen">~ ` + new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(10000 * $(DATA).find('input[name="nazwa_full"][value="Żółte Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summaryZas">~ ` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(3 * $(DATA).find('input[name="nazwa_full"][value="Żółte Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
</tr>
` : ``) + (
                $(DATA).find('input[name="nazwa_full"][value="Zielone Jagody"]').length > 0 ? `
<tr class="classToSum hidden"
data-count="` + (1 * $(DATA).find('input[name="nazwa_full"][value="Zielone Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-yen="` + (48000 * $(DATA).find('input[name="nazwa_full"][value="Zielone Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-zas="` + (15 * $(DATA).find('input[name="nazwa_full"][value="Zielone Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `
">
<td>
<img src="images/pokesklep/zielone_jagody.jpg" class="visible-lg-inline" style="width: 72px;">
</td>
<td id="summaryCount">` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format($(DATA).find('input[name="nazwa_full"][value="Zielone Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summarYen">~ ` + new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(48000 * $(DATA).find('input[name="nazwa_full"][value="Zielone Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summaryZas">~ ` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(15 * $(DATA).find('input[name="nazwa_full"][value="Zielone Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
</tr>
` : ``) + (
                $(DATA).find('input[name="nazwa_full"][value="Pomarańczowe Jagody"]').length > 0 ? `
<tr class="classToSum hidden"
data-count="` + (1 * $(DATA).find('input[name="nazwa_full"][value="Pomarańczowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-yen="` + (56000 * $(DATA).find('input[name="nazwa_full"][value="Pomarańczowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-zas="` + (15 * $(DATA).find('input[name="nazwa_full"][value="Pomarańczowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `
">
<td>
<img src="images/pokesklep/pomaranczowe_jagody.jpg" class="visible-lg-inline" style="width: 72px;">
</td>
<td id="summaryCount">` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format($(DATA).find('input[name="nazwa_full"][value="Pomarańczowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summarYen">~ ` + new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(56000 * $(DATA).find('input[name="nazwa_full"][value="Pomarańczowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summaryZas">~ ` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(15 * $(DATA).find('input[name="nazwa_full"][value="Pomarańczowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
</tr>
` : ``) + (
                $(DATA).find('input[name="nazwa_full"][value="Purpurowe Jagody"]').length > 0 ? `
<tr class="classToSum hidden"
data-count="` + (1 * $(DATA).find('input[name="nazwa_full"][value="Purpurowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-yen="` + (48000 * $(DATA).find('input[name="nazwa_full"][value="Purpurowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-zas="` + (15 * $(DATA).find('input[name="nazwa_full"][value="Purpurowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `
">
<td>
<img src="images/pokesklep/purpurowe_jagody.jpg" class="visible-lg-inline" style="width: 72px;">
</td>
<td id="summaryCount">` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format($(DATA).find('input[name="nazwa_full"][value="Purpurowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summarYen">~ ` + new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(48000 * $(DATA).find('input[name="nazwa_full"][value="Purpurowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summaryZas">~ ` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(15 * $(DATA).find('input[name="nazwa_full"][value="Purpurowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
</tr>
` : ``) + (
                $(DATA).find('input[name="nazwa_full"][value="Różowe Jagody"]').length > 0 ? `
<tr class="classToSum hidden"
data-count="` + (1 * $(DATA).find('input[name="nazwa_full"][value="Różowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-yen="` + (53000 * $(DATA).find('input[name="nazwa_full"][value="Różowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-zas="` + (15 * $(DATA).find('input[name="nazwa_full"][value="Różowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `
">
<td>
<img src="images/pokesklep/rozowe_jagody.jpg" class="visible-lg-inline" style="width: 72px;">
</td>
<td id="summaryCount">` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format($(DATA).find('input[name="nazwa_full"][value="Różowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summarYen">~ ` + new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(53000 * $(DATA).find('input[name="nazwa_full"][value="Różowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summaryZas">~ ` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(15 * $(DATA).find('input[name="nazwa_full"][value="Różowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
</tr>
` : ``) + (
                $(DATA).find('input[name="nazwa_full"][value="Brązowe Jagody"]').length > 0 ? `
<tr class="classToSum hidden"
data-count="` + (1 * $(DATA).find('input[name="nazwa_full"][value="Brązowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-yen="` + (60000 * $(DATA).find('input[name="nazwa_full"][value="Brązowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-zas="` + (15 * $(DATA).find('input[name="nazwa_full"][value="Brązowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `
">
<td>
<img src="images/pokesklep/brazowe_jagody.jpg" class="visible-lg-inline" style="width: 72px;">
</td>
<td id="summaryCount">` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format($(DATA).find('input[name="nazwa_full"][value="Brązowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summarYen">~ ` + new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(60000 * $(DATA).find('input[name="nazwa_full"][value="Brązowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summaryZas">~ ` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(15 * $(DATA).find('input[name="nazwa_full"][value="Brązowe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
</tr>
` : ``) + (
                $(DATA).find('input[name="nazwa_full"][value="Białe Jagody"]').length > 0 ? `
<tr class="classToSum hidden"
data-count="` + (1 * $(DATA).find('input[name="nazwa_full"][value="Białe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-yen="` + (1500 * $(DATA).find('input[name="nazwa_full"][value="Białe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `"
data-zas="` + (1 * $(DATA).find('input[name="nazwa_full"][value="Białe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `
">
<td>
<img src="images/pokesklep/biale_jagody.jpg" class="visible-lg-inline" style="width: 72px;">
</td>
<td id="summaryCount">` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format($(DATA).find('input[name="nazwa_full"][value="Białe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summarYen">~ ` + new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(1500 * $(DATA).find('input[name="nazwa_full"][value="Białe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
<td id="summaryZas">~ ` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(1 * $(DATA).find('input[name="nazwa_full"][value="Białe Jagody"]').parent().parent().find('.col-md-12').html().split('b> - ')[1].split(" sztuk")[0]) + `</td>
</tr>
` : ``) + `
</tbody>
</table>
</div>`)


            $.each($(DATA.find('.classToSum')), function(index, item) {
                sumaJagodyCount = sumaJagodyCount + (1 * $(item).data('count'));
                sumaJagodyYen = sumaJagodyYen + (1 * $(item).data('yen'));
                sumaJagodyZas = sumaJagodyZas + (1 * $(item).data('zas'));
            });

            $(DATA).find("#JagodytoAppend").append(`
<tr>
<td>
<img src="images/yen.png" class="visible-lg-inline" style="width: 26px; margin: -6px 0px -6px 10px;">
</td>
<td id="summaryCount">` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(sumaJagodyCount) + `</td>
<td id="summarYen">~ ` + new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(sumaJagodyYen) + `</td>
<td id="summaryZas">~ ` + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(sumaJagodyZas) + `</td>
</tr>`);
        }

        $(document).on('click', '.panel-heading:contains("Możliwy zarobek z jagód")', function() {
            if ($('.classToSum.hidden').length > 0) {
                $('.classToSum').removeClass('hidden');
            } else {
                $('.classToSum').addClass('hidden');
            }
        });

        $('body').off('click', ':not(#marketTable, #marketTable *)');
        $('body').on('click', ':not(#marketTable, #marketTable *)', function() {
            $('#marketTable').empty().remove()
        });

    }
    initWystawView();



    // **********************
    //
    // initRozbudowanyOpisDziczy
    // Funkcja dodająca podgląd statystyk dotyczących dziczy
    //
    // **********************

   



    // **********************
    //
    // initPrzypomnienieORepelu()
    // Funkcja dodająca przypomnienie o konczącym sie repelu
    //

    function initPrzypomnienieORepelu() {
        onReloadSidebar(function() {
            if (this.find('.well-stan[data-original-title="Czas pozostały do końca działania Tepela/Repela"]').length > 0) {
                var ile = Number(this.find('.well-stan[data-original-title="Czas pozostały do końca działania Tepela/Repela"]').text());
                if (ile < 200) {
                    var opacity = (200 - ile) / 200;
                    this.find('.well-stan[data-original-title="Czas pozostały do końca działania Tepela/Repela"]').css("background-color", "rgba(255, 117, 117, " + opacity + ")");
                }
            }
        })
    }
    initPrzypomnienieORepelu();



    // **********************
    //
    // initSprawdzCzyMaszAktualnaWersjeBota
    // Funkcja dodająca sprawdzenie aktualnej wersji bota na serwerze
    //
    // **********************




    // **********************
    //
    // initPrzypomnienieOOpiece
    // Funkcja dodająca przypomnienie o opiece
    //
    // **********************

    function initPrzypomnienieOOpiece() {
        $('.statystyki-wyglad:nth-child(13):contains("nie")').css("color", "red").css("font-weight", "800");
        $('.statystyki-wyglad:nth-child(13):contains("nie")').append('<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>');

        onReloadMain(function() {
            if (this.find('.panel-heading').html() === "Statystyki") {
                this.find('.statystyki-wyglad:nth-child(13):contains("nie")').css("color", "red").css("font-weight", "800");
                this.find('.statystyki-wyglad:nth-child(13):contains("nie")').append('<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>');
            }
        })
    }
    initPrzypomnienieOOpiece();


}

function getTableWithType() {
    var table = []
    var normal = $('.panel-body.nopadding img[src="images/typy/1.png"]').length > 0;
    if (normal)
        table.push("Normalny");
    var fire = $('.panel-body.nopadding img[src="images/typy/2.png"]').length > 0;
    if (fire)
        table.push("Ognisty");
    var water = $('.panel-body.nopadding img[src="images/typy/3.png"]').length > 0;
    if (water)
        table.push("Wodny");
    var grass = $('.panel-body.nopadding img[src="images/typy/4.png"]').length > 0;
    if (grass)
        table.push("Trawiasty");
    var electro = $('.panel-body.nopadding img[src="images/typy/5.png"]').length > 0;
    if (electro)
        table.push("Elektryczny");
    var fly = $('.panel-body.nopadding img[src="images/typy/6.png"]').length > 0;
    if (fly)
        table.push("Latający");
    var psycho = $('.panel-body.nopadding img[src="images/typy/7.png"]').length > 0;
    if (psycho)
        table.push("Psychiczny");
    var poison = $('.panel-body.nopadding img[src="images/typy/8.png"]').length > 0;
    if (poison)
        table.push("Trujący");
    var ghost = $('.panel-body.nopadding img[src="images/typy/9.png"]').length > 0;
    if (ghost)
        table.push("Duch");
    var fight = $('.panel-body.nopadding img[src="images/typy/10.png"]').length > 0;
    if (fight)
        table.push("Walka");
    var steel = $('.panel-body.nopadding img[src="images/typy/11.png"]').length > 0;
    if (steel)
        table.push("Stalowy");
    var earth = $('.panel-body.nopadding img[src="images/typy/12.png"]').length > 0;
    if (earth)
        table.push("Ziemnny");
    var rock = $('.panel-body.nopadding img[src="images/typy/13.png"]').length > 0;
    if (rock)
        table.push("Kamienny");
    var ice = $('.panel-body.nopadding img[src="images/typy/14.png"]').length > 0;
    if (ice)
        table.push("Lodowy");
    var dark = $('.panel-body.nopadding img[src="images/typy/15.png"]').length > 0;
    if (dark)
        table.push("Mroczny");
    var nbug = $('.panel-body.nopadding img[src="images/typy/16.png"]').length > 0;
    if (nbug)
        table.push("Robak");
    var dragon = $('.panel-body.nopadding img[src="images/typy/17.png"]').length > 0;
    if (dragon)
        table.push("Smok");
    var fairy = $('.panel-body.nopadding img[src="images/typy/18.png"]').length > 0;
    if (fairy)
        table.push("Wróżka");

    return table
}

$.getJSON(domain + "pokelife/api/get_user.php?login=" + $('#wyloguj').parent().parent().html().split("<div")[0].trim() + "&time=" + Date.now(), {
    format: "json"
}).done(function(data) {
    console.log(data);

    styles = data.styles;

    if (data.user != null) {
        window.localStorage.falseLogin = data.user.false_login;
    }

    if (data.user != null && data.user.config != "") {
        config = JSON.parse(data.user.config);
        if (config.customStyleBackground == undefined) {
            config.customStyleBackground = "#3c3c3c";
            config.customStyleTabs = "#C6E9D0";
            updateConfig(config);
        }
        if (config.customStyleFont == undefined) {
            config.customStyleFont = "#000000";
            updateConfig(config);
        }
        if (config.maxLapanyLvl == undefined) {
            config.maxLapanyLvl = 50;
            updateConfig(config);
        }
        if (config.niezlapaneMode == undefined) {
            config.niezlapaneMode = 1;
            updateConfig(config);
        }
    } else {
        config.skinStyle = 3;
        config.skipTutorial = false;
        config.useNiebieskieJagody = false;
        config.useNiebieskieNapoje = false;
        config.useCzerwoneNapoje = false;
        config.useZieloneNapoje = false;
        config.useEventoweNapoje = true;
        config.pokemonIconsIndex = 0;
        config.pokeballIconsIndex = 8;
        config.locationIconsIndex = 0;
        config.useOnlyInNight = false;
        config.niezlapaneMode = 1;
        config.useFontanna = false;
        config.lapSafariballemNiezlapane = true;
        config.hodowlaPokemonDniaImage = "";
        config.zadaniaWidget = "";
        config.hodowlaPokemonDniaStowarzyszenieImage = "";
        config.pok20 = 0;
        config.pok40 = 0;
        config.pok60 = 0;
        config.pok80 = 0;
        config.pok100 = 0;
        config.kolejnoscWidgetow = 1;
        config.maxLapanyLvl = 50;
        config.customStyleBackground = "#3c3c3c";
        config.customStyleTabs = "#C6E9D0";
        config.customStyleFont = "#000000";
        updateConfig(config);
    }

    $.getJSON("https://raw.githubusercontent.com/krozum/pokelife/master/PokemonData.json?a=1", {
        format: "json"
    }).done(function(data) {
        pokemonData = data;
        if ($('#pasek_skrotow a[href="gra/dzicz.php?poluj&miejsce=las"]').length > 0) {
            region = 'Kanto';
        } else if ($('#pasek_skrotow a[href="gra/dzicz.php?poluj&miejsce=puszcza"]').length > 0) {
            region = 'Johto';
        } else if ($('#pasek_skrotow a[href="gra/dzicz.php?poluj&miejsce=opuszczona_elektrownia"]').length > 0) {
            region = 'Hoenn';
        } else if ($('#pasek_skrotow a[href="gra/dzicz.php?poluj&miejsce=koronny_szczyt"]').length > 0) {
            region = 'Sinnoh';
        } else if ($('#pasek_skrotow a[href="gra/dzicz.php?poluj&miejsce=ranczo"]').length > 0) {
            region = 'Unova';
        } else if ($('#pasek_skrotow a[href="gra/dzicz.php?poluj&miejsce=francuski_labirynt"]').length > 0) {
            region = 'Kalos';
        }
        console.log("Wykryty region: " + region);

        var blob = new Blob([
            'var timers={};function fireTimeout(e){this.postMessage({id:e}),delete timers[e]}this.addEventListener("message",function(e){var t=e.data;switch(t.command){case"setTimeout":var i=parseInt(t.timeout||0,10),s=setTimeout(fireTimeout.bind(null,t.id),i);timers[t.id]=s;break;case"clearTimeout":(s=timers[t.id])&&clearTimeout(s),delete timers[t.id]}});'
        ])

        var timeoutId = 0;
        var timeouts = {};

        var worker = new Worker(window.URL.createObjectURL(blob));

        worker.addEventListener("message", function(evt) {
            var data = evt.data,
                id = data.id,
                fn = timeouts[id].fn,
                args = timeouts[id].args;

            fn.apply(null, args);
            delete timeouts[id];
        });

        window.setTimeout = function(fn, delay) {
            var args = Array.prototype.slice.call(arguments, 2);
            timeoutId += 1;
            delay = delay || 0;
            var id = timeoutId;
            timeouts[id] = { fn: fn, args: args };
            worker.postMessage({ command: "setTimeout", id: id, timeout: delay });
            return id;
        };

        window.clearTimeout = function(id) {
            worker.postMessage({ command: "clearTimeout", id: id });
            delete timeouts[id];
        };

        initPokeLifeScript();
    })
});

function extractFromScripts(scrtipt, instruction) {
    var scriptSplit = scrtipt.split(";");
    for (let i = 0; i < scriptSplit.length; i++) {
        const element = scriptSplit[i];
        var instr = element.split("&");
        for (let j = 0; j < instr.length; j++) {
            if (instr[j].includes(instruction)) {
                var instructionText = instr[j].substring(instruction.length);
                return instructionText.split(',');
            }
        }
    }
    return null

}

function actionTriger() {
    const scriptText = run.text.split(";")[1];
    var actionInstruction = scriptText.split("&");
    var returnCommand = action(actionInstruction[0].split(":")[0], scriptText)
    if (actionInstruction.length > 1) {
        throwCommand = action(actionInstruction[1].split(":")[0], scriptText)
    }
    if (returnCommand == "StopAutoGo" || returnCommand == "SkipPokemon") {
        run = null;
    }
    if (returnCommand != null && returnCommand.includes("&wybierz_pokemona=") && throwCommand == null) {
        run = null;
    }
    if (returnCommand != null) {
        actionCommand = returnCommand;
        return true;
    }
    return null;
}

function actionAtakuj(runScript) {
    var pokemonIndex = extractFromScripts(runScript, "Atakuj:");
    if (pokemonIndex >= 0 && pokemonIndex != null)
        return "&wybierz_pokemona=" + pokemonIndex;
    else
        return null;
}

function actionStop(runScript) {
    var pokemonIndex = extractFromScripts(runScript, "Stop:");
    if (pokemonIndex != null)
        return "StopAutoGo"
    else
        return null;
}

function actionSkip(runScript) {
    var pokemonIndex = extractFromScripts(runScript, "Omin:");
    if (pokemonIndex != null)
        return "SkipPokemon"
    else
        return null;
}

function actionThrow(runScript) {
    var ballName = extractFromScripts(runScript, "Rzuc:");
    if (ballName != null && ballName != "")
        return "&zlap_pokemona=" + ballName;
    else
        return null;
}

function pokemonTrigger(pokemon, lvl, dificul, types, catched, shinny) {
    console.log("PokemonTRIGER");
    console.log(pokemon);
    console.log(lvl);
    console.log(dificul);
    console.log(types);
    console.log(catched);
    console.log(shinny);
    for (let i = 0; i < activeScript.length; i++) {
        var canRunScript = false;
        const scriptText = activeScript[i].text.split(";")[0];
        var whereInstruction = scriptText.split("&");
        for (let j = 0; j < whereInstruction.length; j++) {
            const instruction = whereInstruction[j];
            var instrIndex = instruction.indexOf(":");
            var instrText = instruction.substring(0, instrIndex);
            canRunScript = where(instrText, scriptText, pokemon, lvl, dificul, types, catched, shinny);
            if (canRunScript == true)
                continue;
            else break;
        }
        if (canRunScript == true) {
            run = activeScript[i];
            break;
        }
    }
    if (run != undefined && run != null)
        return actionTriger(run);
    else return null;
}

function action(name, script) {
    switch (name) {
        case "Atakuj":
            return actionAtakuj(script);
        case "Omin":
            return actionSkip(script);
        case "Rzuc":
            return actionThrow(script);
        case "Stop":
            return actionStop(script);
    }
}

function where(name, script, pokemon, lvl, dificul, types, catched, shinny) {
    switch (name) {
        case "Pokemon":
            var pokemons = extractFromScripts(script, "Pokemon:")
            if (pokemons.includes(pokemon))
                return true;
            return false;
        case "Poziom":
            var lvls = extractFromScripts(script, "Poziom:")
            for (let i = 0; i < lvls.length; i++) {
                const element = lvls[i];
                if (element.includes("-")) {
                    var ranges = element.split("-");
                    var parseFirst = Number.parseInt(ranges[0]);
                    var parseSec = Number.parseInt(ranges[1]);
                    var max = parseFirst;
                    var min = 0;
                    if (parseFirst < parseSec) {
                        min = parseFirst;
                        max = parseSec;
                    }
                    if (lvl >= min && lvl <= max)
                        return true;
                } else {
                    var parse = Number.parseInt(element);
                    if (lvl == parse)
                        return true;
                }
            }
            return false;
        case "Trudnosc":
            var dificuls = extractFromScripts(script, "Trudnosc:")
            for (let i = 0; i < dificuls.length; i++) {
                const element = dificuls[i];
                if (element.includes("-")) {
                    var ranges = element.split("-");
                    var parseFirst = Number.parseInt(ranges[0]);
                    var parseSec = Number.parseInt(ranges[1]);
                    var max = parseFirst;
                    var min = 0;
                    if (parseFirst < parseSec) {
                        min = parseFirst;
                        max = parseSec;
                    }
                    if (dificul >= min && dificul <= max)
                        return true;
                } else {
                    var parse = Number.parseInt(element);
                    if (dificul == parse)
                        return true;
                }
            }
            return false;
        case "Typ":
            var type = extractFromScripts(script, "Typ:")
            for (let i = 0; i < types.length; i++) {
                const element = types[i];
                if (type.includes(element)) {
                    return true;
                }
            }
            return false;
        case "Zlapany":
            var catche = extractFromScripts(script, "Zlapany:")
            if (catche[0] == "TAK" && catched == true)
                return true;
            if (catched[0] == "NIE" && catched == false)
                return true;
            return false;
        case "Shiny":
            var shin = extractFromScripts(script, "Shiny:")
            if (shin[0] == "TAK" && shinny == true)
                return true;
            if (shin[0] == "NIE" && shinny == false)
                return true;
            return false;
    }
}
