package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.util.Date;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;

public class ContactHistoryItem {
    public static enum Status {
        CREATED,
        MODIFIED,
        SET_ACTIVE,
        SET_INACTIVE,
        CONFIRMED
    }
    private Long id;
    private Status status;
    private String comment;
    private Contact contact;
    private Date modifiedAt;
    private Employee modifiedBy;

    public ContactHistoryItem() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Contact getContact() {
        return contact;
    }

    public void setContact(Contact contact) {
        this.contact = contact;
    }

    public Date getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(Date modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

    public Employee getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(Employee modifiedBy) {
        this.modifiedBy = modifiedBy;
    }
    public static List<ContactHistoryItem> getList(Contact contact, ContactHistoryItem.Status status) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select chi from ContactHistoryItem as chi inner join chi.contact as c where c=:contact and chi.status=:status ";
        Query hq = hs.createQuery(query);
        hq.setParameter("contact", contact);
        hq.setParameter("status", status);
        return (List<ContactHistoryItem>)hq.list();
    }

}
