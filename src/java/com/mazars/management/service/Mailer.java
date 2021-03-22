/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.service;

import com.mazars.management.db.domain.Mailout;
import com.mazars.management.db.domain.MailoutContent;
import com.mazars.management.db.domain.MailoutHistoryItem;
import com.mazars.management.db.domain.MailoutRecipient;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.jobs.Job;
import java.io.File;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.internet.MimeUtility;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class Mailer {
    private Job job;
    private Mailout mailout;
    public Mailer(Mailout mailout) {
        this.mailout = mailout;
    }
    public Mailer(Mailout mailout, Job job) {
        this(mailout);
        this.job = job;
    }
    public void sendToSelected(List<MailoutRecipient> mailoutRecipients) throws MessagingException, UnsupportedEncodingException {
        Message message = null;
        List<Long> mailoutRecipientIds = new LinkedList<Long>();
        
        //====================================================
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            hs.refresh(mailout);
            Multipart multipart = getMultiPartMessage();                
            javax.mail.Session mailSession = this.getMailSession();
            message = getMessage(mailSession);
            message.setContent(multipart);
            
            Integer partSize = this.mailout.getPartSize();
            
            Date now = new Date();
            mailout.setStatus(Mailout.Status.STARTED);
            hs.save(mailout);
            MailoutHistoryItem mailoutHistoryItem = new MailoutHistoryItem();
            mailoutHistoryItem.setEmployee(job.getEmployee());
            mailoutHistoryItem.setTime(now);
            mailoutHistoryItem.setStatus(Mailout.Status.STARTED);
            mailoutHistoryItem.setComment("Mailout started");
            mailoutHistoryItem.setMailout(mailout);
            hs.save(mailoutHistoryItem);

            
            for(MailoutRecipient mailoutRecipient : mailoutRecipients) {
                hs.refresh(mailoutRecipient);
                if(! MailoutRecipient.Status.CREATED.equals(mailoutRecipient.getStatus())
                        && ! MailoutRecipient.Status.SEND_FAILED.equals(mailoutRecipient.getStatus())) {
                    continue;
                }
                mailoutRecipientIds.add(mailoutRecipient.getId());
                if(partSize != null && partSize > 0 && mailoutRecipientIds.size() >= partSize) {
                    break;
                }
            }
            hs.getTransaction().commit();
        } catch(Exception e) {
            hs.getTransaction().rollback();
            throw e;
        }
        //====================================================
        
        int counter = 0;
        for(Long mailoutRecipientId : mailoutRecipientIds) {
            if(job != null) {
                job.setPart(((double)counter) / mailoutRecipientIds.size());
            }
            
            //====================================================
            hs = HibernateUtil.getSessionFactory().getCurrentSession();
            try {
                hs.beginTransaction();
                MailoutRecipient mailoutRecipient = (MailoutRecipient)hs.get(MailoutRecipient.class, mailoutRecipientId);
                try {
                    InternetAddress[] recipients = {new InternetAddress(mailoutRecipient.getEmail())};
                    message.setRecipients(Message.RecipientType.TO, recipients);
                    Transport.send(message);
                    mailoutRecipient.setStatus(MailoutRecipient.Status.SENT);
                    mailoutRecipient.setComment("Successfully sent");
                } catch (Exception e) {
                    mailoutRecipient.setStatus(MailoutRecipient.Status.SEND_FAILED);
                    mailoutRecipient.setComment("" + e.getMessage());
                }
                hs.save(mailoutRecipient);
                hs.getTransaction().commit();
                Integer delay = this.mailout.getDelay();
                if(delay != null && delay > 0) {
                    try {
                        Thread.sleep(delay);
                    } catch(Exception e) {

                    }
                }
            } catch(Exception e) {
                hs.getTransaction().rollback();
                throw e;
            }
            //====================================================
            counter++;
            
        }
        
        //====================================================
        hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            hs.refresh(mailout);
            Date now = new Date();
            mailout.setStatus(Mailout.Status.FINISHED);
            hs.save(mailout);
            MailoutHistoryItem mailoutHistoryItem = new MailoutHistoryItem();
            mailoutHistoryItem.setEmployee(job.getEmployee());
            mailoutHistoryItem.setTime(now);
            mailoutHistoryItem.setStatus(Mailout.Status.FINISHED);
            mailoutHistoryItem.setComment("Mailout finished");
            mailoutHistoryItem.setMailout(mailout);
            hs.save(mailoutHistoryItem);
            hs.getTransaction().commit();
        } catch(Exception e) {
            hs.getTransaction().rollback();
            throw e;
        } 
        //====================================================
    }
    public void sendPartially() throws MessagingException, UnsupportedEncodingException {
        List<MailoutRecipient> mailoutRecipients = new LinkedList<MailoutRecipient>();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            hs.beginTransaction();
            hs.refresh(mailout);
            mailoutRecipients = new LinkedList(mailout.getMailoutRecipients());
            hs.getTransaction().commit();
        } catch(Exception e) {
            hs.getTransaction().rollback();
            throw e;
        } 
        sendToSelected(mailoutRecipients);
    }
    public void send() throws MessagingException, UnsupportedEncodingException {
        List<MailoutRecipient> mailoutRecipients = new LinkedList<MailoutRecipient>(mailout.getMailoutRecipients());
        Multipart multipart = getMultiPartMessage();                
        javax.mail.Session mailSession = this.getMailSession();
        MimeMessage message = getMessage(mailSession);
        message.setContent(multipart);
        int counter = 0;
        for(MailoutRecipient mailoutRecipient : mailoutRecipients) {
            if(job != null) {
                job.setPart(((double)counter) / mailoutRecipients.size());
            }
            InternetAddress[] recipients = {new InternetAddress(mailoutRecipient.getEmail())};
            message.setRecipients(Message.RecipientType.TO, recipients);
            try {
                Transport.send(message);
            } catch (Exception e) {
            
            }
            counter++;
        }        
    }  
    public void test() throws MessagingException, UnsupportedEncodingException {      
        Multipart multipart = getMultiPartMessage();                
        javax.mail.Session mailSession = this.getMailSession();
        MimeMessage message = getMessage(mailSession);
        message.setContent(multipart);
        Transport.send(message);      
    }
    private javax.mail.Session getMailSession() {
        javax.mail.Session mailSession = MailUtils.getSession();
        return mailSession;
    }
    private String getHtmlMessage() {
        String htmlMessage = mailout.getMailoutContent().getLayout();
        for(MailoutContent.Body body : mailout.getMailoutContent().getBodies()) {
            String name = body.getName();
            String content = body.getContent();
            //content = content.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
            htmlMessage = htmlMessage.replaceAll("<" + name + ">", content);
        }
        for(MailoutContent.Link link : mailout.getMailoutContent().getLinks()) {
            String name = link.getName();
            String url = link.getUrl();
            String text = link.getText();
            String linkHtml = "<a href=\"" + url + "\">" + text + "</a>";
            htmlMessage = htmlMessage.replaceAll("<" + name + ">", linkHtml);
        }
        for(MailoutContent.EmbeddedObject embeddedObject : mailout.getMailoutContent().getEmbeddedObjects()) {
            String name = embeddedObject.getName();
            String source = embeddedObject.getSource();
            String url = "cid:" + name;
            htmlMessage = htmlMessage.replaceAll("<" + name + ">", url);
        }        
        return htmlMessage;
    }    
    private MimeBodyPart getMimeBodyPart(MailoutContent.EmbeddedObject embeddedObject) throws MessagingException {
        String name = embeddedObject.getName();
        String source = embeddedObject.getSource();
        if(source.startsWith(File.separator)) {
            source = (String)ConfigUtils.getProperties().get("files.repository") + source;
        } else {
            source = (String)ConfigUtils.getProperties().get("files.repository") + File.separator + source;
        }
        MimeBodyPart mimeBodyPart = new MimeBodyPart();
        DataSource fds = new FileDataSource(source);  
        mimeBodyPart.setDataHandler(new DataHandler(fds));  
        mimeBodyPart.setHeader("Content-ID", "<" + name + ">");  
        return mimeBodyPart;
    }
    private MimeBodyPart getAttachment(MailoutContent.Attachment attachment) throws MessagingException, UnsupportedEncodingException {
        String name = attachment.getName();
        String source = attachment.getSource();
        if(source.startsWith(File.separator)) {
            source = (String)ConfigUtils.getProperties().get("files.repository") + source;
        } else {
            source = (String)ConfigUtils.getProperties().get("files.repository") + File.separator + source;
        }
        MimeBodyPart mimeBodyPart = new MimeBodyPart();
        DataSource fds = new FileDataSource(source);  
        mimeBodyPart.setDataHandler(new DataHandler(fds));
        mimeBodyPart.setFileName(MimeUtility.encodeText(name, "UTF-8", null));
        return mimeBodyPart;    
    }
    private Multipart getMultiPartMessage() throws MessagingException, UnsupportedEncodingException {
        String htmlMessage = this.getHtmlMessage();
        Multipart multipart = new MimeMultipart();

        MimeBodyPart htmlPart = new MimeBodyPart();
        htmlPart.setContent(htmlMessage, "text/html; charset=\"utf-8\""); 
        multipart.addBodyPart(htmlPart);
        
        for(MailoutContent.Attachment attachment : mailout.getMailoutContent().getAttachments()) {
            MimeBodyPart mimeAttachment = getAttachment(attachment);
            multipart.addBodyPart(mimeAttachment);
        }
        for(MailoutContent.EmbeddedObject embeddedObject : mailout.getMailoutContent().getEmbeddedObjects()) {
            MimeBodyPart mimeBodyPart = getMimeBodyPart(embeddedObject);
            multipart.addBodyPart(mimeBodyPart);
        }                
        return multipart;
    }
    private MimeMessage getMessage(javax.mail.Session mailSession) throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = new MimeMessage(mailSession);
        message.setFrom(new InternetAddress(mailout.getReplyTo(), mailout.getSenderName()));
        InternetAddress[] recipients = {new InternetAddress(mailout.getTestTo())};
        message.setRecipients(Message.RecipientType.TO, recipients);
        //message.setSubject(mailout.getSubject(), "UTF8");
        message.setSubject(MimeUtility.encodeText(mailout.getSubject(), "UTF8", "B"));
        message.setSentDate(new Date());
        if(mailout.getDispositionNotificationTo() != null && ! mailout.getDispositionNotificationTo().trim().equals("")) {
            message.setHeader("Disposition-Notification-To", mailout.getDispositionNotificationTo());
        }
        return message;
    }
}