/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.service;

import com.mazars.management.db.domain.ConfigProperty;
import com.mazars.management.db.util.HibernateUtil;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Date;
import java.util.Properties;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class ConfigUtils {
    private static Properties properties = new Properties();
    public static void init() {
        for(ConfigProperty configProperty : ConfigProperty.getAll()) {
            properties.put(configProperty.getName(), configProperty.getValue());
        }
    }

    public static Properties getProperties() {
        return properties;
    }

    public static void setProperties(Properties properties) {
        ConfigUtils.properties = properties;
    }
}
