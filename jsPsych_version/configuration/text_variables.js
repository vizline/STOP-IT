// instructions page 1
var page1 = [
  '<p>Twoim głównym zadaniem jest reagowanie na białe strzałki (z czarnym konturem), które będą się pojawiać na ekranie.</p> '+
  '<p>Naciśnij LEWĄ strzałkę na klawiaturze kiedy zobaczysz LEWĄ strzałkę na ekranie, lub naciśnij PRAWĄ strzałkę na klawiaturze jeśli PRAWA strzałka pojawi się na ekranie.</p>'+
  '<p>Więc: lewa strzałka = lewy przycisk, prawa strzałka = prawy przycisk.</p>'+ '<br>' +
  '<p>Czasami prezentowane na ekranie strzałki będą z niewielkim opóźnieniem wypełniać się kolorem czerwonym. Wtedy powstrzymaj się od naciskania jakiegokolwiek przycisku!</p>'+
  '<p>W ok. połowie przypadków czerwone wypełnienie pojawi się prawie natychmiast, co sprawi że powstrzymanie się od reakcji będzie bardzo łatwe.</p>'+
  '<p>Natomiast w innych przypadkach czerwień pojawi się stosunkowo późno - więc powstrzymanie się od reakcji będzie trudne.</p>'
];

// instructions page 2
// Do not forget to adjust the number of blocks
page2 = [
  '<p> Prosimy, abyś udzielał swojej odpowiedzi tak szybko jak to jest możliwe - zadanie to ma na celu zmierzenie czasu reakcji na prezentowane bodźce. </p>'+
  '<p> Powinieneś podejmować szybkie decyzje - aby Twoje czasy reakcji były jak najkrótsze, jednocześnie przy jak najmniejszej ilości błędów (naciskaniu klawiszy gdy strzałka będzie czerwona).</p>'+
  '<p> Zadanie rozpocznie się jednym treningowym blokiem bodźców, gdy będziesz otrzymywać informacje zwrotne na temat poprawności swoich działań. Później, takich informacji zwrotnych już nie będzie.</p>'+
  '<p> Niemniej jednak, po każdym z "właściwych" bloków będzie 15 sekund przerwy - gdy otrzymasz informacje nt. swoich osiągnięć w poprzedniej serii bodżców.</p>' +
  '<p> To badanie składa się z jednego bloku treningowego - oraz 3 właściwych bloków z bodżcami. Wykonanie całości zadania powinno zająć Ci ok. 6 minut. </p>'
];

// informed consent text
var informed_consent_text = [
  '<p> Jestem gotowy/a, aby rozpocząć zadanie.</p>'
];

// trial by trial feedback messages
correct_msg = '<p> Poprawna reakcja </p>'
incorrect_msg = '<p> Niepoprawna reakcja </p>'
too_slow_msg = '<p> Zbyt wolno </p>'
too_fast_msg = '<p> Zbyt szybko </p>'
correct_stop_msg = '<p> Poprawne powstrzymanie się od reakcji </p>'
incorrect_stop_msg = '<p> Nic nie naciskaj przy czerwonej strzałce! </p>'

// block feedback
no_signal_header = "<p><b>Próby z białą strzałką: </b></p>"
avg_rt_msg = "<p>Średni czas reakcji = %d milisekund</p>"
prop_miss_msg = "<p>Proportion missed go = %.2f (should be 0)</p>"
stop_signal_header = "<p><b>Próby z czerwoną strzałką: </b></p>"
prop_corr_msg = "<p>Proporcja poprawnych powstrzymań reakcji = %.2f (powinno tu być co najmniej 0.5)</p>" + "<br>"
next_block_msg = "<p>Możesz wziąć szybki oddech, następny blok rozpocznie się za <span id='timer'>15</span></p>"
final_block_msg = "<p>Naciśnij spację aby kontynuować...</p>" // after the final block they don't need a break

// other
var label_previous_button = 'Poprzedni';
var label_next_button = 'Dalej';
var label_consent_button = 'Zgadzam się';
var full_screen_message = '<p>Procedura zostanie uruchomiona w trybie całego ekranu - kiedy naciśniesz poniższy przycisk: </p>';
var welcome_message = ['<p>Witaj w procedurze badawczej.</p>' + '<p>Naciśnij "Dalej" aby rozpocząć.</p>'];
var not_supported_message = ['<p>Ten ekperyment wymaga korzystania z przeglądarki Chrome albo Firefox.</p>'];
var subjID_instructions = "Wprowadź swój numer użytkownika SONA ID."
var age_instructions = "Wprowadź swój wiek."
var gender_instructions = "Wskaż swoją płeć."
var gender_options = ['kobieta','mężczyzna']
var text_at_start_block = '<p>Naciśnij spację aby kontynuować.</p>'
var get_ready_message = '<p>Przygotuj się...</p>'
var fixation_text = '<div style="font-size:60px;">TEST</div>'
var end_message = "<p>Dziękuję za Twój udział w tej procedurze.</p>" +
  "<p>Naciśnij spację aby zakończyć badanie.</p>"
