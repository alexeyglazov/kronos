<%-- 
    Document   : helper
    Created on : 30.03.2011, 14:05:19
    Author     : glazov
--%>

<%@page import="java.util.Locale"%>
<%@page import="com.mazars.management.service.ConfigUtils"%>
<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    import="java.util.List"
    import="java.util.LinkedList"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="java.util.Map"
    import="java.util.HashMap"
%>
<%
request.setCharacterEncoding("UTF-8");

Boolean isAdminLoggedIn = (Boolean)session.getAttribute("isAdminLoggedIn");
if(! Boolean.TRUE.equals(isAdminLoggedIn)) {
    response.sendRedirect("./login.jsp");
    return;
}

Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
try {
    hs.beginTransaction();
    
Locale locale = new Locale("en");
String moduleBaseUrl = "/modules/core/";
Map<String, String> bodies = new HashMap<String, String>();

Map<String, String> pageProperties = new HashMap<String, String>();
pageProperties.put("title", "Basic entities");
pageProperties.put("description", "Page is used to create basic entities in database");
pageProperties.put("keywords", "Standard positions, Currencies, Languages, Counties");

List<String> jsFiles = new LinkedList<String>();
//jsFiles.add("main.js");

request.setAttribute("isAdminLoggedIn", isAdminLoggedIn);
request.setAttribute("bodies", bodies);
request.setAttribute("pageProperties", pageProperties);
request.setAttribute("locale", locale);

request.setAttribute("jsFiles", jsFiles);
request.setAttribute("content", moduleBaseUrl + "elements/admin/basic_entities.jsp");
String frametemplate = moduleBaseUrl + "frametemplates/admin.jsp";
%>
<%
    String command = request.getParameter("command");
    if(command == null) {
        command = "start";
    }
    String displayStatus = null;
    String displayMessage = null;
    if("start".equals(command)) {
        displayStatus = "showForm";
    } else if("createStandardPositions".equals(command)) {
        if(StandardPosition.getTotalCount() > 0) {
            displayStatus = "errorOnStandardPositions";
            displayMessage = "There is one or more Standard Positions in database. You can not add new ones here.";
        } else {
            Map<String, Integer> standardPositions = new HashMap<String, Integer>();
            standardPositions.put("Junior", 2);
            standardPositions.put("Senior", 3);
            standardPositions.put("Manager", 4);
            standardPositions.put("Senior Manager", 5);
            standardPositions.put("Partner", 6);
            standardPositions.put("Administrative", 1);
            for(String standardPositionName : standardPositions.keySet()) {
                StandardPosition standardPosition = new StandardPosition();
                standardPosition.setName(standardPositionName);
                standardPosition.setSortValue(standardPositions.get(standardPositionName ));
                hs.save(standardPosition);
            }
            displayStatus = "successOnStandardPositions";
            displayMessage = "Standard positions have been added. Count: " + standardPositions.size();
        }
    } else if("createModules".equals(command)) {
        if(Module.getTotalCount() > 0) {
            displayStatus = "errorOnModules";
            displayMessage = "There is one or more Modules in database. You can not add new ones here.";
        } else {
            List<Module> modules = new LinkedList<Module>();
            modules.add(new Module("Timesheets", "", false));
            modules.add(new Module("Clients", "", false));
            modules.add(new Module("Code", "", false));
            modules.add(new Module("Financial Information", "", false));
            modules.add(new Module("Rights", "", false));
            modules.add(new Module("HR", "", false));
            modules.add(new Module("Salary", "", false));
            modules.add(new Module("Planning Read", "", false));
            modules.add(new Module("Planning Write", "", false));

            modules.add(new Module("Timesheets Report", "", true));
            modules.add(new Module("Clients Report", "", true));
            modules.add(new Module("Code Report", "", true));
            modules.add(new Module("Financial Information Report", "", true));
            modules.add(new Module("Rights Report", "", true));
            modules.add(new Module("HR Report", "", true));
            modules.add(new Module("Salary Report", "", true));
            for(Module module : modules) {
                hs.save(module);
            }        
            displayStatus = "successOnModules";
            displayMessage = "Standard positions have been added. Count: " + modules.size();
        }    
    } else if("createISOCountries".equals(command)) {
        if(ISOCountry.getTotalCount() > 0) {
            displayStatus = "errorOnISOCountries";
            displayMessage = "There is one or more ISOCountries in database. You can not add new ones here.";
        } else {        
            List<ISOCountry> isoCountries = new LinkedList<ISOCountry>();
            isoCountries.add(new ISOCountry("Afghanistan", "AF", "AFG", "004"));
            isoCountries.add(new ISOCountry("Åland Islands", "AX", "ALA", "248"));
            isoCountries.add(new ISOCountry("Albania", "AL", "ALB", "008"));
            isoCountries.add(new ISOCountry("Algeria", "DZ", "DZA", "012"));
            isoCountries.add(new ISOCountry("American Samoa", "AS", "ASM", "016"));
            isoCountries.add(new ISOCountry("Andorra", "AD", "AND", "020"));
            isoCountries.add(new ISOCountry("Angola", "AO", "AGO", "024"));
            isoCountries.add(new ISOCountry("Anguilla", "AI", "AIA", "660"));
            isoCountries.add(new ISOCountry("Antarctica", "AQ", "ATA", "010"));
            isoCountries.add(new ISOCountry("Antigua and Barbuda", "AG", "ATG", "028"));
            isoCountries.add(new ISOCountry("Argentina", "AR", "ARG", "032"));
            isoCountries.add(new ISOCountry("Armenia", "AM", "ARM", "051"));
            isoCountries.add(new ISOCountry("Aruba", "AW", "ABW", "533"));
            isoCountries.add(new ISOCountry("Australia", "AU", "AUS", "036"));
            isoCountries.add(new ISOCountry("Austria", "AT", "AUT", "040"));
            isoCountries.add(new ISOCountry("Azerbaijan", "AZ", "AZE", "031"));
            isoCountries.add(new ISOCountry("Bahamas", "BS", "BHS", "044"));
            isoCountries.add(new ISOCountry("Bahrain", "BH", "BHR", "048"));
            isoCountries.add(new ISOCountry("Bangladesh", "BD", "BGD", "050"));
            isoCountries.add(new ISOCountry("Barbados", "BB", "BRB", "052"));
            isoCountries.add(new ISOCountry("Belarus", "BY", "BLR", "112"));
            isoCountries.add(new ISOCountry("Belgium", "BE", "BEL", "056"));
            isoCountries.add(new ISOCountry("Belize", "BZ", "BLZ", "084"));
            isoCountries.add(new ISOCountry("Benin", "BJ", "BEN", "204"));
            isoCountries.add(new ISOCountry("Bermuda", "BM", "BMU", "060"));
            isoCountries.add(new ISOCountry("Bhutan", "BT", "BTN", "064"));
            isoCountries.add(new ISOCountry("Bolivia, Plurinational State of", "BO", "BOL", "068"));
            isoCountries.add(new ISOCountry("Bonaire, Sint Eustatius and Saba", "BQ", "BES", "535"));
            isoCountries.add(new ISOCountry("Bosnia and Herzegovina", "BA", "BIH", "070"));
            isoCountries.add(new ISOCountry("Botswana", "BW", "BWA", "072"));
            isoCountries.add(new ISOCountry("Bouvet Island", "BV", "BVT", "074"));
            isoCountries.add(new ISOCountry("Brazil", "BR", "BRA", "076"));
            isoCountries.add(new ISOCountry("British Indian Ocean Territory", "IO", "IOT", "086"));
            isoCountries.add(new ISOCountry("Brunei Darussalam", "BN", "BRN", "096"));
            isoCountries.add(new ISOCountry("Bulgaria", "BG", "BGR", "100"));
            isoCountries.add(new ISOCountry("Burkina Faso", "BF", "BFA", "854"));
            isoCountries.add(new ISOCountry("Burundi", "BI", "BDI", "108"));
            isoCountries.add(new ISOCountry("Cambodia", "KH", "KHM", "116"));
            isoCountries.add(new ISOCountry("Cameroon", "CM", "CMR", "120"));
            isoCountries.add(new ISOCountry("Canada", "CA", "CAN", "124"));
            isoCountries.add(new ISOCountry("Cape Verde", "CV", "CPV", "132"));
            isoCountries.add(new ISOCountry("Cayman Islands", "KY", "CYM", "136"));
            isoCountries.add(new ISOCountry("Central African Republic", "CF", "CAF", "140"));
            isoCountries.add(new ISOCountry("Chad", "TD", "TCD", "148"));
            isoCountries.add(new ISOCountry("Chile", "CL", "CHL", "152"));
            isoCountries.add(new ISOCountry("China", "CN", "CHN", "156"));
            isoCountries.add(new ISOCountry("Christmas Island", "CX", "CXR", "162"));
            isoCountries.add(new ISOCountry("Cocos (Keeling) Islands", "CC", "CCK", "166"));
            isoCountries.add(new ISOCountry("Colombia", "CO", "COL", "170"));
            isoCountries.add(new ISOCountry("Comoros", "KM", "COM", "174"));
            isoCountries.add(new ISOCountry("Congo", "CG", "COG", "178"));
            isoCountries.add(new ISOCountry("Congo, the Democratic Republic of the", "CD", "COD", "180"));
            isoCountries.add(new ISOCountry("Cook Islands", "CK", "COK", "184"));
            isoCountries.add(new ISOCountry("Costa Rica", "CR", "CRI", "188"));
            isoCountries.add(new ISOCountry("Côte d'Ivoire", "CI", "CIV", "384"));
            isoCountries.add(new ISOCountry("Croatia", "HR", "HRV", "191"));
            isoCountries.add(new ISOCountry("Cuba", "CU", "CUB", "192"));
            isoCountries.add(new ISOCountry("CuraÃ§ao", "CW", "CUW", "531"));
            isoCountries.add(new ISOCountry("Cyprus", "CY", "CYP", "196"));
            isoCountries.add(new ISOCountry("Czech Republic", "CZ", "CZE", "203"));
            isoCountries.add(new ISOCountry("Denmark", "DK", "DNK", "208"));
            isoCountries.add(new ISOCountry("Djibouti", "DJ", "DJI", "262"));
            isoCountries.add(new ISOCountry("Dominica", "DM", "DMA", "212"));
            isoCountries.add(new ISOCountry("Dominican Republic", "DO", "DOM", "214"));
            isoCountries.add(new ISOCountry("Ecuador", "EC", "ECU", "218"));
            isoCountries.add(new ISOCountry("Egypt", "EG", "EGY", "818"));
            isoCountries.add(new ISOCountry("El Salvador", "SV", "SLV", "222"));
            isoCountries.add(new ISOCountry("Equatorial Guinea", "GQ", "GNQ", "226"));
            isoCountries.add(new ISOCountry("Eritrea", "ER", "ERI", "232"));
            isoCountries.add(new ISOCountry("Estonia", "EE", "EST", "233"));
            isoCountries.add(new ISOCountry("Ethiopia", "ET", "ETH", "231"));
            isoCountries.add(new ISOCountry("Falkland Islands (Malvinas)", "FK", "FLK", "238"));
            isoCountries.add(new ISOCountry("Faroe Islands", "FO", "FRO", "234"));
            isoCountries.add(new ISOCountry("Fiji", "FJ", "FJI", "242"));
            isoCountries.add(new ISOCountry("Finland", "FI", "FIN", "246"));
            isoCountries.add(new ISOCountry("France", "FR", "FRA", "250"));
            isoCountries.add(new ISOCountry("French Guiana", "GF", "GUF", "254"));
            isoCountries.add(new ISOCountry("French Polynesia", "PF", "PYF", "258"));
            isoCountries.add(new ISOCountry("French Southern Territories", "TF", "ATF", "260"));
            isoCountries.add(new ISOCountry("Gabon", "GA", "GAB", "266"));
            isoCountries.add(new ISOCountry("Gambia", "GM", "GMB", "270"));
            isoCountries.add(new ISOCountry("Georgia", "GE", "GEO", "268"));
            isoCountries.add(new ISOCountry("Germany", "DE", "DEU", "276"));
            isoCountries.add(new ISOCountry("Ghana", "GH", "GHA", "288"));
            isoCountries.add(new ISOCountry("Gibraltar", "GI", "GIB", "292"));
            isoCountries.add(new ISOCountry("Greece", "GR", "GRC", "300"));
            isoCountries.add(new ISOCountry("Greenland", "GL", "GRL", "304"));
            isoCountries.add(new ISOCountry("Grenada", "GD", "GRD", "308"));
            isoCountries.add(new ISOCountry("Guadeloupe", "GP", "GLP", "312"));
            isoCountries.add(new ISOCountry("Guam", "GU", "GUM", "316"));
            isoCountries.add(new ISOCountry("Guatemala", "GT", "GTM", "320"));
            isoCountries.add(new ISOCountry("Guernsey", "GG", "GGY", "831"));
            isoCountries.add(new ISOCountry("Guinea", "GN", "GIN", "324"));
            isoCountries.add(new ISOCountry("Guinea-Bissau", "GW", "GNB", "624"));
            isoCountries.add(new ISOCountry("Guyana", "GY", "GUY", "328"));
            isoCountries.add(new ISOCountry("Haiti", "HT", "HTI", "332"));
            isoCountries.add(new ISOCountry("Heard Island and McDonald Islands", "HM", "HMD", "334"));
            isoCountries.add(new ISOCountry("Holy See (Vatican City State)", "VA", "VAT", "336"));
            isoCountries.add(new ISOCountry("Honduras", "HN", "HND", "340"));
            isoCountries.add(new ISOCountry("Hong Kong", "HK", "HKG", "344"));
            isoCountries.add(new ISOCountry("Hungary", "HU", "HUN", "348"));
            isoCountries.add(new ISOCountry("Iceland", "IS", "ISL", "352"));
            isoCountries.add(new ISOCountry("India", "IN", "IND", "356"));
            isoCountries.add(new ISOCountry("Indonesia", "ID", "IDN", "360"));
            isoCountries.add(new ISOCountry("Iran, Islamic Republic of", "IR", "IRN", "364"));
            isoCountries.add(new ISOCountry("Iraq", "IQ", "IRQ", "368"));
            isoCountries.add(new ISOCountry("Ireland", "IE", "IRL", "372"));
            isoCountries.add(new ISOCountry("Isle of Man", "IM", "IMN", "833"));
            isoCountries.add(new ISOCountry("Israel", "IL", "ISR", "376"));
            isoCountries.add(new ISOCountry("Italy", "IT", "ITA", "380"));
            isoCountries.add(new ISOCountry("Jamaica", "JM", "JAM", "388"));
            isoCountries.add(new ISOCountry("Japan", "JP", "JPN", "392"));
            isoCountries.add(new ISOCountry("Jersey", "JE", "JEY", "832"));
            isoCountries.add(new ISOCountry("Jordan", "JO", "JOR", "400"));
            isoCountries.add(new ISOCountry("Kazakhstan", "KZ", "KAZ", "398"));
            isoCountries.add(new ISOCountry("Kenya", "KE", "KEN", "404"));
            isoCountries.add(new ISOCountry("Kiribati", "KI", "KIR", "296"));
            isoCountries.add(new ISOCountry("Korea, Democratic People's Republic of", "KP", "PRK", "408"));
            isoCountries.add(new ISOCountry("Korea, Republic of", "KR", "KOR", "410"));
            isoCountries.add(new ISOCountry("Kuwait", "KW", "KWT", "414"));
            isoCountries.add(new ISOCountry("Kyrgyzstan", "KG", "KGZ", "417"));
            isoCountries.add(new ISOCountry("Lao People's Democratic Republic", "LA", "LAO", "418"));
            isoCountries.add(new ISOCountry("Latvia", "LV", "LVA", "428"));
            isoCountries.add(new ISOCountry("Lebanon", "LB", "LBN", "422"));
            isoCountries.add(new ISOCountry("Lesotho", "LS", "LSO", "426"));
            isoCountries.add(new ISOCountry("Liberia", "LR", "LBR", "430"));
            isoCountries.add(new ISOCountry("Libyan Arab Jamahiriya", "LY", "LBY", "434"));
            isoCountries.add(new ISOCountry("Liechtenstein", "LI", "LIE", "438"));
            isoCountries.add(new ISOCountry("Lithuania", "LT", "LTU", "440"));
            isoCountries.add(new ISOCountry("Luxembourg", "LU", "LUX", "442"));
            isoCountries.add(new ISOCountry("Macao", "MO", "MAC", "446"));
            isoCountries.add(new ISOCountry("Macedonia, the former Yugoslav Republic of", "MK", "MKD", "807"));
            isoCountries.add(new ISOCountry("Madagascar", "MG", "MDG", "450"));
            isoCountries.add(new ISOCountry("Malawi", "MW", "MWI", "454"));
            isoCountries.add(new ISOCountry("Malaysia", "MY", "MYS", "458"));
            isoCountries.add(new ISOCountry("Maldives", "MV", "MDV", "462"));
            isoCountries.add(new ISOCountry("Mali", "ML", "MLI", "466"));
            isoCountries.add(new ISOCountry("Malta", "MT", "MLT", "470"));
            isoCountries.add(new ISOCountry("Marshall Islands", "MH", "MHL", "584"));
            isoCountries.add(new ISOCountry("Martinique", "MQ", "MTQ", "474"));
            isoCountries.add(new ISOCountry("Mauritania", "MR", "MRT", "478"));
            isoCountries.add(new ISOCountry("Mauritius", "MU", "MUS", "480"));
            isoCountries.add(new ISOCountry("Mayotte", "YT", "MYT", "175"));
            isoCountries.add(new ISOCountry("Mexico", "MX", "MEX", "484"));
            isoCountries.add(new ISOCountry("Micronesia, Federated States of", "FM", "FSM", "583"));
            isoCountries.add(new ISOCountry("Moldova, Republic of", "MD", "MDA", "498"));
            isoCountries.add(new ISOCountry("Monaco", "MC", "MCO", "492"));
            isoCountries.add(new ISOCountry("Mongolia", "MN", "MNG", "496"));
            isoCountries.add(new ISOCountry("Montenegro", "ME", "MNE", "499"));
            isoCountries.add(new ISOCountry("Montserrat", "MS", "MSR", "500"));
            isoCountries.add(new ISOCountry("Morocco", "MA", "MAR", "504"));
            isoCountries.add(new ISOCountry("Mozambique", "MZ", "MOZ", "508"));
            isoCountries.add(new ISOCountry("Myanmar", "MM", "MMR", "104"));
            isoCountries.add(new ISOCountry("Namibia", "NA", "NAM", "516"));
            isoCountries.add(new ISOCountry("Nauru", "NR", "NRU", "520"));
            isoCountries.add(new ISOCountry("Nepal", "NP", "NPL", "524"));
            isoCountries.add(new ISOCountry("Netherlands", "NL", "NLD", "528"));
            isoCountries.add(new ISOCountry("New Caledonia", "NC", "NCL", "540"));
            isoCountries.add(new ISOCountry("New Zealand", "NZ", "NZL", "554"));
            isoCountries.add(new ISOCountry("Nicaragua", "NI", "NIC", "558"));
            isoCountries.add(new ISOCountry("Niger", "NE", "NER", "562"));
            isoCountries.add(new ISOCountry("Nigeria", "NG", "NGA", "566"));
            isoCountries.add(new ISOCountry("Niue", "NU", "NIU", "570"));
            isoCountries.add(new ISOCountry("Norfolk Island", "NF", "NFK", "574"));
            isoCountries.add(new ISOCountry("Northern Mariana Islands", "MP", "MNP", "580"));
            isoCountries.add(new ISOCountry("Norway", "NO", "NOR", "578"));
            isoCountries.add(new ISOCountry("Oman", "OM", "OMN", "512"));
            isoCountries.add(new ISOCountry("Pakistan", "PK", "PAK", "586"));
            isoCountries.add(new ISOCountry("Palau", "PW", "PLW", "585"));
            isoCountries.add(new ISOCountry("Palestinian Territory, Occupied", "PS", "PSE", "275"));
            isoCountries.add(new ISOCountry("Panama", "PA", "PAN", "591"));
            isoCountries.add(new ISOCountry("Papua New Guinea", "PG", "PNG", "598"));
            isoCountries.add(new ISOCountry("Paraguay", "PY", "PRY", "600"));
            isoCountries.add(new ISOCountry("Peru", "PE", "PER", "604"));
            isoCountries.add(new ISOCountry("Philippines", "PH", "PHL", "608"));
            isoCountries.add(new ISOCountry("Pitcairn", "PN", "PCN", "612"));
            isoCountries.add(new ISOCountry("Poland", "PL", "POL", "616"));
            isoCountries.add(new ISOCountry("Portugal", "PT", "PRT", "620"));
            isoCountries.add(new ISOCountry("Puerto Rico", "PR", "PRI", "630"));
            isoCountries.add(new ISOCountry("Qatar", "QA", "QAT", "634"));
            isoCountries.add(new ISOCountry("Réunion", "RE", "REU", "638"));
            isoCountries.add(new ISOCountry("Romania", "RO", "ROU", "642"));
            isoCountries.add(new ISOCountry("Russian Federation", "RU", "RUS", "643"));
            isoCountries.add(new ISOCountry("Rwanda", "RW", "RWA", "646"));
            isoCountries.add(new ISOCountry("Saint BarthÃ©lemy", "BL", "BLM", "652"));
            isoCountries.add(new ISOCountry("Saint Helena, Ascension and Tristan da Cunha", "SH", "SHN", "654"));
            isoCountries.add(new ISOCountry("Saint Kitts and Nevis", "KN", "KNA", "659"));
            isoCountries.add(new ISOCountry("Saint Lucia", "LC", "LCA", "662"));
            isoCountries.add(new ISOCountry("Saint Martin (French part)", "MF", "MAF", "663"));
            isoCountries.add(new ISOCountry("Saint Pierre and Miquelon", "PM", "SPM", "666"));
            isoCountries.add(new ISOCountry("Saint Vincent and the Grenadines", "VC", "VCT", "670"));
            isoCountries.add(new ISOCountry("Samoa", "WS", "WSM", "882"));
            isoCountries.add(new ISOCountry("San Marino", "SM", "SMR", "674"));
            isoCountries.add(new ISOCountry("Sao Tome and Principe", "ST", "STP", "678"));
            isoCountries.add(new ISOCountry("Saudi Arabia", "SA", "SAU", "682"));
            isoCountries.add(new ISOCountry("Senegal", "SN", "SEN", "686"));
            isoCountries.add(new ISOCountry("Serbia", "RS", "SRB", "688"));
            isoCountries.add(new ISOCountry("Seychelles", "SC", "SYC", "690"));
            isoCountries.add(new ISOCountry("Sierra Leone", "SL", "SLE", "694"));
            isoCountries.add(new ISOCountry("Singapore", "SG", "SGP", "702"));
            isoCountries.add(new ISOCountry("Sint Maarten (Dutch part)", "SX", "SXM", "534"));
            isoCountries.add(new ISOCountry("Slovakia", "SK", "SVK", "703"));
            isoCountries.add(new ISOCountry("Slovenia", "SI", "SVN", "705"));
            isoCountries.add(new ISOCountry("Solomon Islands", "SB", "SLB", "90"));
            isoCountries.add(new ISOCountry("Somalia", "SO", "SOM", "706"));
            isoCountries.add(new ISOCountry("South Africa", "ZA", "ZAF", "710"));
            isoCountries.add(new ISOCountry("South Georgia and the South Sandwich Islands", "GS", "SGS", "239"));
            isoCountries.add(new ISOCountry("Spain", "ES", "ESP", "724"));
            isoCountries.add(new ISOCountry("Sri Lanka", "LK", "LKA", "144"));
            isoCountries.add(new ISOCountry("Sudan", "SD", "SDN", "736"));
            isoCountries.add(new ISOCountry("Suriname", "SR", "SUR", "740"));
            isoCountries.add(new ISOCountry("Svalbard and Jan Mayen", "SJ", "SJM", "744"));
            isoCountries.add(new ISOCountry("Swaziland", "SZ", "SWZ", "748"));
            isoCountries.add(new ISOCountry("Sweden", "SE", "SWE", "752"));
            isoCountries.add(new ISOCountry("Switzerland", "CH", "CHE", "756"));
            isoCountries.add(new ISOCountry("Syrian Arab Republic", "SY", "SYR", "760"));
            isoCountries.add(new ISOCountry("Taiwan, Province of China", "TW", "TWN", "158"));
            isoCountries.add(new ISOCountry("Tajikistan", "TJ", "TJK", "762"));
            isoCountries.add(new ISOCountry("Tanzania, United Republic of", "TZ", "TZA", "834"));
            isoCountries.add(new ISOCountry("Thailand", "TH", "THA", "764"));
            isoCountries.add(new ISOCountry("Timor-Leste", "TL", "TLS", "626"));
            isoCountries.add(new ISOCountry("Togo", "TG", "TGO", "768"));
            isoCountries.add(new ISOCountry("Tokelau", "TK", "TKL", "772"));
            isoCountries.add(new ISOCountry("Tonga", "TO", "TON", "776"));
            isoCountries.add(new ISOCountry("Trinidad and Tobago", "TT", "TTO", "780"));
            isoCountries.add(new ISOCountry("Tunisia", "TN", "TUN", "788"));
            isoCountries.add(new ISOCountry("Turkey", "TR", "TUR", "792"));
            isoCountries.add(new ISOCountry("Turkmenistan", "TM", "TKM", "795"));
            isoCountries.add(new ISOCountry("Turks and Caicos Islands", "TC", "TCA", "796"));
            isoCountries.add(new ISOCountry("Tuvalu", "TV", "TUV", "798"));
            isoCountries.add(new ISOCountry("Uganda", "UG", "UGA", "800"));
            isoCountries.add(new ISOCountry("Ukraine", "UA", "UKR", "804"));
            isoCountries.add(new ISOCountry("United Arab Emirates", "AE", "ARE", "784"));
            isoCountries.add(new ISOCountry("United Kingdom", "GB", "GBR", "826"));
            isoCountries.add(new ISOCountry("United States", "US", "USA", "840"));
            isoCountries.add(new ISOCountry("United States Minor Outlying Islands", "UM", "UMI", "581"));
            isoCountries.add(new ISOCountry("Uruguay", "UY", "URY", "858"));
            isoCountries.add(new ISOCountry("Uzbekistan", "UZ", "UZB", "860"));
            isoCountries.add(new ISOCountry("Vanuatu", "VU", "VUT", "548"));
            isoCountries.add(new ISOCountry("Venezuela, Bolivarian Republic of", "VE", "VEN", "862"));
            isoCountries.add(new ISOCountry("Viet Nam", "VN", "VNM", "704"));
            isoCountries.add(new ISOCountry("Virgin Islands, British", "VG", "VGB", "092"));
            isoCountries.add(new ISOCountry("Virgin Islands, U.S.", "VI", "VIR", "850"));
            isoCountries.add(new ISOCountry("Wallis and Futuna", "WF", "WLF", "876"));
            isoCountries.add(new ISOCountry("Western Sahara", "EH", "ESH", "732"));
            isoCountries.add(new ISOCountry("Yemen", "YE", "YEM", "887"));
            isoCountries.add(new ISOCountry("Zambia", "ZM", "ZMB", "894"));
            isoCountries.add(new ISOCountry("Zimbabwe", "ZW", "ZWE", "716"));

            for(ISOCountry iSOCountry : isoCountries) {
                hs.save(iSOCountry);
            }        
            displayStatus = "successOnISOCountries";   
            displayMessage = "ISOCountries have been added. Count: " + isoCountries.size();
        }
    } else if("createLanguages".equals(command)) {
        if(Language.getTotalCount() > 0) {
            displayStatus = "errorOnLanguages";
            displayMessage = "There is one or more Language in database. You can not add new ones here.";
        } else {        
            List<Language> languages = new LinkedList<Language>();
            languages.add(new Language("Afrikaans", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Albanian", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Amharic", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Arabic", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Assyrian/Syriac", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Armenian", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Assamese", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Aymara", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Azerbaijani", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Basque", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Belarusian", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Bengali", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Bislama", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Bosnian", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Bulgarian", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Burmese", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Catalan", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Chinese, Mandarin", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Chinese, Cantonese", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Croatian", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Czech", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Danish", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Dhivehi", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Dutch", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Dzongkha", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("English", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Estonian", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Fijian", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Finnish", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("French", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Frisian (West)", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Gagauz", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Galician", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Georgian", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("German", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Greek", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Guaraní", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Gujarati", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Haitian Creole", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Hebrew", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Hindi", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Hiri Motu", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Hungarian", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Icelandic", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Indonesian", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Inuinnaqtun", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Inuktitut", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Irish", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Italian", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Japanese", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Kannada", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Kashmiri", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Kazakh", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Khmer", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Korean", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Kurdish", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Kyrgyz", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Lao", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Latin", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Latvian", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Lithuanian", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Luxembourgish", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Macedonian", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Malagasy", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Malay", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Malayalam", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Maltese", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Manx Gaelic", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Māori", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Marathi", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Mayan", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Mongolian", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Montenegrin", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Náhuatl", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Ndebele", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Nepali", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Northern Sotho", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Norwegian", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Occitan", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Oriya", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Ossetian", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Papiamento", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Pashto", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Persian", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Filipino", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Polish", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Portuguese", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Punjabi", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Quechua", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Romanian", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Romansh", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Russian", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Sanskrit", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Sarikoli", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Scottish Gaelic", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Serbian", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Shona", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Sindhi", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Sinhala", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Slovak", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Slovene", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Somali", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Sotho", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Spanish", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Sranan Tongo", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Swahili", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Swati", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Swedish", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Tagalog", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Tamil", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Telugu", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Tetum", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Thai", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Tok Pisin", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Tsonga", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Tswana", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Turkish", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Turkmen", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Ukrainian", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Urdu", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Uzbek", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Venda", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Vietnamese", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Welsh", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Xhosa", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Yoruba", Language.Type.SOVEREIGN_COUNTRIES));
            languages.add(new Language("Zulu", Language.Type.SOVEREIGN_COUNTRIES));

            languages.add(new Language("Adyghe", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Aghul", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Altay", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Avar", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Azeri", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Balkar", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Bashkir", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Basque", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Buryat", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Cantonese Chinese", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Catalan", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Chechen", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Cherkess", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Chipewyan", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Chukchi", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Chuvash", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Cree", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Dargwa", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Dolgan", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Erzya", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Even", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Evenki", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Faroese", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Finnish", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Galician", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Gwich'in", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Hawaiian", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Ingush", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Inuinnaqtun", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Inuktitut", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Inuvialuktun", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Kabardian", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Kalaallisut", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Kalmyk", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Karachay", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Karelian", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Khakas", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Khanty", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Komi", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Komi-Permyak", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Kumyk", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Lak", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Mansi", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Mari (Hill and Meadow)", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Moksha", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Nenets", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Nogai", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Occitan (Aranese)", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Ossetic (Digor and Iron dialects)", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Rusyn", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Rutul", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Sakha", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Sami", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Selkup", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("North and South Slavey", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Tabasaran", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Tahitian", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Tat", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Tatar", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Tibetan", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Tłįchǫ", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Tsakhur", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Tswana", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Tuvan", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Udmurt", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Uyghur", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Veps", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Vietnamese", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Yiddish", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Yukaghir", Language.Type.SUBNATIONAL_ENTITIES));
            languages.add(new Language("Zhuang", Language.Type.SUBNATIONAL_ENTITIES));
            for(Language language : languages) {
                hs.save(language);
            }
            displayStatus = "successOnLanguages";
            displayMessage = "Languages have been added. Count: " + languages.size();
        }
    } else if("createCurrencies".equals(command)) {
        if(Currency.getTotalCount() > 0) {
            displayStatus = "errorOnCurrencies";
            displayMessage = "There is one or more Currencies in database. You can not add new ones here.";
        } else {
            List<Currency> currencies = new LinkedList<Currency>();
            //currencies.add(new Currency("Euro", "EUR"));
            //currencies.add(new Currency("United States dollar", "USD"));
            //currencies.add(new Currency("Russian ruble", "RUB"));
            //currencies.add(new Currency("Ukrainian Hrivnia", "UAH"));
            //currencies.add(new Currency("Qatar Riyal", "QR"));

            currencies.add(new Currency("United Arab Emirates dirham", "AED"));
            currencies.add(new Currency("Afghan afghani", "AFN"));
            currencies.add(new Currency("Albanian lek", "ALL"));
            currencies.add(new Currency("Armenian dram", "AMD"));
            currencies.add(new Currency("Netherlands Antillean guilder", "ANG"));
            currencies.add(new Currency("Angolan kwanza", "AOA"));
            currencies.add(new Currency("Argentine peso", "ARS"));
            currencies.add(new Currency("Australian dollar", "AUD"));
            currencies.add(new Currency("Aruban florin", "AWG"));
            currencies.add(new Currency("Azerbaijani manat", "AZN"));
            currencies.add(new Currency("Bosnia and Herzegovina convertible mark", "BAM"));
            currencies.add(new Currency("Barbados dollar", "BBD"));
            currencies.add(new Currency("Bangladeshi taka", "BDT"));
            currencies.add(new Currency("Bulgarian lev", "BGN"));
            currencies.add(new Currency("Bahraini dinar", "BHD"));
            currencies.add(new Currency("Burundian franc", "BIF"));
            currencies.add(new Currency("Bermudian dollar (customarily known as Bermuda dollar)", "BMD"));
            currencies.add(new Currency("Brunei dollar", "BND"));
            currencies.add(new Currency("Boliviano", "BOB"));
            currencies.add(new Currency("Bolivian Mvdol (funds code)", "BOV"));
            currencies.add(new Currency("Brazilian real", "BRL"));
            currencies.add(new Currency("Bahamian dollar", "BSD"));
            currencies.add(new Currency("Bhutanese ngultrum", "BTN"));
            currencies.add(new Currency("Botswana pula", "BWP"));
            currencies.add(new Currency("Belarusian ruble", "BYR"));
            currencies.add(new Currency("Belize dollar", "BZD"));
            currencies.add(new Currency("Canadian dollar", "CAD"));
            currencies.add(new Currency("Congolese franc", "CDF"));
            currencies.add(new Currency("WIR Euro (complementary currency)", "CHE"));
            currencies.add(new Currency("Swiss franc", "CHF"));
            currencies.add(new Currency("WIR Franc (complementary currency)", "CHW"));
            currencies.add(new Currency("Unidad de Fomento (funds code)", "CLF"));
            currencies.add(new Currency("Chilean peso", "CLP"));
            currencies.add(new Currency("Chinese yuan", "CNY"));
            currencies.add(new Currency("Colombian peso", "COP"));
            currencies.add(new Currency("Unidad de Valor Real", "COU"));
            currencies.add(new Currency("Costa Rican colon", "CRC"));
            currencies.add(new Currency("Cuban convertible peso", "CUC"));
            currencies.add(new Currency("Cuban peso", "CUP"));
            currencies.add(new Currency("Cape Verde escudo", "CVE"));
            currencies.add(new Currency("Czech koruna", "CZK"));
            currencies.add(new Currency("Djiboutian franc", "DJF"));
            currencies.add(new Currency("Danish krone", "DKK"));
            currencies.add(new Currency("Dominican peso", "DOP"));
            currencies.add(new Currency("Algerian dinar", "DZD"));
            currencies.add(new Currency("Egyptian pound", "EGP"));
            currencies.add(new Currency("Eritrean nakfa", "ERN"));
            currencies.add(new Currency("Ethiopian birr", "ETB"));
            currencies.add(new Currency("Euro", "EUR"));
            currencies.add(new Currency("Fiji dollar", "FJD"));
            currencies.add(new Currency("Falkland Islands pound", "FKP"));
            currencies.add(new Currency("Pound sterling", "GBP"));
            currencies.add(new Currency("Georgian lari", "GEL"));
            currencies.add(new Currency("Ghanaian cedi", "GHS"));
            currencies.add(new Currency("Gibraltar pound", "GIP"));
            currencies.add(new Currency("Gambian dalasi", "GMD"));
            currencies.add(new Currency("Guinean franc", "GNF"));
            currencies.add(new Currency("Guatemalan quetzal", "GTQ"));
            currencies.add(new Currency("Guyanese dollar", "GYD"));
            currencies.add(new Currency("Hong Kong dollar", "HKD"));
            currencies.add(new Currency("Honduran lempira", "HNL"));
            currencies.add(new Currency("Croatian kuna", "HRK"));
            currencies.add(new Currency("Haitian gourde", "HTG"));
            currencies.add(new Currency("Hungarian forint", "HUF"));
            currencies.add(new Currency("Indonesian rupiah", "IDR"));
            currencies.add(new Currency("Israeli new shekel", "ILS"));
            currencies.add(new Currency("Indian rupee", "INR"));
            currencies.add(new Currency("Iraqi dinar", "IQD"));
            currencies.add(new Currency("Iranian rial", "IRR"));
            currencies.add(new Currency("Icelandic króna", "ISK"));
            currencies.add(new Currency("Jamaican dollar", "JMD"));
            currencies.add(new Currency("Jordanian dinar", "JOD"));
            currencies.add(new Currency("Japanese yen", "JPY"));
            currencies.add(new Currency("Kenyan shilling", "KES"));
            currencies.add(new Currency("Kyrgyzstani som", "KGS"));
            currencies.add(new Currency("Cambodian riel", "KHR"));
            currencies.add(new Currency("Comoro franc", "KMF"));
            currencies.add(new Currency("North Korean won", "KPW"));
            currencies.add(new Currency("South Korean won", "KRW"));
            currencies.add(new Currency("Kuwaiti dinar", "KWD"));
            currencies.add(new Currency("Cayman Islands dollar", "KYD"));
            currencies.add(new Currency("Kazakhstani tenge", "KZT"));
            currencies.add(new Currency("Lao kip", "LAK"));
            currencies.add(new Currency("Lebanese pound", "LBP"));
            currencies.add(new Currency("Sri Lankan rupee", "LKR"));
            currencies.add(new Currency("Liberian dollar", "LRD"));
            currencies.add(new Currency("Lesotho loti", "LSL"));
            currencies.add(new Currency("Lithuanian litas", "LTL"));
            currencies.add(new Currency("Latvian lats", "LVL"));
            currencies.add(new Currency("Libyan dinar", "LYD"));
            currencies.add(new Currency("Moroccan dirham", "MAD"));
            currencies.add(new Currency("Moldovan leu", "MDL"));
            currencies.add(new Currency("Malagasy ariary", "MGA"));
            currencies.add(new Currency("Macedonian denar", "MKD"));
            currencies.add(new Currency("Myanma kyat", "MMK"));
            currencies.add(new Currency("Mongolian tugrik", "MNT"));
            currencies.add(new Currency("Macanese pataca", "MOP"));
            currencies.add(new Currency("Mauritanian ouguiya", "MRO"));
            currencies.add(new Currency("Mauritian rupee", "MUR"));
            currencies.add(new Currency("Maldivian rufiyaa", "MVR"));
            currencies.add(new Currency("Malawian kwacha", "MWK"));
            currencies.add(new Currency("Mexican peso", "MXN"));
            currencies.add(new Currency("Mexican Unidad de Inversion (UDI) (funds code)", "MXV"));
            currencies.add(new Currency("Malaysian ringgit", "MYR"));
            currencies.add(new Currency("Mozambican metical", "MZN"));
            currencies.add(new Currency("Namibian dollar", "NAD"));
            currencies.add(new Currency("Nigerian naira", "NGN"));
            currencies.add(new Currency("Nicaraguan córdoba", "NIO"));
            currencies.add(new Currency("Norwegian krone", "NOK"));
            currencies.add(new Currency("Nepalese rupee", "NPR"));
            currencies.add(new Currency("New Zealand dollar", "NZD"));
            currencies.add(new Currency("Omani rial", "OMR"));
            currencies.add(new Currency("Panamanian balboa", "PAB"));
            currencies.add(new Currency("Peruvian nuevo sol", "PEN"));
            currencies.add(new Currency("Papua New Guinean kina", "PGK"));
            currencies.add(new Currency("Philippine peso", "PHP"));
            currencies.add(new Currency("Pakistani rupee", "PKR"));
            currencies.add(new Currency("Polish złoty", "PLN"));
            currencies.add(new Currency("Paraguayan guaraní", "PYG"));
            currencies.add(new Currency("Qatari riyal", "QAR"));
            currencies.add(new Currency("Romanian new leu", "RON"));
            currencies.add(new Currency("Serbian dinar", "RSD"));
            currencies.add(new Currency("Russian rouble", "RUB"));
            currencies.add(new Currency("Rwandan franc", "RWF"));
            currencies.add(new Currency("Saudi riyal", "SAR"));
            currencies.add(new Currency("Solomon Islands dollar", "SBD"));
            currencies.add(new Currency("Seychelles rupee", "SCR"));
            currencies.add(new Currency("Sudanese pound", "SDG"));
            currencies.add(new Currency("Swedish krona/kronor", "SEK"));
            currencies.add(new Currency("Singapore dollar", "SGD"));
            currencies.add(new Currency("Saint Helena pound", "SHP"));
            currencies.add(new Currency("Sierra Leonean leone", "SLL"));
            currencies.add(new Currency("Somali shilling", "SOS"));
            currencies.add(new Currency("Surinamese dollar", "SRD"));
            currencies.add(new Currency("South Sudanese pound", "SSP"));
            currencies.add(new Currency("São Tomé and Príncipe dobra", "STD"));
            currencies.add(new Currency("Syrian pound", "SYP"));
            currencies.add(new Currency("Swazi lilangeni", "SZL"));
            currencies.add(new Currency("Thai baht", "THB"));
            currencies.add(new Currency("Tajikistani somoni", "TJS"));
            currencies.add(new Currency("Turkmenistani manat", "TMT"));
            currencies.add(new Currency("Tunisian dinar", "TND"));
            currencies.add(new Currency("Tongan paʻanga", "TOP"));
            currencies.add(new Currency("Turkish lira", "TRY"));
            currencies.add(new Currency("Trinidad and Tobago dollar", "TTD"));
            currencies.add(new Currency("New Taiwan dollar", "TWD"));
            currencies.add(new Currency("Tanzanian shilling", "TZS"));
            currencies.add(new Currency("Ukrainian hryvnia", "UAH"));
            currencies.add(new Currency("Ugandan shilling", "UGX"));
            currencies.add(new Currency("United States dollar", "USD"));
            currencies.add(new Currency("United States dollar (next day) (funds code)", "USN"));
            currencies.add(new Currency("United States dollar (same day) (funds code) (one source[who?]claims it is no longer used, but it is still on the ISO 4217-MA list)", "USS"));
            currencies.add(new Currency("Uruguay Peso en Unidades Indexadas (URUIURUI) (funds code)", "UYI"));
            currencies.add(new Currency("Uruguayan peso", "UYU"));
            currencies.add(new Currency("Uzbekistan som", "UZS"));
            currencies.add(new Currency("Venezuelan bolívar fuerte", "VEF"));
            currencies.add(new Currency("Vietnamese dong", "VND"));
            currencies.add(new Currency("Vanuatu vatu", "VUV"));
            currencies.add(new Currency("Samoan tala", "WST"));
            currencies.add(new Currency("CFA franc BEAC", "XAF"));
            currencies.add(new Currency("Silver (one troy ounce)", "XAG"));
            currencies.add(new Currency("Gold (one troy ounce)", "XAU"));
            currencies.add(new Currency("European Composite Unit (EURCO) (bond market unit)", "XBA"));
            currencies.add(new Currency("European Monetary Unit (E.M.U.-6) (bond market unit)", "XBB"));
            currencies.add(new Currency("European Unit of Account 9(E.U.A.-9) (bond market unit)", "XBC"));
            currencies.add(new Currency("European Unit of Account 17(E.U.A.-17) (bond market unit)", "XBD"));
            currencies.add(new Currency("East Caribbean dollar", "XCD"));
            currencies.add(new Currency("Special drawing rights", "XDR"));
            currencies.add(new Currency("UIC franc (special settlement currency)", "XFU"));
            currencies.add(new Currency("CFA franc BCEAO", "XOF"));
            currencies.add(new Currency("Palladium (one troy ounce)", "XPD"));
            currencies.add(new Currency("CFP franc", "XPF"));
            currencies.add(new Currency("Platinum (one troy ounce)", "XPT"));
            currencies.add(new Currency("Code reserved for testing purposes", "XTS"));
            currencies.add(new Currency("No currency", "XXX"));
            currencies.add(new Currency("Yemeni rial", "YER"));
            currencies.add(new Currency("South African rand", "ZAR"));
            currencies.add(new Currency("Zambian kwacha", "ZMW"));

            for(Currency currency : currencies) {
                hs.save(currency);
            }        
            displayStatus = "successOnCurrencies";
            displayMessage = "Currencies have been added. Count: " + currencies.size();
       }
    }  else if("createActivitySectors".equals(command)) {
        if(! ActivitySectorGroup.getAll().isEmpty()) {
            displayStatus = "errorOnActivitySectors";
            displayMessage = "There is one or more ActivitySectorGroups in database. You can not add new ones here.";
        } else if(! ActivitySector.getAll().isEmpty()) {
            displayStatus = "errorOnActivitySectors";
            displayMessage = "There is one or more ActivitySectors in database. You can not add new ones here.";
        } else {
            List<ActivitySectorGroup> activitySectorGroups = new LinkedList<ActivitySectorGroup>();
            activitySectorGroups.add(new ActivitySectorGroup(null, "Banking", ""));
            activitySectorGroups.add(new ActivitySectorGroup(null, "Insurance", ""));
            activitySectorGroups.add(new ActivitySectorGroup(null, "Real Estate", ""));
            activitySectorGroups.add(new ActivitySectorGroup(null, "Resources", ""));
            activitySectorGroups.add(new ActivitySectorGroup(null, "Manufacturing", ""));
            activitySectorGroups.add(new ActivitySectorGroup(null, "Distribution", ""));
            activitySectorGroups.add(new ActivitySectorGroup(null, "Media", ""));
            activitySectorGroups.add(new ActivitySectorGroup(null, "Public sector", ""));

            List<ActivitySector> activitySectors = new LinkedList<ActivitySector>();
            activitySectors.add(new ActivitySector(null, "Banks", "Banks and other financial institutions providing lending and investments, without  capital markets", activitySectorGroups.get(0)));
            activitySectors.add(new ActivitySector(null, "Capital markets", "Companies, providing Leasing services", activitySectorGroups.get(0)));
            activitySectors.add(new ActivitySector(null, "Asset management", "", activitySectorGroups.get(0)));

            activitySectors.add(new ActivitySector(null, "Insurers", "Companies and institutions dealing with transfer of the risk of a loss, from one entity to another, in exchange for payment.", activitySectorGroups.get(1)));

            activitySectors.add(new ActivitySector(null, "Real estate", "Property made of land and the buildings on it, along with its natural resources such as crops, minerals, or water; immovable property; interests vested in it; real property; buildings or housing in general. It includes as well professions linked with buying, selling, or renting land, buildings or housing.", activitySectorGroups.get(2)));
            activitySectors.add(new ActivitySector(null, "Public works", "", activitySectorGroups.get(2)));

            activitySectors.add(new ActivitySector(null, "Resources", "Mining – extraction – working of resourses", activitySectorGroups.get(3)));
            activitySectors.add(new ActivitySector(null, "Energy", "This sector includes companies involved in the production, supply, exploration and development of oil or gas reserves, oil and gas drilling, or integrated power firms (petroleum, fuel, electricity).", activitySectorGroups.get(3)));
            activitySectors.add(new ActivitySector(null, "Agro-business", "Production, processing, and distribution of agricultural products and the manufacture of farm machinery, equipment, and supplies.", activitySectorGroups.get(3)));
            activitySectors.add(new ActivitySector(null, "Chemical", "Companies which produce and develop  chemicals", activitySectorGroups.get(3)));

            activitySectors.add(new ActivitySector(null, "Manufacturing", "Companies working in manufacturing", activitySectorGroups.get(4)));
            activitySectors.add(new ActivitySector(null, "Hi-tech", "", activitySectorGroups.get(4)));
            activitySectors.add(new ActivitySector(null, "Automotive", "Design, Development, manufacturing, marketing, and selling of motor vehicles including passenger cars, trucks, farm equipment, and other commercial vehicles (automobile industries)", activitySectorGroups.get(4)));
            activitySectors.add(new ActivitySector(null, "Aviation", "Companies, providing aviation services (airlines)", activitySectorGroups.get(4)));
            activitySectors.add(new ActivitySector(null, "Pharmaceuticals", "Development and production of pharmaceuticals", activitySectorGroups.get(4)));
            activitySectors.add(new ActivitySector(null, "Food and beverage", "Production, processing, and distribution of agricultural products and the manufacture of farm machinery, equipment, and supplies.", activitySectorGroups.get(4)));
            
            activitySectors.add(new ActivitySector(null, "Luxury", "Products or services of a very high standard, exclusiveness, quality of manufacturing, handmade, tailored for few", activitySectorGroups.get(5)));
            activitySectors.add(new ActivitySector(null, "Logistics", "Companies and/or agencies providing aviation, land transport, including rail, road and off-road transport, and ship transport for passengers and goods. Logistic services", activitySectorGroups.get(5)));
            activitySectors.add(new ActivitySector(null, "Transport", "Companies and/or agencies providing aviation, land transport, including rail, road and off-road transport, and ship transport for passengers and goods. Logistic services", activitySectorGroups.get(5)));
            activitySectors.add(new ActivitySector(null, "Retail", "", activitySectorGroups.get(5)));
            activitySectors.add(new ActivitySector(null, "Wholesale", "", activitySectorGroups.get(5)));
            activitySectors.add(new ActivitySector(null, "Services", "Intangible products such as accounting, cleaning, consultancy, private education, expertise, medical treatment, leisure, sports, publishing, consulting, advertising, communications, private defense. Human resources (search, outstaffing)", activitySectorGroups.get(5)));

            activitySectors.add(new ActivitySector(null, "Media", "Publishing- printing- broadcasting", activitySectorGroups.get(6)));
            activitySectors.add(new ActivitySector(null, "Telecoms", "Companies providing services in Telecom", activitySectorGroups.get(6)));
            activitySectors.add(new ActivitySector(null, "IT", "Companies providing services in IT (program development, web channels and platform building and maintenance etc)", activitySectorGroups.get(6)));
            activitySectors.add(new ActivitySector(null, "Tourism", "Tourism is the business of providing services for people on holiday, for example hotels, restaurants, trips, excursion etc.", activitySectorGroups.get(6)));
            activitySectors.add(new ActivitySector(null, "Hospitality", "", activitySectorGroups.get(6)));

            activitySectors.add(new ActivitySector(null, "Public sectors and government institutions", "Companies providing government services as police, military/defence, public roads, public transit, primary education, public education and healthcare. It also includes big state companies.", activitySectorGroups.get(7)));
            activitySectors.add(new ActivitySector(null, "Associations", "", activitySectorGroups.get(7)));
            activitySectors.add(new ActivitySector(null, "Health", "Companies, providing services linked with healthcare  (hospitals, clinics, etc)", activitySectorGroups.get(7)));
            activitySectors.add(new ActivitySector(null, "Education", "Companies, providing education services (additional education, universities, schools, professional development etc)", activitySectorGroups.get(7)));
            activitySectors.add(new ActivitySector(null, "International donor agencies", "Companies,  which organize and support work with donors", activitySectorGroups.get(7)));
            
            for(ActivitySectorGroup activitySectorGroup : activitySectorGroups) {
                hs.save(activitySectorGroup);
            }        
            for(ActivitySector activitySector : activitySectors) {
                hs.save(activitySector);
            }        
            displayStatus = "successOnActivitySectors";
            displayMessage = "ActivitySectorGroups have been added. Count: " + activitySectorGroups.size() + ", ";
            displayMessage += "ActivitySectors have been added. Count: " + activitySectors.size();
       }
    }
    
    
    hs.getTransaction().commit();
    
    request.setAttribute("displayStatus", displayStatus);               
    request.setAttribute("displayMessage", displayMessage);               
    %><jsp:include page="<%=frametemplate %>" flush="true" /><%
} catch (Exception ex) {
    hs.getTransaction().rollback();
    throw ex;
}
%>











