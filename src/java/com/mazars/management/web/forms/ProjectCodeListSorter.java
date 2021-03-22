/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;

/**
 *
 * @author glazov
 */
public class ProjectCodeListSorter {
    public enum Order {
        ASC,
        DESC
    }
    public enum Field {
        ID,
        CODE,
        GROUP,
        CLIENT,
        SUBDEPARTMENT,
        ACTIVITY,
        OFFICE,
        PERIOD_TYPE,
        PERIOD_QUARTER,
        PERIOD_MONTH,
        PERIOD_DATE,
        PERIOD_COUNTER,
        YEAR,
        FINANCIAL_YEAR,
        DESCRIPTION,
        COMMENT,
        CREATED_AT,
        CREATED_BY,
        IS_CLOSED,
        CLOSED_AT,
        CLOSED_BY,
        IN_CHARGE_PERSON,
        IN_CHARGE_PARTNER,
        START_DATE,
        END_DATE,
        IS_FUTURE,
        IS_DEAD
    }
    Field field;
    Order order;

    public Field getField() {
        return field;
    }

    public void setField(Field field) {
        this.field = field;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }


    public ProjectCodeListSorter() {
    }

    public static ProjectCodeListSorter getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ProjectCodeListSorter.class);
    }

    public Boolean isIdUsed() {
        if(Field.ID.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isCodeUsed() {
        if(Field.CODE.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isGroupUsed() {
        if(Field.GROUP.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isClientUsed() {
        if(Field.CLIENT.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isSubdepartmentUsed() {
        if(Field.SUBDEPARTMENT.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isActivityUsed() {
        if(Field.ACTIVITY.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isOfficeUsed() {
        if(Field.OFFICE.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isInChargePersonUsed() {
        if(Field.IN_CHARGE_PERSON.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isInChargePartnerUsed() {
        if(Field.IN_CHARGE_PARTNER.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isYearUsed() {
        if(Field.YEAR.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isFinancialYearUsed() {
        if(Field.FINANCIAL_YEAR.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isPeriodTypeUsed() {
        if(Field.PERIOD_TYPE.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isPeriodQuarterUsed() {
        if(Field.PERIOD_QUARTER.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isPeriodMonthUsed() {
        if(Field.PERIOD_MONTH.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isPeriodDateUsed() {
        if(Field.PERIOD_DATE.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isPeriodCounterUsed() {
        if(Field.PERIOD_COUNTER.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isCreatedAtUsed() {
        if(Field.CREATED_AT.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isCreatedByUsed() {
        if(Field.CREATED_BY.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isClosedByUsed() {
        if(Field.CLOSED_BY.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isClosedUsed() {
        if(Field.IS_CLOSED.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isClosedAtUsed() {
        if(Field.CLOSED_AT.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isStartDateUsed() {
        if(Field.START_DATE.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isEndDateUsed() {
        if(Field.END_DATE.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isFutureUsed() {
        if(Field.IS_FUTURE.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isDeadUsed() {
        if(Field.IS_DEAD.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isDescriptionUsed() {
        if(Field.DESCRIPTION.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isCommentUsed() {
        if(Field.COMMENT.equals(field)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isUsed() {
        return field != null;
    }
}
