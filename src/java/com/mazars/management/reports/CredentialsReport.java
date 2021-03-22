/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.web.forms.CredentialsReportForm;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class CredentialsReport {
    public class RowComparator implements Comparator<Row> {
        @Override
        public int compare(Row o1, Row o2) {
            String groupName1 = "";
            String groupName2 = "";
            if(o1.getGroup() != null) {
                groupName1 = o1.getGroup().getName();
            }
            if(o2.getGroup() != null) {
                groupName2 = o2.getGroup().getName();
            }
            int a = groupName1.compareTo(groupName2);
            if(a != 0) {
                return a;
            }
            a = o1.getClient().getName().compareTo(o2.getClient().getName());
            if(a != 0) {
                return a;
            }
            
            if(o1.getActivitySectorGroup() != null && o2.getActivitySectorGroup() != null) {
                a = o1.getActivitySectorGroup().getName().compareTo(o2.getActivitySectorGroup().getName());
            }
            if(a != 0) {
                return a;
            }
            
            if(o1.getActivitySector() != null && o2.getActivitySector() != null) {
                a = o1.getActivitySector().getName().compareTo(o2.getActivitySector().getName());
            }
            if(a != 0) {
                return a;
            }
            String code1 = "";
            String code2 = "";
            if(o1.getProjectCode()!= null) {
                code1 = o1.getProjectCode().getCode();
            }
            if(o2.getProjectCode() != null) {
                code2 = o2.getProjectCode().getCode();
            }
            a = code1.compareTo(code2);
            if(a != 0) {
                return a;
            }
            
            return a;
        }
    }    
    public class Row {
        private Group group;
        private Client client;
        private Office office;
        private Department department;
        private Subdepartment subdepartment;
        private Activity activity;
        private ActivitySectorGroup activitySectorGroup;
        private ActivitySector activitySector;
        private ProjectCode projectCode;
        private Employee inChargePerson;

        public Row() {
        }

        public Group getGroup() {
            return group;
        }

        public void setGroup(Group group) {
            this.group = group;
        }

        public Client getClient() {
            return client;
        }

        public void setClient(Client client) {
            this.client = client;
        }

        public Office getOffice() {
            return office;
        }

        public void setOffice(Office office) {
            this.office = office;
        }

        public Department getDepartment() {
            return department;
        }

        public void setDepartment(Department department) {
            this.department = department;
        }

        public Subdepartment getSubdepartment() {
            return subdepartment;
        }

        public void setSubdepartment(Subdepartment subdepartment) {
            this.subdepartment = subdepartment;
        }

        public Activity getActivity() {
            return activity;
        }

        public void setActivity(Activity activity) {
            this.activity = activity;
        }

        public ActivitySectorGroup getActivitySectorGroup() {
            return activitySectorGroup;
        }

        public void setActivitySectorGroup(ActivitySectorGroup activitySectorGroup) {
            this.activitySectorGroup = activitySectorGroup;
        }

        public ActivitySector getActivitySector() {
            return activitySector;
        }

        public void setActivitySector(ActivitySector activitySector) {
            this.activitySector = activitySector;
        }

        public ProjectCode getProjectCode() {
            return projectCode;
        }

        public void setProjectCode(ProjectCode projectCode) {
            this.projectCode = projectCode;
        }

        public Employee getInChargePerson() {
            return inChargePerson;
        }

        public void setInChargePerson(Employee inChargePerson) {
            this.inChargePerson = inChargePerson;
        }

    }
    private List<Row> rows = new LinkedList<Row>();
    private Employee currentUser;
    private Module module;
    private CredentialsReportForm form;
    private Date createdAt;
    private Office formOffice;
    private Department formDepartment;
    private Subdepartment formSubdepartment;
    private Activity formActivity;
    private Group formGroup;
    private Client formClient;
    private ActivitySectorGroup formActivitySectorGroup;
    private ActivitySector formActivitySector;
    private ISOCountry formCountry;

    public CredentialsReport(CredentialsReportForm form, Module module, Employee currentUser) {
        this.form = form;
        this.module = module;
        this.currentUser = currentUser;
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(this.form.getOfficeId() != null) {
            this.formOffice = (Office)hs.get(Office.class, new Long(form.getOfficeId()));
        }
        if(this.form.getDepartmentId() != null) {
            this.formDepartment = (Department)hs.get(Department.class, new Long(form.getDepartmentId()));
        }
        if(this.form.getSubdepartmentId() != null) {
            this.formSubdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(form.getSubdepartmentId()));
        }
        if(this.form.getActivityId() != null) {
            this.formActivity = (Activity)hs.get(Activity.class, new Long(form.getActivityId()));
        }
        if(this.form.getGroupId() != null) {
            this.formGroup = (Group)hs.get(Group.class, new Long(form.getGroupId()));
        }
        if(this.form.getClientId() != null) {
            this.formClient = (Client)hs.get(Client.class, new Long(form.getClientId()));
        }
        if(this.form.getActivitySectorGroupId() != null) {
            this.formActivitySectorGroup = (ActivitySectorGroup)hs.get(ActivitySectorGroup.class, new Long(form.getActivitySectorGroupId()));
        }
        if(this.form.getActivitySectorId() != null) {
            this.formActivitySector = (ActivitySector)hs.get(ActivitySector.class, new Long(form.getActivitySectorId()));
        }
        if(this.form.getCountryId() != null) {
            this.formCountry = (ISOCountry)hs.get(ISOCountry.class, new Long(form.getCountryId()));
        }

    }

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }

    public Employee getCurrentUser() {
        return currentUser;
    }

    public void setCurrentUser(Employee currentUser) {
        this.currentUser = currentUser;
    }

    public Module getModule() {
        return module;
    }

    public void setModule(Module module) {
        this.module = module;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public CredentialsReportForm getForm() {
        return form;
    }

    public void setForm(CredentialsReportForm form) {
        this.form = form;
    }

    public Office getFormOffice() {
        return formOffice;
    }

    public void setFormOffice(Office formOffice) {
        this.formOffice = formOffice;
    }

    public Department getFormDepartment() {
        return formDepartment;
    }

    public void setFormDepartment(Department formDepartment) {
        this.formDepartment = formDepartment;
    }

    public Subdepartment getFormSubdepartment() {
        return formSubdepartment;
    }

    public void setFormSubdepartment(Subdepartment formSubdepartment) {
        this.formSubdepartment = formSubdepartment;
    }

    public Activity getFormActivity() {
        return formActivity;
    }

    public void setFormActivity(Activity formActivity) {
        this.formActivity = formActivity;
    }

    public Group getFormGroup() {
        return formGroup;
    }

    public void setFormGroup(Group formGroup) {
        this.formGroup = formGroup;
    }

    public Client getFormClient() {
        return formClient;
    }

    public void setFormClient(Client formClient) {
        this.formClient = formClient;
    }

    public ActivitySectorGroup getFormActivitySectorGroup() {
        return formActivitySectorGroup;
    }

    public void setFormActivitySectorGroup(ActivitySectorGroup formActivitySectorGroup) {
        this.formActivitySectorGroup = formActivitySectorGroup;
    }

    public ActivitySector getFormActivitySector() {
        return formActivitySector;
    }

    public void setFormActivitySector(ActivitySector formActivitySector) {
        this.formActivitySector = formActivitySector;
    }

    public ISOCountry getFormCountry() {
        return formCountry;
    }

    public void setFormCountry(ISOCountry formCountry) {
        this.formCountry = formCountry;
    }



    public void build() {
        buildClientReport();
        Collections.sort(rows, new RowComparator());
        this.createdAt = new Date();
    }
    public void buildClientReport() {
        List<ActivitySector> activitySectors = new LinkedList<ActivitySector>();
        if(formActivitySector != null) {
            activitySectors.add(formActivitySector);
        } else if(formActivitySectorGroup != null) {
            activitySectors.addAll(formActivitySectorGroup.getActivitySectors());
        }

        Country country = currentUser.getCountry();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select g, c, asg, asec, o, d, s, a, icp, pc from Client as c ";
        query += "left join c.clientActivitySectorLinks as casl left join casl.activitySector as asec left join asec.activitySectorGroup as asg ";
        
        query += "inner join c.projectCodes as pc ";
        query += "inner join pc.activity as a ";
        query += "inner join a.subdepartment as s ";
        query += "inner join s.department as d ";
        query += "inner join d.office as o ";
        query += "inner join pc.inChargePerson as icp ";
            
        query += "left join c.group as g ";
        query += "where ";
        query += "c.workCountry=:workCountry ";
        if(formClient != null) {
            query += "and c=:client ";
        }
        if(formGroup != null) {
            query += "and g=:group ";
        }
        if(formOffice != null) {
            query += "and o=:office ";
        }
        if(formDepartment != null) {
            query += "and d=:department ";
        }
        if(formSubdepartment != null) {
            query += "and s=:subdepartment ";
        }
        if(formActivity != null) {
            query += "and a=:activity ";
        }
        if(formOffice != null || formDepartment != null || formSubdepartment != null || formActivity != null) {
            query += "and s in :subdepartments ";
        }
        if(! activitySectors.isEmpty()) {
            query += "and (asec in (:activitySectors)) ";
        }
        if(formCountry != null) {
            query += "and c.country=:country ";
        }
        query += "group by c, pc ";
        Query hq = hs.createQuery(query);
        hq.setParameter("workCountry", country);
        if(formClient != null) {
            hq.setParameter("client", formClient);
        }
        if(formGroup != null) {
            hq.setParameter("group", formGroup);
        }
        if(formOffice != null) {
            hq.setParameter("office", formOffice);
        }
        if(formDepartment != null) {
            hq.setParameter("department", formDepartment);
        }
        if(formSubdepartment != null) {
            hq.setParameter("subdepartment", formSubdepartment);
        }
        if(formActivity != null) {
            hq.setParameter("activity", formActivity);
        }
        if(formOffice != null || formDepartment != null || formSubdepartment != null || formActivity != null) {
            List<Subdepartment> allowedSubdepartments = Subdepartment.getAllowedSubdepartments(formOffice, formDepartment, formSubdepartment, currentUser, module);
            hq.setParameterList("subdepartments", allowedSubdepartments);
        }
        if(! activitySectors.isEmpty()) {
            hq.setParameterList("activitySectors", activitySectors);
        }
        if(formCountry != null) {
            hq.setParameter("country", formCountry);
        }
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            Group group = (Group)tuple[0];
            Client client = (Client)tuple[1];
            ActivitySectorGroup activitySectorGroup = (ActivitySectorGroup)tuple[2];
            ActivitySector activitySector = (ActivitySector)tuple[3];
            Office office = (Office)tuple[4];
            Department department = (Department)tuple[5];
            Subdepartment subdepartment = (Subdepartment)tuple[6];
            Activity activity = (Activity )tuple[7];
            Employee inChargePerson = (Employee)tuple[8];
            ProjectCode projectCode = (ProjectCode)tuple[9];
            Row row = new Row();
            row.setGroup(group);
            row.setClient(client);
            row.setActivitySectorGroup(activitySectorGroup);
            row.setActivitySector(activitySector);
            row.setOffice(office);
            row.setDepartment(department);
            row.setSubdepartment(subdepartment);
            row.setActivity(activity);
            row.setInChargePerson(inChargePerson);
            row.setProjectCode(projectCode);
            this.rows.add(row);
        }
    }
}
