var contractSource = `
contract DemocraticPartAsset=

  record part = {
         creatorAddress : address,
         partName       : string,
         assetName      : string
             
   }
   
   
  record state ={
          parts : map(int, part),
          totalPart :int
    }
  
  entrypoint init() = {
        parts = {},
        totalPart = 0 
        
        }
  
  stateful entrypoint registerPart(name : string, asset : string) =
        let part ={
            creatorAddress = Call.caller,
            partName       = name,
            assetName      = asset
            }
        
        let index = getTotalPart() +1
        
        put( state { parts[index] = part, totalPart = index})
        
        
        
        
  entrypoint getPart(index :int ) :part =
    state.parts[index]
    
    
  entrypoint getTotalPart() : int =
        state.totalPart
`;
var contractAddress= "ct_KcvgWcMfaMwNvg6ywqMpKAgVVArmjTxzf2KCW7gvCXGz392LB";

var client =null;

var serviceArray = [];
var serviceLength =0;

async function renderPart() {
    var template=$('#template').html();
    Mustache.parse(template);
    var render = Mustache.render(template, {partArray});
    $('#service-lists').html(render);
    partTotal = await callStatic('sLength', [])
    $('#total').html(partTotal);
}

async function callStatic(func,args){
    const contract = await client.getContractInstance(contractSource, {contractAddress});
   
    const calledGet =await contract.call(func,args,{callStatic : true}).catch(e =>console.error(e))

    const decodedGet = await calledGet.decode().catch(e =>console.error(e));
    
    return decodedGet;
}

async function contractCall(func, args,value) {
    const contract = await client.getContractInstance(contractSource, {contractAddress});
   
    const calledGet =await contract.call(func,args,{amount : value}).catch(e =>console.error(e))

    return calledGet;
  }



window.addEventListener('load',async () =>{
    $('#loading').show();
    client = await Ae.Aepp();

    serviceLength = await callStatic('sLength', []);

    for (let i = 1; i <= serviceLength; i++) {
       const s = await callStatic('getSerices',[i]);

        serviceArray.push({
            sOwner           : s.sAddress,
            sName            : s.sName,
            sMapUrl          : s.mapUrl,
            photo            : s.photo
        })

        
    }

console.log(partArray);

    renderPart();

$('#loader').hide();
});



$(document).on('click','#saveBtn', async function(){
    $('#loader').show();
    const name = $('#name').val();
    const asset = $('#asset').val();

    // partArray.push({
    //     partName  : name,
    //     assetName : asset
    // })

await contractCall('registerPart',[name, asset], 0);
  renderPart();

$('#loader').hide();
});

