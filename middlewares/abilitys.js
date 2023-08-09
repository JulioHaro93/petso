const {createMongoAbility, AbilityBuilder} = require('@casl/ability')
const RolEmpModel = require('../../lib/roles.json')


const defineAbility = (user, petition) =>{

    const rol = user.rolePermissions
    const {can, cannot, build} = new AbilityBuilder(createMongoAbility)
        if(rol!== null){
            
            if(rol.includes(petition))
                can(petition)
            else{
                cannot(petition)
            }                
        }
        //can(petition)
    return build()
}

const rolesAllowed = (user, petition)=>{
    let isAllowed;
    if(user){
        const ability = defineAbility(user, petition)
        isAllowed = ability.can(petition)
    }
    else if(!user){
        isAllowed === false
    }
        return isAllowed
        
    
}

module.exports ={
    rolesAllowed
}