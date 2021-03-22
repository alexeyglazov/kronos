/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class MailoutContentEditForm {
    public static class MailoutContent {
        private String layout;
        private List<Body> bodies = new LinkedList<Body>();
        private List<EmbeddedObject> embeddedObjects = new LinkedList<EmbeddedObject>();
        private List<Attachment> attachments = new LinkedList<Attachment>();
        private List<Link> links = new LinkedList<Link>();

        public MailoutContent() {
        }
        public String getLayout() {
            return layout;
        }

        public void setLayout(String layout) {
            this.layout = layout;
        }

        public List<Body> getBodies() {
            return bodies;
        }

        public void setBodies(List<Body> bodies) {
            this.bodies = bodies;
        }

        public List<EmbeddedObject> getEmbeddedObjects() {
            return embeddedObjects;
        }

        public void setEmbeddedObjects(List<EmbeddedObject> embeddedObjects) {
            this.embeddedObjects = embeddedObjects;
        }

        public List<Attachment> getAttachments() {
            return attachments;
        }

        public void setAttachments(List<Attachment> attachments) {
            this.attachments = attachments;
        }

        public List<Link> getLinks() {
            return links;
        }

        public void setLinks(List<Link> links) {
            this.links = links;
        }
    }     
    public static class Body {
        private String name;
        private String content;
        private Integer sortValue;
        public String getName() {
            return name;
        }
        public void setName(String name) {
            this.name = name;
        }
        public String getContent() {
            return content;
        }
        public void setContent(String content) {
            this.content = content;
        }

        public Integer getSortValue() {
            return sortValue;
        }

        public void setSortValue(Integer sortValue) {
            this.sortValue = sortValue;
        }
    }    
    public static class EmbeddedObject {
        private String name;
        private String source;
        public String getName() {
            return name;
        }
        public void setName(String name) {
            this.name = name;
        }

        public String getSource() {
            return source;
        }

        public void setSource(String source) {
            this.source = source;
        }

    } 
    public static class Attachment {
        private String name;
        private String source;
        public String getName() {
            return name;
        }
        public void setName(String name) {
            this.name = name;
        }

        public String getSource() {
            return source;
        }

        public void setSource(String source) {
            this.source = source;
        }

    }   
    public class Link {
        private String name;
        private String url;
        private String text;

        public Link() {
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }    
    private Long id;
    private MailoutContent mailoutContent;

    public MailoutContentEditForm() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public MailoutContent getMailoutContent() {
        return mailoutContent;
    }

    public void setMailoutContent(MailoutContent mailoutContent) {
        this.mailoutContent = mailoutContent;
    }

    public static MailoutContentEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, MailoutContentEditForm.class);
    }
}
