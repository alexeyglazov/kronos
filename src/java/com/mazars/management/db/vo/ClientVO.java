package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.Client.ChannelType;
import com.mazars.management.db.domain.Client.CustomerType;
import java.util.LinkedList;
import java.util.List;

public class ClientVO {
    private Long id;
    private Client.ClientGroup clientGroup;
    private String name;
    private String codeName;
    private String alias;
    
    private String legalStreet;
    private String legalZipCode;
    private String legalCity;
    
    private Boolean isPostalAddressEqualToLegal;
    private String postalStreet;
    private String postalZipCode;
    private String postalCity;

    private String phone;
    private String email;
    private String taxNumber;
    private Boolean isListed;
    private Boolean isReferred;
    private Client.CustomerType customerType;
    private Client.ChannelType channelType;
    private Boolean isActive;
    private Boolean isFuture;
    private Boolean isExternal;
    private Boolean isTransnational;
    private String color;

    public ClientVO() {}

    public ClientVO(Client client) {
        this.id = client.getId();
        this.clientGroup = client.getClientGroup();
        this.name = client.getName();
        this.codeName = client.getCodeName();
        this.alias = client.getAlias();
        
        this.legalStreet = client.getLegalStreet();
        this.legalZipCode = client.getLegalZipCode();
        this.legalCity = client.getLegalCity();
        
        this.isPostalAddressEqualToLegal = client.getIsPostalAddressEqualToLegal();
        this.postalStreet = client.getPostalStreet();
        this.postalZipCode = client.getPostalZipCode();
        this.postalCity = client.getPostalCity();
        
        this.phone = client.getPhone();
        this.email = client.getEmail();
        this.taxNumber = client.getTaxNumber();
        this.isListed = client.getIsListed();
        this.isReferred = client.getIsReferred();
        this.customerType = client.getCustomerType();
        this.channelType = client.getChannelType();
        this.isActive = client.getIsActive();
        this.isTransnational = client.getIsTransnational();
        this.color = client.getColor();
        this.isFuture = client.getIsFuture();
        this.isExternal = client.getIsExternal();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Client.ClientGroup getClientGroup() {
        return clientGroup;
    }

    public void setClientGroup(Client.ClientGroup clientGroup) {
        this.clientGroup = clientGroup;
    }

    public String getCodeName() {
        return codeName;
    }

    public void setCodeName(String codeName) {
        this.codeName = codeName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public ChannelType getChannelType() {
        return channelType;
    }

    public void setChannelType(ChannelType channelType) {
        this.channelType = channelType;
    }

    public CustomerType getCustomerType() {
        return customerType;
    }

    public void setCustomerType(CustomerType customerType) {
        this.customerType = customerType;
    }

    public Boolean getIsPostalAddressEqualToLegal() {
        return isPostalAddressEqualToLegal;
    }

    public void setIsPostalAddressEqualToLegal(Boolean isPostalAddressEqualToLegal) {
        this.isPostalAddressEqualToLegal = isPostalAddressEqualToLegal;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getIsListed() {
        return isListed;
    }

    public void setIsListed(Boolean isListed) {
        this.isListed = isListed;
    }

    public Boolean getIsReferred() {
        return isReferred;
    }

    public void setIsReferred(Boolean isReferred) {
        this.isReferred = isReferred;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLegalStreet() {
        return legalStreet;
    }

    public void setLegalStreet(String legalStreet) {
        this.legalStreet = legalStreet;
    }

    public String getLegalZipCode() {
        return legalZipCode;
    }

    public void setLegalZipCode(String legalZipCode) {
        this.legalZipCode = legalZipCode;
    }

    public String getLegalCity() {
        return legalCity;
    }

    public void setLegalCity(String legalCity) {
        this.legalCity = legalCity;
    }

    public String getPostalStreet() {
        return postalStreet;
    }

    public void setPostalStreet(String postalStreet) {
        this.postalStreet = postalStreet;
    }

    public String getPostalZipCode() {
        return postalZipCode;
    }

    public void setPostalZipCode(String postalZipCode) {
        this.postalZipCode = postalZipCode;
    }

    public String getPostalCity() {
        return postalCity;
    }

    public void setPostalCity(String postalCity) {
        this.postalCity = postalCity;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getIsTransnational() {
        return isTransnational;
    }

    public void setIsTransnational(Boolean isTransnational) {
        this.isTransnational = isTransnational;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getTaxNumber() {
        return taxNumber;
    }

    public void setTaxNumber(String taxNumber) {
        this.taxNumber = taxNumber;
    }

    public Boolean getIsFuture() {
        return isFuture;
    }

    public void setIsFuture(Boolean isFuture) {
        this.isFuture = isFuture;
    }

    public Boolean getIsExternal() {
        return isExternal;
    }

    public void setIsExternal(Boolean isExternal) {
        this.isExternal = isExternal;
    }
    public static List<ClientVO> getList(List<Client> clients) {
        List<ClientVO> clientVOs = new LinkedList<ClientVO>();
        if(clients == null) {
            return null;
        }
        for(Client client : clients) {
           clientVOs.add(new ClientVO(client));
        }
        return clientVOs;
    }
}
