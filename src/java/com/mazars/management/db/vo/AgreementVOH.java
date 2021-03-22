/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;


/**
 *
 * @author glazov
 */
public class AgreementVOH extends AgreementVO {
    private Long projectCodeId;

    public AgreementVOH() {
        super();
    }
    public AgreementVOH(Agreement agreement) {
        super(agreement);
        if(agreement.getProjectCode() != null) {
            projectCodeId = agreement.getProjectCode().getId();
        }
    }

    public Long getProjectCodeId() {
        return projectCodeId;
    }

    public void setProjectCodeId(Long projectCodeId) {
        this.projectCodeId = projectCodeId;
    }

}
