package com.mazars.management.db.util;

import java.io.PrintStream;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import org.hibernate.HibernateException;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.service.ServiceRegistryBuilder;

public class HibernateUtil {
    private static String databaseURL;
    private static String configFile;
    private static SessionFactory sessionFactory;
    private static ServiceRegistry serviceRegistry;

    public static String getDatabaseURL() {
        return databaseURL;
    }

    public static void setDatabaseURL(String databaseURL) {
        HibernateUtil.databaseURL = databaseURL;
    }

    public static String getConfigFile() {
        return configFile;
    }

    public static void setConfigFile(String configFile) {
        HibernateUtil.configFile = configFile;
    }
 
    private static Configuration doConfiguration() {
        Map<String, String> schemes = new HashMap<String, String>();
        schemes.put("mysql", "mysql");
        schemes.put("postgres", "postgresql");
        try {
            Configuration config = null;
            if(databaseURL != null ) {
                URI dbUri = new URI(databaseURL);
                String scheme = schemes.get(dbUri.getScheme());
                if(scheme == null) {
                    scheme = dbUri.getScheme();
                }
                String url = "jdbc:" + scheme + "://" + dbUri.getHost();
                if(dbUri.getPort() != -1) {
                    url += ":" + dbUri.getPort();
                }
                url += dbUri.getPath();
                if(dbUri.getQuery() != null) {
                    url += "?" + dbUri.getQuery();
                }
                config = new Configuration()
                .setProperty("hibernate.connection.url", url)
                .setProperty("hibernate.connection.username", dbUri.getUserInfo().split(":")[0])
                .setProperty("hibernate.connection.password", dbUri.getUserInfo().split(":")[1])
                .configure(HibernateUtil.configFile);
            } else {  
                config = new Configuration().configure(HibernateUtil.configFile);
            }
            return config;
        } catch (Throwable ex) {
            // Make sure you log the exception, as it might be swallowed
            System.out.println("Initial SessionFactory creation failed." + ex);
            ex.printStackTrace(new PrintStream(System.out));
            throw new ExceptionInInitializerError(ex);
        }
    }
    private static void configureSessionFactory() throws HibernateException {
        Configuration configuration = doConfiguration();
        serviceRegistry = new ServiceRegistryBuilder().applySettings(configuration.getProperties()).buildServiceRegistry();
        sessionFactory = configuration.buildSessionFactory(serviceRegistry);
    }
    public static SessionFactory getSessionFactory() {
        if(sessionFactory == null) {
            try {
                configureSessionFactory();
            } catch (Throwable ex) {
                ex.printStackTrace(new PrintStream(System.out));
            }
        }
        return sessionFactory;
    }
}