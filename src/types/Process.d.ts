namespace Process {
    export interface Entity {
        id?: string;
        process_number: string;
        title: string;
        status: string;
        depositor: string;
        cnpj_depositor: string;
        cpf_depositor: string;
        attorney: string;
        deposit_date: Date;
        concession_date: Date;
        validity_date: Date;
        company_id: string;
        process_type: string;
    };

    export interface ManageProcessBody {
        process: Entity,
        companyId: string,
        processId?: string,
    };
}
