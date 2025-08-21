package com.naveen.irn.sql;

import org.springframework.jdbc.core.JdbcTemplate;
public class IrnSqls {
    public static final String DMS_IRN_SQL =
        "select SOURCE, COMP, DOC_NO, DOC_DATE, CR_DATE, UP_DATE, Actual_error, Cond from (" +
        "select a.parent_group comp , " +
        "a.inv_type SOURCE," +
        "a.inv_num DOC_NO," +
        "a.inv_date DOC_DATE," +
        "a.created_date CR_DATE," +
        "a.modified_date UP_DATE," +
        "A.ERR_DESC ACTUAL_ERROR," +
        "DECODE (A.STATUS, 'P','D','Q','G','PE','R',A.STATUS) Cond," +
        "count(*) " +
        "  from sh_einvoice a " +
        "where TRUNC(a.INV_DATE) = TRUNC(SYSDATE) " +
        "   and a.status in ('Q', 'PE') " +
        "group by a.status," +
        "          a.inv_module," +
        "          a.parent_group, " +
        "          a.inv_type," +
        "          a.inv_num," +
        "          a.inv_date," +
        "          a.created_date," +
        "          a.modified_date," +
        "          A.ERR_DESC " +
        "UNION ALL " +
        "select a.parent_group comp, " +
        "a.inv_type SOURCE," +
        "a.inv_num DOC_NO," +
        "a.inv_date DOC_DATE," +
        "a.created_date CR_DATE," +
        "a.modified_date UP_DATE," +
        "A.ERR_DESC Actual_error," +
        "DECODE (A.STATUS, 'P','D','Q','G','PE','R',A.STATUS) Cond," +
        "count(*) " +
        "  from sh_einvoice_DTL a " +
        "where TRUNC(a.INV_DATE) = TRUNC(SYSDATE) " +
        "   and a.status in ('P') " +
        "group by a.status," +
        "          a.inv_module," +
        "          a.parent_group, " +
        "          a.inv_type," +
        "          a.inv_num," +
        "          a.inv_date," +
        "          a.created_date," +
        "          a.modified_date," +
        "          A.ERR_DESC" +
        ")";

    public static final String SPARES_IRN_SQL =
        "SELECT *\n" +
        "  FROM (SELECT cc.*\n" +
        "          FROM (SELECT x.invo_invt_type \"SOURCE\",\n" +
        "                       x.invo_comp_code \"COMP\",\n" +
        "                       x.invo_seq_no \"DOC_NO\",\n" +
        "                      TO_CHAR(to_date(x.invo_date), 'DD-MON-YYYY') \"DOC_DATE\",\n" +
        "                       '' \"CR_DATE\",\n" +
        "                       '' \"UP_DATE\",\n" +
        "                       '' \"Actual Error\",\n" +
        "                       CASE\n" +
        "                         WHEN ((SYSDATE - x.invo_date) * 24 * 60) <= 30 THEN\n" +
        "                          'G'\n" +
        "                         ELSE\n" +
        "                          'R'\n" +
        "                       END Cond\n" +
        "                  FROM mspr_invo x\n" +
        "                 WHERE 1 = 1\n" +
        "                   AND x.invo_date > trunc(SYSDATE) - 1\n" +
        "                   AND x.invo_irn_req_flag = 'Y'\n" +
        "                   AND x.invo_irn_process_flag IN ('I', 'E')\n" +
        "                ) cc\n" +
        "         WHERE 1 = 1\n" +
        "         ORDER BY cc.\"DOC_DATE\" DESC)\n" +
        "WHERE 1 = 1";

    public static final String MATERIAL_IRN_SQL =
        "select einm_source_doc_type \"SOURCE\",\n" +
                "       mat.get_comp_name(einm_comp_code) \"COMP\",\n" +
                "       einm_docdtls_no \"DOC_NO\",\n" +
                "       to_char(to_date(einm_docdtls_dt, 'DD/MM/YYYY'), 'DD-MON-YYYY') \"DOC_DATE\",\n" +
                "       to_char(einm_creation_date, 'DD-MON-YYYY HH24:MI:SS') \"CR_DATE\",\n" +
                "       to_char(einm_updated_date, 'DD-MON-YYYY HH24:MI:SS') \"UP_DATE\",\n" +
                "       Cond \"Cond\",\n" +
                "       error \"Actual_Error\",\n" +
                "       max(cnt) over(partition by cond) \"Count\"\n" +
                "  from (select einm_source_doc_type,\n" +
                "               einm_comp_code,\n" +
                "               einm_docdtls_no,\n" +
                "               einm_docdtls_dt,\n" +
                "               einm_creation_date,\n" +
                "               einm_updated_date,\n" +
                "               Cond,\n" +
                "               error,\n" +
                "               row_number() over(partition by cond order by cond) cnt\n" +
                "          from (select einm_source_doc_type,\n" +
                "                       einm_comp_code,\n" +
                "                       einm_docdtls_no,\n" +
                "                       einm_docdtls_dt,\n" +
                "                       einm_creation_date,\n" +
                "                       einm_updated_date,\n" +
                "                       case\n" +
                "                         when ((sysdate -\n" +
                "                              nvl(einm_file_transfer_date,\n" +
                "                                    (x.einm_creation_date + 4 / 1440))) * 24 * 60) <= 20 then\n" +
                "                                    case when nvl(einm_nic_code, einm_pwc_validation_code) is null then\n" +
                "                                      'G'\n" +
                "                                    else\n" +
                "                                      'R'\n" +
                "                                    end\n" +
                "                         when ((sysdate -\n" +
                "                              nvl(einm_file_transfer_date,\n" +
                "                                    (x.einm_creation_date + 4 / 1440))) * 24 * 60) > 20 then\n" +
                "                                    \n" +
                "                                    case when nvl(einm_nic_code, einm_pwc_validation_code) is null then\n" +
                "                                      'D'\n" +
                "                                    else\n" +
                "                                      'R'\n" +
                "                                    end\n" +
                "                       end Cond,\n" +
                "                       nvl(nvl(einm_nic_message, einm_pwc_validation_message),\n" +
                "                           (select genb_buf_desc1\n" +
                "                              from mat.mmat_genb\n" +
                "                             where genb_buf_terminal_no = 'IRNERRC'\n" +
                "                               and genb_buf_num2 =\n" +
                "                                   nvl(einm_nic_code, einm_pwc_validation_code))) error\n" +
                "                  from mat.mmat_einm x\n" +
                "                 where x.einm_creation_date >=\n" +
                "                       to_date(to_char(sysdate, 'dd-mon-yyyy') || ' ' ||\n" +
                "                               '00:00:01',\n" +
                "                               'dd-mon-yyyy hh24:mi:ss')\n" +
                "                   and einm_sub_type != 'For Own Use'\n" +
                "                   and einm_irn is null\n" +
                "                   and einm_source_doc_type <> 'STIG'))\n";

    public static final String SALES_IRN_SQL =
        "SELECT cc.*\n" +
        "  FROM (SELECT x.INIQ_DATA_SOURCE \"SOURCE\",\n" +
        "               iniq_status \"STATUS\",\n" +
        "               x.iniq_inv_prefix || x.iniq_inv_number \"DOC_NO\",\n" +
                "               TO_CHAR(to_date(x.INIQ_INV_DATE), 'DD-MON-YYYY') \"DOC_DATE\",\n" +
                "               TO_CHAR(X.INIQ_CREATED_ON, 'DD-MON-YYYY HH24:MI:SS') \"CR_DATE\",\n" +
                "               TO_CHAR(X.INIQ_INV_PRINT_DATE, 'DD-MON-YYYY HH24:MI:SS') \"UP_DATE\",\n" +
                "              (select D.INIE_NIC_CODE\n" +
        "                  from SSAL_INIE d\n" +
        "                 where d.inie_doc_num =\n" +
        "                       x.iniq_inv_prefix || x.iniq_inv_number\n" +
        "                       and d.inie_irn_flag='E'\n" +
        "                       and rownum=1) \"Actual Error\" \n" +
        "               ,\n" +
        "               CASE\n" +
        "                 WHEN (((sysdate - X.INIQ_INV_DATE)) * 24 * 60) <= 30 THEN\n" +
        "                  'G'\n" +
        "                 ELSE\n" +
        "                  'R'\n" +
        "               END Cond\n" +
        "          FROM ssal_iniq x\n" +
        "         where x.iniq_inv_date > sysdate - 3\n" +
        "           and x.iniq_irn_no is null\n" +
        "           and x.iniq_inv_type not in ('M')\n" +
        "           and x.iniq_inv_print_date is null\n" +
                "     and x.iniq_data_source not in ('SSAL_CRDN', 'SSAL_EXSC')" +
        "           ) cc\n" +
        "where 1 = 1\n" +
        "order by DOC_DATE DESC\n";

    /**
     * Call this before executing your DMS queries to set the session parameter.
     * Only use for DMS queries.
     * Example:
     *   IrnSqls.setInvisibleIndexesSession(dmsJdbcTemplate);
     *   dmsJdbcTemplate.queryForList(IrnSqls.DMS_IRN_SQL);
     */
    public static void setInvisibleIndexesSession(JdbcTemplate jdbcTemplate) {
        jdbcTemplate.execute("ALTER SESSION SET OPTIMIZER_USE_INVISIBLE_INDEXES = TRUE");
    }

}