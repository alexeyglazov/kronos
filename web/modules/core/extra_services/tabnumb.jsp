<%--
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.web.vo.LeavesBalanceCalculatorResult"%>
<%@page import="com.mazars.management.db.util.EmployeePositionHistoryItemUtils"%>
<%@page import="com.mazars.management.service.LeavesBalanceCalculator"%>
<%@page import="com.mazars.management.reports.InvoiceRequestReport"%>
<%@page import="com.mazars.management.db.util.CalendarUtil"%>
<%@page import="com.mazars.management.reports.jobs.ProfitabilityReportJob"%>
<%@page import="com.mazars.management.jobs.JobManager"%>
<%@page import="com.mazars.management.jobs.Job"%>
<%@page import="com.mazars.management.service.ObjectUtils"%>
<%@page import="java.io.ObjectOutputStream"%>
<%@page import="java.io.ObjectOutput"%>
<%@page import="java.io.ByteArrayOutputStream"%>
<%@page import="javax.crypto.SecretKey"%>
<%@page import="com.mazars.management.security.SecurityUtils"%>
<%@page import="java.net.URI"%>
<%@page import="com.mazars.management.reports.ProfitabilityReport"%>
<%@page import="java.io.PrintWriter"%>
<%@page import="java.io.PrintStream"%>
<%@page import="jxl.write.WritableSheet"%>
<%@page import="jxl.write.Label"%>
<%@page import="jxl.Sheet"%>
<%@page import="jxl.write.WritableWorkbook"%>
<%@page import="java.io.File"%>
<%@page import="jxl.Workbook"%>
<%@page import="com.mazars.management.service.ConfigUtils"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.math.BigDecimal"%>
<%@page import="org.hibernate.Query"%>
<%@page contentType="text/html" pageEncoding="UTF-8"

    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.web.security.AccessChecker"
    import="com.mazars.management.db.comparators.*"
%><%
request.setCharacterEncoding("UTF-8");
Gson gson = new Gson();
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
try {
    hs.beginTransaction();
    
Map<String, String> a = new HashMap<String, String>();

a.put("123", "Агаркова Алина Владимировна");
a.put("947", "Агафонкин Олег Владимирович");
a.put("961", "Алексеева Любовь Александровна");
a.put("876", "Алексеева Наталия Олеговна");
a.put("980", "Амфу Максимильен Робер Мишель");
a.put("919", "Андреева Вероника Вячеславовна");
a.put("811", "Ахмедов Расул Максимович");
a.put("999", "Ахметова Марияш Хамидулловна");
a.put("948", "Бадамшина Лэйсан Альбертовна");
a.put("246", "Батинова Виктория Семеновна");
a.put("157", "Беляева Наталья Викторовна");
a.put("354", "Борисова Любовь Евгеньевна");
a.put("996", "Боубекова Айкерим Боубековна");
a.put("942", "Бояджиева Росица Василовна");
a.put("221", "Бояринова Анна Александровна");
a.put("973", "Будаев Азамат Олегович");
a.put("858", "Варначева Анастасия Михайловна");
a.put("952", "Великанов Дмитрий Валерьевич");
a.put("760", "Веревкина Оксана Николаевна");
a.put("434", "Веселкова Кристина Станиславовна");
a.put("61", "Виксне Полина Андреевна");
a.put("974", "Волков Александр Юрьевич");
a.put("364", "Волошина Елена Михайловна");
a.put("908", "Воробьев Дмитрий Владимирович");
a.put("378", "Габдуллина Динара Ринатовна");
a.put("866", "Габе Гийом");
a.put("806", "Гаврилов Денис Александрович");
a.put("964", "Гаджиева Наида Магомедсагидовна");
a.put("957", "Галактионова Анна Михайловна");
a.put("979", "Генджиев Виталий Александрович");
a.put("280", "Гладкова Анна Алексеевна");
a.put("328", "Глазов Алексей Эдуардович");
a.put("452", "Говядовская Екатерина Игоревна");
a.put("256", "Голова Светлана Геннадьевна");
a.put("847", "Голубева Юлия Федоровна");
a.put("453", "Горбольский Игорь Анатольевич");
a.put("853", "Горкун Максим Сергеевич");
a.put("441", "Грашкина Ольга Олеговна");
a.put("290", "Грибанова Любовь Александровна");
a.put("988", "Губанова Ксения Олеговна");
a.put("932", "Губанова Наталья Леонидовна");
a.put("292", "Давыдова Виктория Александровна");
a.put("992", "Джакиева Бактыгул Раимбековна");
a.put("1009", "Диаб Светлана Владимировна");
a.put("819", "Добрынина Анастасия Игоревна");
a.put("870", "Домрачев Анатолий Андреевич");
a.put("907", "Дорохин Дмитрий Валерьевич");
a.put("366", "Дробленкова Наталья Николаевна");
a.put("881", "Дубовая Антонина Александровна");
a.put("160", "Дьяконова Людмила Николаевна");
a.put("361", "Дэйвис Стивен Эндрю");
a.put("981", "Елович Юрий Александрович");
a.put("940", "Ермекбаева Раушан Дамешовна");
a.put("975", "Жемердеева Юлия Сергеевна");
a.put("341", "Живых Виктория Александровна");
a.put("487", "Жилина Марина Михайловна");
a.put("859", "Жирнова Анастасия Андреевна");
a.put("963", "Журко Владислава Олеговна");
a.put("944", "Жусева Наталья Анатольевна");
a.put("105", "Захарова Ольга Анатольевна");
a.put("829", "Зеленов Юрий Евгеньевич");
a.put("417", "Зубарева Анна Владимировна");
a.put("863", "Зыкина Полина Юрьевна");
a.put("342", "Идиатулина Адель Ириковна");
a.put("429", "Изотова Татьяна Викторовна");
a.put("982", "Изюмов Артём Сергеевич");
a.put("962", "Ионас Михаил Сергеевич");
a.put("212", "Иордатий Татьяна Владимировна");
a.put("993", "Исакова Айнура Суеркуловна");
a.put("287", "Кадырова Мария Анварбековна");
a.put("1007", "Кайшев Максим Анатольевич");
a.put("840", "Калинцева Анастасия Алексеевна");
a.put("633", "Кандауров Андрей Игоревич");
a.put("1011", "Каненков Евгений Алексеевич");
a.put("460", "Капранова Екатерина Михайловна");
a.put("1012", "Карасова Зухра Пашагереевна");
a.put("118", "Карева Анна Александровна");
a.put("886", "Карпинчик Артем Андреевич");
a.put("991", "Касымакунова Сымбат Саматбековна");
a.put("943", "Каторгина Елена Юрьевна");
a.put("185", "Кашаева Наталья Ивановна");
a.put("825", "Кириллова Анна Вячеславовна");
a.put("857", "Кириченко Валерий Сергеевич");
a.put("315", "Коврова Людмила Геннадьевна");
a.put("156", "Козлова Анна Алексеевна");
a.put("367", "Комарова Тамара Геннадьевна");
a.put("373", "Конищева Наталья Владимировна");
a.put("839", "Конобеева Наталья Анатольевна");
a.put("309", "Кононова Наталья Сергеевна");
a.put("898", "Копейкина Дарья Александровна");
a.put("989", "Корб Нурияна Бектуровна");
a.put("1008", "Королева Татьяна Владимировна");
a.put("924", "Коротина Наталья Михайловна");
a.put("197", "Коротких Евгений Алексеевич");
a.put("925", "Коротков Андрей Петрович");
a.put("935", "Костин Алексей Николаевич");
a.put("970", "Котломина Наталия Александровна");
a.put("432", "Кошелева Евгения Сергеевна");
a.put("934", "Кравцова Карина Александровна");
a.put("946", "Кувалдина Ксения Сергеевна");
a.put("937", "Кузнецова Ксения Александровна");
a.put("922", "Кузьменко Ольга Михайловна");
a.put("918", "Кузьмина Юлия Олеговна");
a.put("632", "Курбанова Оксана Казибековна");
a.put("891", "Лазарева Людмила Евгеньевна");
a.put("927", "Лазебник Наталья Валерьевна");
a.put("903", "Ле Бурдон Виржини Полин Сесиль");
a.put("897", "Леднева Валентина Геннадьевна");
a.put("169", "Лемперьер Мария Сергеевна");
a.put("905", "Лытов Сергей Игоревич");
a.put("956", "Лытова Ксения Игоревна");
a.put("921", "Магомедова Айшат Гаджимусаевна");
a.put("65", "Маковеева Дарья Дмитриевна");
a.put("917", "Малышев Александр Игорьевич");
a.put("372", "Мальцева Екатерина Геннадьевна");
a.put("959", "Мамедов Рафаэль Техранович");
a.put("969", "Манджиева Эркена Омсаевна");
a.put("976", "Мартынова Екатерина Игоревна");
a.put("1002", "Матекина Надежда Михайловна");
a.put("877", "Матыскина Екатерина Андреевна");
a.put("143", "Меньшикова Екатерина Олеговна");
a.put("831", "Мигоцкая Ольга Сергеевна");
a.put("960", "Миньковецкая Светлана Валентиновна");
a.put("522", "Мирошникова Екатерина Сергеевна");
a.put("56", "Мирошниченко Ирина Владимировна");
a.put("241", "Миткевич Юлия Игоревна");
a.put("297", "Митяшина Елена Алексеевна");
a.put("951", "Михалева Юлия Александровна");
a.put("269", "Могилевская Ольга Александровна");
a.put("953", "Московкина Светлана Игоревна");
a.put("851", "Мурашова Мария Владимировна");
a.put("920", "Мустафаева Фарида Курбанмагомедовна");
a.put("1001", "Мысникова Марина Сергеевна");
a.put("553", "Нефедова Ольга Владимировна");
a.put("865", "Никифорова Марина Владимировна");
a.put("913", "Николаева Анастасия Александровна");
a.put("995", "Нияспекова Чынара Нияспековна");
a.put("941", "Омашева Диана Талгатовна");
a.put("424", "Осинкина Евгения Петровна");
a.put("892", "Охлопков Владимир Васильевич");
a.put("447", "Павельева Валентина Сергеевна");
a.put("930", "Павельева Надежда Сергеевна");
a.put("868", "Пантелеева Анна Сергеевна");
a.put("1014", "Парфенова Елена Эдуардовна");
a.put("458", "Петухова Екатерина Вадимовна");
a.put("87", "Пино Флоренс");
a.put("910", "Подобед Марина Анатольевна");
a.put("967", "Прибыльнова Алена Олеговна");
a.put("464", "Прохоровская Екатерина Алексеевна");
a.put("862", "Пузин Алексей Михайлович");
a.put("958", "Пургина Анастасия Витальевна");
a.put("888", "Пучков Вадим Николаевич");
a.put("997", "Рамис Кызы Бермет");
a.put("812", "Рахимова Рузанна Галиевна");
a.put("904", "Рогова Екатерина Александровна");
a.put("1010", "Романова Елизавета Александровна");
a.put("949", "Саркаров Нариман Таджидинович");
a.put("938", "Седова Виктория Александровна");
a.put("757", "Селезнева Екатерина Владимировна");
a.put("40", "Семенихин Андрей Владимирович");
a.put("379", "Семенова Наталия Николаевна");
a.put("314", "Сергеева Екатерина Игоревна");
a.put("820", "Сердюк Владимир Игоревич");
a.put("998", "Середкин Максим Юрьевич");
a.put("909", "Сибгатуллина Эльвира Насимовна");
a.put("204", "Сидельникова Любовь Владиславовна");
a.put("356", "Симонов Александр Владимирович");
a.put("47", "Славинская Оксана Александровна");
a.put("972", "Слизков Антон Евгеньевич");
a.put("325", "Смирнов Антон Александрович");
a.put("977", "Смирнова Светлана Владимировна");
a.put("869", "Сонголова Марина Эдуардовна");
a.put("225", "Сорокина Мария Владимировна");
a.put("462", "Спицына Марина Игоревна");
a.put("906", "Степанова Виктория Сергеевна");
a.put("459", "Степанова Ольга Алексеевна");
a.put("985", "Степура Анна Александровна");
a.put("1003", "Сыроваткин Семён Анатольевич");
a.put("333", "Талызенкова Елена Владимировна");
a.put("966", "Тарараксин Игорь Михайлович");
a.put("867", "Таратина Анастасия Александровна");
a.put("1004", "Тарковский Залим Заирбекович");
a.put("257", "Татарцева Ирина Александровна");
a.put("360", "Терехина Анастасия Алексеевна");
a.put("939", "Тимашов Егор Александрович");
a.put("885", "Тимофеева Наталия Павловна");
a.put("1013", "Ткачева Александра Валериевна");
a.put("901", "Тогобицкий Сергей Вадимович");
a.put("864", "Топоева Юлия Андреевна");
a.put("990", "Торобекова Бурул Кермалыевна");
a.put("968", "Трошкин Семен Александрович");
a.put("472", "Тудвасова Мария Евгеньевна");
a.put("486", "Файфура Василий Михайлович");
a.put("1005", "Федулов Филипп Александрович");
a.put("833", "Филоненко Анна Владимировна");
a.put("445", "Фреон Сильвэйн Пьер Франсуа");
a.put("430", "Хаскина Елена Петровна");
a.put("955", "Хлыстов Артем Анатольевич");
a.put("477", "Худоярова Светлана Павловна");
a.put("70", "Цой Наталья Вячеславовна");
a.put("931", "Чепусова Татьяна Сергеевна");
a.put("822", "Чернова Марта Андреевна");
a.put("521", "Чернова Татьяна Борисовна");
a.put("983", "Чмеленко Александра Игоревна");
a.put("994", "Чожобаева Мээрим Ишенбековна");
a.put("490", "Чудаева Виктория Викторовна");
a.put("914", "Чучалина Светлана Васильевна");
a.put("60", "Шалдина Елена Юрьевна");
a.put("376", "Шамбон Люк Тьерри");
a.put("179", "Шарловская Анна Александровна");
a.put("331", "Шацких Екатерина Сергеевна");
a.put("383", "Шевченко Анатолий Павлович");
a.put("826", "Шевченко Наталья Петровна");
a.put("884", "Шепелев Александр Николаевич");
a.put("882", "Шерстобитова Ирина Михайловна");
a.put("355", "Широкова Евгения Викторовна");
a.put("455", "Широкова Мария Владимировна");
a.put("399", "Шичкин Евгений Семенович");
a.put("479", "Шматова Екатерина Олеговна");
a.put("978", "Шумахова Лилия Олеговна");
a.put("878", "Щекин Андрей Владимирович");
a.put("821", "Якушева Арина Юрьевна");
a.put("240", "Янголь Елена Владимировна");
a.put("484", "Ярцева Ксения Андреевна");




%><table border="1"><%
List<Employee> employees = Employee.getAll();
for(String num : a.keySet()) {
    String num2 = num;
    if(num2.length() == 1) {
        num2 = "000000000" + num2;
    } else if(num2.length() == 2) {
        num2 = "00000000" + num2;
    } else if(num2.length() == 3) {
        num2 = "0000000" + num2;
    } else if(num2.length() == 4) {
        num2 = "000000" + num2;
    }

    String name = a.get(num);
    
    Employee employee = null;
    for(Employee e : employees) {
        if(name.equalsIgnoreCase(e.getFullNameLocalLanguage(true))) {
            employee = e;
            
            break;
        }
    }
    if(employee != null) {
        employee.setExternalId(num2);
        hs.save(employee);
    }
    %><tr><td><%=num %></td><td><%=num2 %></td><td><%=name %></td><td><%=(employee != null ? employee.getFullNameLocalLanguage() : "-") %></td></tr><%
}
%></table><%
    hs.getTransaction().commit();
} catch (Exception ex) {
    hs.getTransaction().rollback();
    %>
    {
        "status": "FAIL",
        "comment": <% ex.printStackTrace(new PrintWriter(out)); %>
    }
    <%
}
%>