/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;

import com.google.gson.Gson;
import java.util.HashSet;
import java.util.Set;

/**
 *
 * @author glazov
 */
public class MailoutContent {
    public class Body {
        private String name;
        private String content;
        private Integer sortValue;

        public Body() {
        }

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
    public class EmbeddedObject {
        private String name;
        private String source;

        public EmbeddedObject() {
        }

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
    public class Attachment {
        private String name;
        private String source;

        public Attachment() {
        }

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
    private String layout;
    private Set<Body> bodies = new HashSet<Body>();
    private Set<EmbeddedObject> embeddedObjects = new HashSet<EmbeddedObject>();
    private Set<Attachment> attachments = new HashSet<Attachment>();
    private Set<Link> links = new HashSet<Link>();

    public MailoutContent() {
    }
    public MailoutContent(String json) {
        if(json == null || json.trim().equals("")) {
            this.layout = "";
            this.bodies = new HashSet<Body>();
            this.embeddedObjects = new HashSet<EmbeddedObject>();
            this.attachments = new HashSet<Attachment>();
            this.links = new HashSet<Link>();  
            return;
        }
        Gson gson = new Gson();
        MailoutContent mailoutContent = gson.fromJson(json, MailoutContent.class);
        this.layout = mailoutContent.getLayout();
        this.bodies = mailoutContent.getBodies();
        this.embeddedObjects = mailoutContent.getEmbeddedObjects();
        this.attachments = mailoutContent.getAttachments();
        this.links = mailoutContent.getLinks();
    }
    public String getJSON() {
        Gson gson = new Gson();
        return gson.toJson(this);
    }
    public String getLayout() {
        return layout;
    }

    public void setLayout(String layout) {
        this.layout = layout;
    }

    public Set<Body> getBodies() {
        return bodies;
    }

    public void setBodies(Set<Body> bodies) {
        this.bodies = bodies;
    }

    public Set<EmbeddedObject> getEmbeddedObjects() {
        return embeddedObjects;
    }

    public void setEmbeddedObjects(Set<EmbeddedObject> embeddedObjects) {
        this.embeddedObjects = embeddedObjects;
    }

    public Set<Attachment> getAttachments() {
        return attachments;
    }

    public void setAttachments(Set<Attachment> attachments) {
        this.attachments = attachments;
    }

    public Set<Link> getLinks() {
        return links;
    }

    public void setLinks(Set<Link> links) {
        this.links = links;
    }
    
    
}
