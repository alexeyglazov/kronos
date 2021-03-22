<%--
Document : subdepartments
Created on : 31.03.2011, 13:08:03
Author : glazov
--%>
<%@page import="com.mazars.management.web.vo.DescribedTimeSpentItemsInfo"%>
<%@page import="com.mazars.management.db.util.TimeSpentItemUtil"%>
<%@page import="javax.mail.Transport"%>
<%@page import="javax.mail.internet.MimeMessage"%>
<%@page import="javax.mail.Message"%>
<%@page import="javax.mail.internet.InternetAddress"%>
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

List<String> codes = new LinkedList<String>();
codes.add("0_M_CAS_AUDIT_SEZEM_2013_IFRS-REVIEW_3110");
codes.add("M_BAS_OUT_INNERWORKINGS_2014_OTHER_1");
codes.add("0_M_TLD_CONSULTING_PUMA_2013_BUSINESS_1");
codes.add("0_M_TLD_CONSULTING_BIOMERIEUX_2013_CONTRACT_1");
codes.add("0_M_TLD_COMPLIANCE_COOPERL_2013_CORPSCE_1");
codes.add("P_BAS_OUT_CAMUS_2013_OTHER_2");
codes.add("M_BAS_OUT_DELIFRANCE_2013_ACCTG_M12");
codes.add("M_TLD_TAX_DYSON_2013_REVIEW_2");
codes.add("P_BAS_OUT_CLUBFRANCE_2013_PAYROLL_1");
codes.add("M_TLD_TAX_SOFTLINE_2013_STRUCT_2");
codes.add("0_M_CAS_AUDIT_POTENZIAL_2013_IFRS-REVIEW_3110");
codes.add("0_M_CAS_AUDIT_SEEK_2013_IFRS-REVIEW_3110");
codes.add("0_M_CAS_AUDIT_EZSM_2013_IFRS-REVIEW_3110");
codes.add("0_M_CAS_AUDIT_ALS_2013_IFRS_3011");
codes.add("M_TLD_COMPLIANCE_VINCI_2014_MIGR_5");
codes.add("M_CAS_AUDIT_NICE_2013_IFRS_3112");
codes.add("P_BAS_OUT_ARTA_2014_PAYROLL_M1");
codes.add("M_BAS_OUT_ALDERLEY_2014_ACCTG_Q1");
codes.add("M_BAS_OUT_ALDERLEY_2013_ACCTG_Q4");
codes.add("M_BAS_OUT_REDWING_2014_OTHER_Q1");
codes.add("M_BAS_OUT_REDWING_2014_OTHER_Q1");
codes.add("M_BAS_OUT_ARCELOR_2014_OTHER_6");
codes.add("0_M_CAS_BKINSRE_SCMI_2013_IFRS_3112");
codes.add("M_TLD_TAXANDLEGAL_AFP_2014_CONSULT_1");
codes.add("M_TLD_TAX_MAYOLYS_2014_REVIEW_1");
codes.add("M_TLD_TAXANDLEGAL_FABERNOVEL_2013_CONSULT_1");
codes.add("0_M_CAS_BKINSRE_PRADUGA_2013_IFRS_3112");
codes.add("0_M_CAS_AUDIT_PCMA_2013_IFRS_3112");
codes.add("M_CAS_AUDIT_BERTLOG_2013_IFRS_3112");
codes.add("M_CAS_AUDIT_CEGEDIM_2013_IFRS-REVIEW_3112");
codes.add("M_TLD_COMPLIANCE_SERIMAX_2013_CORPSCE_2");
codes.add("P_BAS_OUT_CCIFR-LLC_2014_PAYROLL_1");
codes.add("0_M_CAS_AUDIT_AXIS_2013_IFRS_3112");
codes.add("0_M_CAS_AUDIT_MAYOLYS_2013_IFRS_3112");
codes.add("0_M_CAS_AUDIT_BEV_2013_IFRS_3112");
codes.add("M_CAS_AUDIT_EUROVERTOL_2013_AGREED-UPON_1");
codes.add("M_CAS_AUDIT_EPI-VOSTOK_2013_IFRS_3112");
codes.add("0_M_CAS_AUDIT_SESH_2013_IFRS_3112");
codes.add("M_CAS_AUDIT_GRANAT_2013_RAS_3112");
codes.add("M_TLD_COMPLIANCE_SABIC_2013_CORP_3");
codes.add("M_TLD_COMPLIANCE_SABENA_2013_MIGR_7");
codes.add("M_TLD_COMPLIANCE_VINCI-CGP_2014_MIGR_2");
codes.add("M_TLD_COMPLIANCE_COOPERL_2013_MIGR_1");
codes.add("P_BAS_OUT_ATOS_2014_PAYROLL_M2");
codes.add("0_M_CAS_AUDIT_SAFNEVA_2013_IFRS_3112");
codes.add("0_M_TLD_TAX_COOPERL_2014_CONSULT_1");
codes.add("0_M_TLD_COMPLIANCE_DIM_2013_CORP_2");
codes.add("0_M_TLD_COMPLIANCE_VINCI-CGP_2013_MIGR_28");
codes.add("0_M_TLD_COMPLIANCE_VINCI-CGP_2013_MIGR_26");
codes.add("0_M_TLD_COMPLIANCE_VINCI-YANAO_2013_MIGR_3");
codes.add("0_M_TLD_COMPLIANCE_VINCI-YANAO_2013_MIGR_2");
codes.add("0_M_TLD_COMPLIANCE_VINCI-CGP_2014_MIGR_1");
codes.add("0_M_TLD_COMPLIANCE_LVMH_2013_TRANSL_1");
codes.add("0_M_TLD_COMPLIANCE_VINCI-CGP_2013_MIGR_27");
codes.add("0_M_TLD_COMPLIANCE_VIR-PLAST_2013_MIGR_2");
codes.add("0_M_TLD_COMPLIANCE_VINCI-YANAO_2013_MIGR_1");
codes.add("M_TLD_TAX_HERMES-RUS_2014_TRANSFPRIC_1");
codes.add("M_CAS_AUDIT_MSSP_2013_IFRS-REVIEW_3112");
codes.add("M_CAS_AUDIT_HK_2013_RAS_3009");
codes.add("M_CAS_AUDIT_HK_2013_IFRS_3112");
codes.add("P_BAS_OUT_STOLESHNIKOV12_2014_OTHER_1");
codes.add("M_BAS_OUT_ARCELOR_2014_OTHER_2");
codes.add("M_BAS_OUT_ANOTECH_2014_TAX_1");
codes.add("M_BAS_OUT_ANOTECH_2014_TAX_2");
codes.add("M_BAS_OUT_ANOTECH_2014_TAX_3");
codes.add("M_BAS_OUT_ARCELOR_2014_OTHER_3");
codes.add("M_BAS_OUT_ARCELOR_2014_TAX_1");
codes.add("M_BAS_OUT_BEICIP_2014_TAX_2");
codes.add("M_BAS_OUT_CCIFR-LLC_2014_TAX_1");
codes.add("M_BAS_OUT_EDELMAN-IMAGELAND_2014_CLOSING_M2");
codes.add("M_BAS_OUT_INNERWORKINGS_2014_OTHER_4");
codes.add("M_BAS_OUT_LONGCHAMPRUS-LLC_2014_OTHER_1");
codes.add("M_BAS_OUT_SIAMP_2014_TAX_1");
codes.add("M_BAS_OUT_STOLESHNIKOV12_2014_OTHER_1");
codes.add("M_BAS_OUT_STOLESHNIKOV12_2014_OTHER_2");
codes.add("M_BAS_OUT_DELIFRANCE_2014_ACCTG_M2");
codes.add("M_BAS_OUT_V&P_2014_TAX_1");
codes.add("M_BAS_OUT_EDELMAN_2014_OTHER_1");
codes.add("M_TLD_COMPLIANCE_ACS_2013_MIGR_3");
codes.add("M_TLD_COMPLIANCE_VINCI_2014_MIGR_2");
codes.add("M_TLD_COMPLIANCE_VINCI_2014_MIGR_6");
codes.add("M_TLD_COMPLIANCE_REDWING_2014_MIGR_1");
codes.add("M_TLD_CONSULTING_FRANCE-TV_2014_TRANSL_1");
codes.add("M_TLD_TAX_MAZARS-HU_2014_CONSULT_1");
codes.add("P_BAS_OUT_GIDE_2014_OTHER_3");
codes.add("M_BAS_OUT_BIOMERIEUX_2014_PAYROLL_M2");
codes.add("M_TLD_CONSULTING_PUMA_2013_BUSINESS_1");
codes.add("P_BAS_OUT_NEXEO_2014_TAX_2");
codes.add("P_BAS_OUT_DELMONTE_2014_OTHER_1");
codes.add("M_BAS_OUT_GEWISS_2014_TAX_1");
codes.add("M_BAS_OUT_LONGCHAMPRUS-LLC_2014_IT_1");
codes.add("M_BAS_OUT_PROMOMED_2014_ACCTG_M2");
codes.add("M_BAS_OUT_SABIC_2014_OTHER_4");
codes.add("M_BAS_OUT_SABIC_2014_TAX_2");
codes.add("M_BAS_OUT_ARCELOR_2014_ACCTG_M2");
codes.add("M_TLD_CONSULTING_FORCE5_2014_BUSINESS_1");
codes.add("M_TLD_CONSULTING_WIRQUIN_2014_BUSINESS_1");
codes.add("M_TLD_CONSULTING_GEOTECHHOLDINGS_2014_BUSINESS_1");
codes.add("M_TLD_CONSULTING_COOPERL_2014_LABOR_1");
codes.add("M_BAS_OUT_AKKA-LLC_2014_PAYROLL_M2");
codes.add("P_BAS_OUT_ANOTECH_2014_PAYROLL_M2");
codes.add("P_BAS_OUT_CAMUS_2014_PAYROLL_M2");
codes.add("P_BAS_OUT_AXENS_2014_PAYROLL_M2");
codes.add("M_BAS_OUT_LONGCHAMP_2013_OTHER_1");
codes.add("P_BAS_OUT_DELMONTE_2014_PAYROLL_M2");
codes.add("M_TLD_CONSULTING_LACROIX-GROUP_2014_BUSINESS_1");
codes.add("M_TLD_COMPLIANCE_AS_2013_CORP_2");
codes.add("M_CAS_AUDIT_DATAVISION_2013_IFRS-REVIEW_3009");
codes.add("M_BAS_OUT_CRITEO_2013_OTHER_1");
codes.add("M_BAS_OUT_NITTO-RUS_2014_OTHER_1");
codes.add("M_BAS_OUT_NITTO-RUS_2014_ACCTG_M2");
codes.add("M_BAS_OUT_SABIC-EE_2014_ACCTG_M2");
codes.add("M_BAS_OUT_SABIC_2014_ACCTG_M2");
codes.add("M_BAS_OUT_STOLESHNIKOV12_2014_ACCTG_M2");
codes.add("M_BAS_OUT_STOLESHNIKOV12_2014_IT_M2");
codes.add("M_BAS_OUT_STOLESHNIKOV12_2014_OTHER_M2");
codes.add("P_BAS_OUT_STOLESHNIKOV12_2014_PAYROLL_M2");
codes.add("P_BAS_OUT_ANOTECH_2014_OTHER_2");
codes.add("P_BAS_OUT_ARTA_2014_PAYROLL_M2");
codes.add("M_BAS_OUT_DIM_2014_IT_M2");
codes.add("M_BAS_OUT_DIM_2014_OTHER_1");
codes.add("M_BAS_OUT_INNERWORKINGS_2014_TAX_1");
codes.add("M_BAS_OUT_DIM_2014_ACCTG_M2");
codes.add("P_BAS_OUT_INVENTIVHEALTH-LLC_2014_PAYROLL_M2");
codes.add("M_BAS_OUT_DIM_2014_TAX_1");
codes.add("P_BAS_OUT_ACCOR_2014_PAYROLL_M2");
codes.add("M_BAS_OUT_LORD_2014_OTHER_1");
codes.add("M_BAS_OUT_LONGCHAMPRUS-LLC_2014_OTHER_1");
codes.add("M_TLD_TAX_MAYOLYS_2014_REVIEW_2");
codes.add("M_BAS_OUT_ALTOONPOR_2012_CLOSING_1");
codes.add("M_BAS_OUT_MERIAL_2012_CLOSING_1");
codes.add("M_BAS_OUT_SABIC_2013_TAX_2");
codes.add("M_BAS_OUT_KME_2013_REVIEW_Q2");
codes.add("M_BAS_OUT_KIABI_2012_OTHER_1");
codes.add("M_BAS_OUT_COMATELEC_2011_CLOSING_1");
codes.add("M_BAS_OUT_KME_2012_OTHER_1");
codes.add("M_TLD_COMPLIANCE_SERIMAX_2012_CORPSCE_1");
codes.add("M_CAS_AUDIT_PCR_2013_IFRS-REVIEW_3112");
codes.add("M_CAS_AUDIT_PCMA_2013_IFRS_3112");
codes.add("M_TLD_TAX_PRADUGA_2013_TRANSFPRIC_1");
codes.add("M_CAS_BKINSRE_PRADUGA_2013_IFRS_3112");
codes.add("M_CAS_BKINSRE_SCMI_2013_IFRS_3112");
codes.add("0_M_CAS_AUDIT_PCMA_2013_IFRS-REVIEW_3006");
codes.add("0_M_CAS_AUDIT_PCMA_2012_IFRS_1");
codes.add("0_M_CAS_AUDIT_DONTERMINAL_2012_IFRS_3112");
codes.add("M_BAS_OUT_MERIAL_2012_CLOSING_1");
codes.add("M_CAS_AUDIT_BRAINPOWERCIS_2013_COMPILATION_3108");
codes.add("M_BAS_OUT_ARCELOR_2013_TAX_5");
codes.add("M_BAS_OUT_ARCELOR_2013_OTHER_7");
codes.add("M_TLD_CONSULTING_NITTO-RUS_2013_BUSINESS_1");
codes.add("M_BAS_OUT_FRANCE-TV_2013_ACCTG_Q4");
codes.add("M_BAS_OUT_EBARA-RUS_2013_ACCTG_Q3");
codes.add("M_CAS_AUDIT_GEFCO_2013_IFRS_3112");
codes.add("M_CAS_AUDIT_GEFCO_2013_RAS_3112");
codes.add("M_CAS_AUDIT_ALGAI_2013_IFRS_3112");
codes.add("M_CAS_AUDIT_ALGAI_2013_RAS_3112");
codes.add("M_CAS_AUDIT_PROMOD_2013_RAS_3112");
codes.add("M_CAS_CONSULT_SPKAMENSKI_2013_AGREED-UPON_1");
codes.add("M_BAS_OUT_ACCURAY_2013_ACCTG_Q4");
codes.add("P_BAS_OUT_BORDBIA_2013_ACCTG_Q4");
codes.add("M_BAS_OUT_CCIFR-LLC_2013_ACCTG_Q4");
codes.add("M_BAS_OUT_CH2M-HILL_2013_ACCTG_Q4");
codes.add("M_BAS_OUT_CLEMESSY_2013_ACCTG_Q4");
codes.add("M_BAS_OUT_CLUBFRANCE_2013_ACCTG_Q4");
codes.add("P_BAS_OUT_FIVESSTEIN-PE_2013_ACCTG_Q4");
codes.add("M_BAS_OUT_GEB-RUS_2013_ACCTG_Q4");
codes.add("M_BAS_OUT_HAMILTON_2013_ACCTG_Q4");
codes.add("P_BAS_OUT_IDIADA_2013_ACCTG_Q4");
codes.add("M_BAS_OUT_INEOVOSTOK_2013_ACCTG_Q4");
codes.add("M_BAS_OUT_INNERWORKINGS_2013_ACCTG_Q4");
codes.add("M_BAS_OUT_REDWING_2013_ACCTG_Q4");
codes.add("M_BAS_OUT_SIAMP_2013_ACCTG_Q4");
codes.add("M_BAS_OUT_SIT-CONTROLS_2013_ACCTG_Q4");
codes.add("M_BAS_OUT_TEKNALYS_2013_ACCTG_Q4");
codes.add("M_BAS_OUT_U-POL_2013_ACCTG_Q4");
codes.add("M_BAS_OUT_VECTOR_2013_ACCTG_Q4");
codes.add("M_BAS_OUT_VECTOR-STP_2013_ACCTG_Q4");
codes.add("M_CAS_AUDIT_ARMADILLO-PB_2013_RAS_3112");
codes.add("0_M_TLD_COMPLIANCE_VECTOR_2013_CORP_1");
codes.add("M_CAS_AUDIT_MM_2013_AGREED-UPON_1");
codes.add("0_M_TLD_TAX_DECATHLON_2013_EXPAT_1");
codes.add("M_CAS_AUDIT_INGENICO-PS_2013_IFRS_3112");
codes.add("0_M_TLD_TAX_RLG_2013_EXPAT_1");
codes.add("0_M_CAS_AUDIT_ALSTOM_2013_OTHER_2");
codes.add("M_CAS_AUDIT_BEV_2013_IFRS_3112");
codes.add("M_BAS_OUT_ARCELOR_2013_TAX_6");
codes.add("M_BAS_OUT_ARCELOR_2013_OTHER_5");
codes.add("0_M_CAS_AUDIT_ORGA_2013_RAS_3009");
codes.add("M_TLD_CONSULTING_DELMONTE_2013_BUSINESS_1");
codes.add("M_TLD_CONSULTING_SHAPERS-LLC_2013_BUSINESS_1");
codes.add("M_BAS_OUT_COOPERL-RUS_2013_ACCTG_Q4");
codes.add("0_M_TLD_COMPLIANCE_AS_2013_CORP_1");
codes.add("P_BAS_OUT_ATOS_2013_PAYROLL_M12");
codes.add("M_BAS_OUT_STOLESHNIKOV12_2013_OTHER_8");
codes.add("0_M_TLD_COMPLIANCE_VINCI-CGP_2013_MIGR_20");
codes.add("0_M_TLD_COMPLIANCE_VINCI-CGP_2013_MIGR_23");
codes.add("0_M_TLD_COMPLIANCE_VINCI-CGP_2013_MIGR_19");
codes.add("0_M_CAS_BKINSRE_ERIELL_2013_IFRS_3112");
codes.add("M_BAS_OUT_ALTOONPOR_2013_CLOSING_1");
codes.add("M_TLD_COMPLIANCE_AIRPOST_2014_TRANSL_1");
codes.add("M_TLD_TAX_SABIC_2014_CONSULT_1");
codes.add("M_BAS_OUT_STOLESHNIKOV12_2014_IT_M1");
codes.add("M_BAS_OUT_STOLESHNIKOV12_2014_OTHER_M1");
codes.add("M_TLD_CONSULTING_MAZARS_2013_LABOR_1");
codes.add("P_BAS_OUT_STOLESHNIKOV12_2014_PAYROLL_M1");
codes.add("M_TLD_TAX_KUHN-V_2013_CONSULT_2");
codes.add("P_BAS_OUT_STOLESHNIKOV12_2014_PAYROLL_1");
codes.add("M_TLD_TAX_TANEC_2013_CONSULT_1");
codes.add("M_BAS_OUT_ACTEON_2014_ACCTG_M1");
codes.add("M_BAS_OUT_CORSAIR_2014_ACCTG_M1");
codes.add("M_BAS_OUT_DELIFRANCE_2014_ACCTG_M1");
codes.add("M_BAS_OUT_DIM_2014_ACCTG_M1");
codes.add("M_BAS_OUT_SABIC-EE_2014_ACCTG_M1");
codes.add("M_BAS_OUT_VM-RUS_2014_ACCTG_M1");
codes.add("M_BAS_OUT_CHEMTURA_2014_PAYROLL_M1");
codes.add("M_BAS_OUT_CHEMTURA-RO_2014_PAYROLL_M1");
codes.add("M_BAS_OUT_PROMOMED_2014_ACCTG_M1");
codes.add("M_BAS_OUT_SABIC_2014_TAX_1");
codes.add("M_BAS_OUT_INNERWORKINGS_2014_OTHER_2");
codes.add("M_BAS_OUT_DIM_2014_IT_M1");
codes.add("M_BAS_OUT_EDELMAN-IMAGELAND_2014_CLOSING_M1");
codes.add("M_BAS_OUT_PROMOD_2014_IT_M1");
codes.add("M_BAS_OUT_MEADWESTVACO_2014_OTHER_1");
codes.add("M_BAS_OUT_SABIC_2014_OTHER_2");
codes.add("M_BAS_OUT_SABIC_2014_OTHER_3");
codes.add("P_BAS_OUT_NEXEO_2014_TAX_1");
codes.add("M_BAS_OUT_CHEMTURA_2014_OTHER_2");
codes.add("M_BAS_OUT_ACCOR_2013_OTHER_1");
codes.add("M_BAS_OUT_ACCOR_2014_OTHER_1");
codes.add("P_BAS_OUT_CHEMTURA_2014_OTHER_1");
codes.add("M_BAS_OUT_NITTO-RUS_2014_ACCTG_Q1");
codes.add("M_BAS_OUT_ARCELOR_2014_ACCTG_M1");
codes.add("M_BAS_OUT_BEICIP_2013_OTHER_1");
codes.add("P_BAS_OUT_ATOS_2014_PAYROLL_M1");
codes.add("P_BAS_OUT_ACCOR_2014_PAYROLL_M1");
codes.add("P_BAS_OUT_AXENS_2014_PAYROLL_M1");
codes.add("M_TLD_TAX_MA_2014_CONSULT_1");
codes.add("M_TLD_CONSULTING_VECTOR_2013_CONTRACT_2");
codes.add("M_TLD_TAX_KUHN-V_2013_CONSULT_1");
codes.add("M_TLD_TAX_COOPERL_2014_CONSULT_1");
codes.add("M_TLD_CONSULTING_EDELMAN_2014_BUSINESS_1");
codes.add("M_BAS_OUT_AKKA-LLC_2014_PAYROLL_M1");
codes.add("M_BAS_OUT_SABIC_2014_ACCTG_M1");
codes.add("M_BAS_OUT_BIOMERIEUX_2014_PAYROLL_M1");
codes.add("P_BAS_OUT_INVENTIVHEALTH-LLC_2014_PAYROLL_M1");
codes.add("M_BAS_OUT_NITTO-RUS_2014_PAYROLL_M1");
codes.add("M_BAS_OUT_DELMONTE_2014_PAYROLL_M1");
codes.add("P_BAS_OUT_CAMUS_2014_PAYROLL_M1");
codes.add("M_TLD_COMPLIANCE_FORTINET-BV_2013_CORP_1");
codes.add("M_CAS_AUDIT_AXIS_2013_IFRS_3112");
codes.add("M_CAS_AUDIT_SCHOELLER_2013_IFRS_3112");
codes.add("M_CAS_AUDIT_GERFLOR_2013_IFRS-REVIEW_3112");
codes.add("M_CAS_AUDIT_SESH_2013_IFRS_3112");
codes.add("M_CAS_AUDIT_MAYOLYS_2013_IFRS_3112");
codes.add("M_CAS_AUDIT_NIZHY_2013_IFRS_3112");
codes.add("M_CAS_BKINSRE_ZPIFURALSIBA_2013_RAS_3112");
codes.add("M_CAS_BKINSRE_ZIPFAC_2013_RAS_3112");
codes.add("M_CAS_BKINSRE_ZIPFIVN_2013_RAS_3112");
codes.add("M_CAS_BKINSRE_ZPIFRR_2013_RAS_3112");
codes.add("M_CAS_BKINSRE_ZIPFSI_2013_RAS_3112");
codes.add("M_CAS_BKINSRE_ZPIFZI_2013_RAS_3112");
codes.add("M_CAS_AUDIT_SAFNEVA_2013_IFRS_3112");
codes.add("M_CAS_AUDIT_SWATCH_2013_IFRS_3112");
codes.add("M_CAS_AUDIT_SWLP_2013_IFRS_3112");
codes.add("0_M_TLD_COMPLIANCE_EBARA_2013_CORP_2");
codes.add("M_BAS_OUT_PAYBACK-RUS_2014_ACCTG_Q1");
codes.add("M_TLD_TAX_CHARLES-ROLLET_2014_CONSULT_1");
codes.add("P_BAS_OUT_ANOTECH_2014_PAYROLL_M1");
codes.add("P_BAS_OUT_COMPUMARK_2014_PAYROLL_M1");
codes.add("M_CAS_AUDIT_SPECTRUMBR_2013_OTHER_1");
codes.add("M_BAS_OUT_U-POL_2014_TAX_1");
codes.add("0_M_TLD_COMPLIANCE_VINCI_2013_MIGR_18");
codes.add("0_M_TLD_COMPLIANCE_VINCI-CGP_2013_MIGR_25");
codes.add("M_CAS_AUDIT_ECORYS_2013_OTHER_3112");
codes.add("M_CAS_AUDIT_GFIVE_2013_IFRS_3112");
codes.add("M_TLD_TAXANDLEGAL_OSZ_2013_CONTRACT_1");
codes.add("M_BAS_OUT_DELIFRANCE_2013_ACCTG_M12");
codes.add("M_BAS_OUT_LONGCHAMPRUS-LLC_2013_OTHER_1");
codes.add("0_M_TLD_COMPLIANCE_VINCI-CGP_2013_MIGR_22");
codes.add("0_M_TLD_COMPLIANCE_VINCI-CGP_2013_MIGR_21");
codes.add("0_M_CAS_AUDIT_PCR_2013_IFRS-REVIEW_3112");
codes.add("M_CAS_AUDIT_YKK_2013_RAS_3112");
codes.add("M_BAS_OUT_ACCURAY_2014_ACCTG_Q1");
codes.add("M_BAS_OUT_BEICIP_2014_ACCTG_Q1");
codes.add("M_BAS_OUT_BIOMERIEUX_2014_ACCTG_Q1");
codes.add("M_BAS_OUT_BOOKINGCOM_2014_ACCTG_Q1");
codes.add("P_BAS_OUT_CAMUS_2014_ACCTG_Q1");
codes.add("M_BAS_OUT_CCIP_2014_ACCTG_Q1");
codes.add("M_BAS_OUT_CHEMTURA_2014_ACCTG_Q1");
codes.add("M_BAS_OUT_CHEMTURA-RO_2014_ACCTG_Q1");
codes.add("M_BAS_OUT_COOPERL-RUS_2014_ACCTG_Q1");
codes.add("M_BAS_OUT_EIRICH_2014_ACCTG_Q1");
codes.add("M_BAS_OUT_GEWISS_2014_ACCTG_Q1");
codes.add("M_BAS_OUT_LONGCHAMPRUS-LLC_2014_ACCTG_Q1");
codes.add("M_BAS_OUT_LORD_2014_ACCTG_Q1");
codes.add("M_BAS_OUT_LVMH_2014_ACCTG_Q1");
codes.add("P_BAS_OUT_NEXEO_2014_ACCTG_Q1");
codes.add("M_BAS_OUT_SIT-CONTROLS_2014_ACCTG_Q1");
codes.add("M_BAS_OUT_TEKNALYS_2014_ACCTG_Q1");
codes.add("M_BAS_OUT_U-POL_2014_ACCTG_Q1");
codes.add("M_BAS_OUT_VANLEEUWEN_2014_ACCTG_Q1");
codes.add("M_TLD_CONSULTING_SERIMAX_2013_BUSINESS_1");
codes.add("M_TLD_CONSULTING_FRANCE-TV_2014_LABOR_1");
codes.add("M_CAS_AUDIT_VD_2013_IFRS_3112");
codes.add("M_BAS_COMPLIANCE_ANOTECH_2011_CORPSCE_1");
codes.add("M_TLD_COMPLIANCE_VINCI-CGP_2014_MIGR_3");
codes.add("M_TLD_COMPLIANCE_VINCI-CGP_2014_MIGR_4");
codes.add("M_TLD_COMPLIANCE_VINCI-CGP_2014_MIGR_5");
codes.add("M_TLD_COMPLIANCE_POMA_2014_MIGR_2");
codes.add("M_TLD_COMPLIANCE_POMA_2014_MIGR_3");
codes.add("M_TLD_COMPLIANCE_VINCI_2014_MIGR_7");
codes.add("M_TLD_COMPLIANCE_VINCI_2014_MIGR_8");
codes.add("M_TLD_COMPLIANCE_VINCI-YANAO_2013_MIGR_4");
codes.add("M_TLD_CONSULTING_PUMA_2013_BUSINESS_1");
codes.add("M_CAS_AUDIT_BONDUELLE_2013_IFRS_3006");
codes.add("M_CAS_AUDIT_KUBANSKIE_2013_IFRS_3006");
codes.add("M_BAS_OUT_EDELMAN-IMAGELAND_2013_CLOSING_5");
codes.add("M_BAS_OUT_KME_2012_REVIEW_Q4");
codes.add("M_BAS_OUT_KME_2013_REVIEW_Q1");
codes.add("M_BAS_OUT_VECTOR_2013_OTHER_1");
codes.add("M_BAS_OUT_EDELMAN-IMAGELAND_2013_CLOSING_6");
codes.add("0_M_CAS_CONSULT_ESSILOR-FR_2012_CONSULT_1");
codes.add("0_M_CAS_AUDIT_BONDUELLE_2013_IFRS_3006");
codes.add("0_M_TLD_COMPLIANCE_VINCI-CGP_2013_MIGR_16");
codes.add("0_M_TLD_COMPLIANCE_VINCI-CGP_2014_MIGR_2");
codes.add("0_M_TLD_COMPLIANCE_AS_2013_CORP_2");
codes.add("M_TLD_CONSULTING_SEMIN-RUS_2014_BUSINESS_1");
codes.add("0_M_TLD_COMPLIANCE_VINCI-CGP_2013_MIGR_15");
codes.add("0_M_CAS_AUDIT_BERTPROJ_2013_IFRS_3112");
codes.add("M_CAS_AUDIT_GEODIS-RO_2013_AGREED-UPON_3112");
codes.add("0_M_CAS_AUDIT_GEFCO_2013_IFRS_3112");
codes.add("M_TLD_COMPLIANCE_MAZARSPT_2013_CORP_2");
codes.add("M_TLD_CONSULTING_MAZARSPT_2013_CONTRACT_1");
codes.add("M_CAS_AUDIT_KDZ_2013_RAS_3112");
codes.add("M_CAS_AUDIT_ALSTOMPU_2013_RAS_3112");
codes.add("M_CAS_AUDIT_MSSP_2013_RAS_3112");
codes.add("M_TLD_COMPLIANCE_ALIA_2013_MIGR_1");
codes.add("M_TLD_CONSULTING_SERIMAX_2013_BUSINESS_1");
codes.add("M_TLD_CONSULTING_NITTO-RUS_2013_BUSINESS_1");
codes.add("M_CAS_AUDIT_AUTODESK_2013_RAS_3112");
codes.add("0_M_CAS_AUDIT_AL_2013_IFRS_3011");
codes.add("M_CAS_AUDIT_SEZEM_2013_IFRS-REVIEW_3110");
codes.add("M_CAS_AUDIT_XANGO_2013_INVENT_3112");
codes.add("M_TLD_COMPLIANCE_TECNOVIA-RUS_2013_CORP_1");
codes.add("P_BAS_OUT_ARTA_2013_PAYROLL_M12");
codes.add("M_TLD_COMPLIANCE_EBARA_2013_CORP_2");
codes.add("P_BAS_OUT_ANOTECH_2013_PAYROLL_M12");
codes.add("M_BAS_OUT_SABIC_2013_ACCTG_M12");
codes.add("M_TLD_COMPLIANCE_COOPERL_2013_CORPSCE_1");
codes.add("M_BAS_OUT_LVMH_2014_PAYROLL_1");
codes.add("M_CAS_AUDIT_SCHNEIDER-ZAO_2013_IFRS_3112");
codes.add("M_BAS_OUT_SABIC_2014_OTHER_1");
codes.add("M_BAS_OUT_BIOMERIEUX_2014_OTHER_1");
codes.add("M_BAS_OUT_ARCELOR_2014_OTHER_1");
codes.add("M_BAS_OUT_STOLESHNIKOV12_2014_ACCTG_M1");
codes.add("M_BAS_OUT_SABIC-EE_2014_OTHER_1");
codes.add("M_BAS_OUT_CHEMTURA_2014_OTHER_1");
codes.add("M_BAS_OUT_STALLERGENES_2014_OTHER_1");
codes.add("M_CAS_AUDIT_ADECCO_2013_RAS_3112");
codes.add("M_CAS_AUDIT_AVANTA_2013_RAS_3112");
codes.add("0_M_CAS_CONSULT_SPKAMENSKI_2013_AGREED-UPON_1");
codes.add("M_TLD_COMPLIANCE_VINCI-CGP_2013_MIGR_26");
codes.add("M_TLD_COMPLIANCE_VINCI-CGP_2013_MIGR_27");
codes.add("M_TLD_COMPLIANCE_LVMH_2013_TRANSL_1");
codes.add("M_TLD_COMPLIANCE_VINCI-CGP_2013_MIGR_28");
codes.add("M_TLD_COMPLIANCE_POMA_2014_MIGR_1");
codes.add("M_TLD_COMPLIANCE_VECTOR_2013_CORPSCE_1");
codes.add("M_CAS_AUDIT_BERTPROJ_2013_IFRS_3112");
codes.add("M_TLD_TAX_ENERGIZER_2014_CONSULT_1");
codes.add("M_BAS_OUT_BIOMERIEUX_2013_PAYROLL_M12");
codes.add("M_BAS_OUT_SES_2012_TAX_1");
codes.add("M_BAS_OUT_KME_2013_REVIEW_Q3");
codes.add("M_CAS_AUDIT_EZSM_2013_IFRS-REVIEW_3110");
codes.add("M_CAS_AUDIT_NTC_2013_IFRS-REVIEW_3110");
codes.add("0_M_CAS_AUDIT_B-L_2013_INVENT_3112");
codes.add("M_TLD_COMPLIANCE_VINCI-CGPBR_2013_MIGR_14");
codes.add("M_TLD_COMPLIANCE_VINCI-CGP_2013_MIGR_21");
codes.add("M_TLD_COMPLIANCE_VINCI-CGP_2013_MIGR_25");
codes.add("M_TLD_COMPLIANCE_VECTOR_2013_CORP_3");
codes.add("M_TLD_COMPLIANCE_VINCI_2013_MIGR_27");
codes.add("M_TLD_COMPLIANCE_VINCI-CGP_2013_MIGR_22");
codes.add("M_TLD_COMPLIANCE_SABENA_2013_MIGR_4");
codes.add("M_TLD_COMPLIANCE_VINCI_2013_MIGR_18");
codes.add("M_CAS_AUDIT_AL_2013_IFRS_3112");
codes.add("M_CAS_AUDIT_ALS_2013_IFRS_3112");
codes.add("M_CAS_AUDIT_LTG_2013_IFRS_3112");
codes.add("M_CAS_AUDIT_LOGIKA_2013_IFRS_3112");
codes.add("M_CAS_AUDIT_TNT_2013_RAS_3112");
codes.add("0_M_CAS_AUDIT_LTG_2013_IFRS_3011");
codes.add("M_CAS_AUDIT_SAMSON_2013_RAS_3112");
codes.add("M_TLD_CONSULTING_VIR-PLAST_2013_BUSINESS_1");
codes.add("M_TLD_COMPLIANCE_SABENA_2014_MIGR_1");
codes.add("M_TLD_COMPLIANCE_VINCI_2014_MIGR_3");
codes.add("M_TLD_COMPLIANCE_VINCI_2014_MIGR_4");
codes.add("M_TLD_COMPLIANCE_DIM_2013_CORP_2");
codes.add("M_TLD_TAXANDLEGAL_MAZARSNL_2014_CONSULT_1");
codes.add("M_TLD_COMPLIANCE_VINCI-YANAO_2013_MIGR_1");
codes.add("M_TLD_COMPLIANCE_VINCI-YANAO_2013_MIGR_2");
codes.add("M_TLD_COMPLIANCE_VINCI-YANAO_2013_MIGR_3");
codes.add("M_TLD_COMPLIANCE_VINCI-YANAO_2013_MIGR_5");
codes.add("M_TLD_COMPLIANCE_VINCI-CGP_2014_MIGR_1");
codes.add("M_TLD_COMPLIANCE_ATOS-INV-BRCH_2014_MIGR_1");
codes.add("M_TLD_COMPLIANCE_VIR-PLAST_2013_MIGR_2");
codes.add("M_TLD_COMPLIANCE_VINCI_2014_MIGR_1");
codes.add("M_TLD_TAX_RLG_2013_EXPAT_1");
codes.add("M_TLD_CONSULTING_RODAMCO_2013_OTHER_1");
codes.add("M_CAS_AUDIT_FES_2012_RAS_3112");
codes.add("M_CAS_AUDIT_FES-S_2012_RAS_3112");
codes.add("M_CAS_AUDIT_NAT_2012_RAS_3112");
codes.add("M_CAS_AUDIT_PROCURI_2012_COMPILATION_3112");
codes.add("M_BAS_OUT_BEICIP_2014_TAX_1");
codes.add("M_BAS_OUT_KME_2012_REVIEW_Q3");


//String query = "select pc, ar from ProjectCode as pc left join pc.actRequests as ar where pc.code in :codes order by pc.code ";
String query = "select pc, ar from ProjectCode as pc left join pc.actRequests as ar order by pc.code ";
Query hq = hs.createQuery(query);
//hq.setParameterList("codes", codes);
List<Object[]> tuples = hq.list();
%><table border="1"><tr><td>PC ID</td><td>PC Code</td><td>Act ID</td><td>Act reference</td></tr><%
for(Object[] tuple : tuples) {
    ProjectCode projectCode = (ProjectCode)tuple[0];
    ActRequest actRequest = (ActRequest)tuple[1];
    %><tr><td><%=projectCode.getId() %></td><td><%=projectCode.getCode() %></td><td><%=actRequest != null ? actRequest.getId() : "<span style=\"color: #ff0000;\">NULL</span>" %></td><td><%=actRequest != null ? actRequest.getReference() : "<span style=\"color: #ff0000;\">NULL</span>" %></td></tr><%
}
%></table><%
hs.getTransaction().commit();
} catch (Exception ex) {
hs.getTransaction().rollback();
%>Fail<%
%>
{
"status": "FAIL",
"comment": <% ex.printStackTrace(new PrintWriter(out)); %>
}
<%
}
%>
