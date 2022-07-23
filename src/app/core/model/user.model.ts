import { FuseUtils } from '@fuse/utils';

export class User
{
    id: string;
    username: string;    
    avatar: string;     
    email: string;
    mobile: string;  
    active:boolean;

    /**
     * Constructor
     *
     * @param contact
     */
    constructor(contact)
    {
        {
            this.id = contact._id || FuseUtils.generateGUID();
            this.username = contact.username || '';          
            this.avatar = contact.avatar || 'assets/images/avatars/profile.jpg';            
            this.email = contact.email || '';
            this.mobile = contact.mobile || '';  
            this.active =  contact.active || false;         
        }
    }
}
