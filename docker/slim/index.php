<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/vendor/autoload.php';

$app = AppFactory::create();
$app->addRoutingMiddleware();
$app->addBodyParsingMiddleware();
$app->addErrorMiddleware(true, true, true);
$app->add( function ($request, $handler) {
    $response = $handler->handle($request);

    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE')
        ->withHeader('Content-Type', 'application/json')
    ;
});

// ACÁ VAN LOS ENDPOINTS
function getConnection() {
    $db="localhost";
    $dbname="seminariophp";
    $dbuser= "seminariophp";
    $dbpass="seminariophp";
    $dbhost="db";
    $connection= new PDO("mysql:host=$dbhost;dbname=$dbname",$dbuser,$dbpass);
    $connection->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
    return $connection;
}

$app->get('/', function(Request $request,Response $response,$args){
    $response->getBody()->write("Hello world");
    return $response;
});
    
    $app->get('/tipos_propiedad', function(Request $request,Response $response,){
        try{
            $connection = getConnection();
            $query = $connection->query('SELECT * FROM tipo_propiedades');
            $tipos = $query->fetchAll(PDO::FETCH_ASSOC);
    
            $payload = json_encode([
                'status' => 'success',
                'code' => 200,
                'data' => $tipos
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(200);
        } catch(PDOException $e){
            $payload=json_encode([
                'status' => 'error',
                'code' => 500,
                "error" => $e->getMessage()
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(500);
        } 
    });  
    $app->post('/tipos_propiedad',function(Request $request,Response $response,){
        $data=$request->getParsedBody();
        $vector=array();
        if(!isset($data['nombre'])){
            $response->getBody()->write(json_encode(['status'=>'error','code'=>400,'error'=>'El campo nombre es requerido']));
            return $response->withHeader('Content-Type','application/json')->withStatus(400);
        }else {
         try{
            $conexion = getConnection();
            $nombre = $data['nombre'];
            
            $sql="SELECT * FROM tipo_propiedades WHERE nombre = '".$nombre ."'";
            $consulta_repetido=$conexion->query($sql);
            if($consulta_repetido->rowCount()>0){
               $str='El campo no puede repetirse';
               $vector['campoNombre']=$str;  
            }
            if(strlen($nombre)>50) { 
                $str='El nombre no puede superar los 50 caracteres';
                $vector['nombre50Caracteres']=$str;  
            } 
            if(!$vector){
             $sql="INSERT INTO tipo_propiedades (nombre) VALUES (:nombre)";
             $query=$conexion->prepare($sql);
             $query->bindValue(':nombre',$nombre);
             $query->execute();
             $response->getBody()->write(json_encode(['status'=>'success','code'=>201,'Registrado'=>'Se completo el registro']));
             return $response->withHeader('Content-Type','application/json')->withStatus(201);
            }
            else{
            $response->getBody()->write(json_encode(['status'=>'error','code'=>400,'error'=>$vector]));
            return $response->withHeader('Content-Type','application/json')->withStatus(400);
            }
        }
        catch (PDOException $e){
              $payload=json_encode([
                'status' => 'error',
                'code' => 500,
                "error" => $e
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(500);
        } 
      }
    });
    $app->put('/tipos_propiedad/{id}',function(Request $request,Response $response,array $args){
        $data=$request->getParsedBody();
        $buscarId=$args['id'];
        $vector=array();
        if(!isset($data['nombre'])){
            $response->getBody()->write(json_encode(['status'=>'error','code'=>400,'error'=>'El campo nombre es requerido']));
            return $response->withHeader('Content-Type','application/json')->withStatus(400);
        }else {
         try{
            $conexion = getConnection();
            $nombre = $data['nombre'];
            $sql="SELECT * FROM tipo_propiedades WHERE id=$buscarId";
            $query=$conexion->query($sql);
            $tipos = $query->fetch(PDO::FETCH_ASSOC);
            if(!($tipos)){
                $response->getBody()->write(json_encode(['status'=>'error','code'=>404,'errorId'=>'No hay ningun tipo de propiedad asociada a ese id']));
                return $response->withStatus(404);
            }
            $sql="SELECT * FROM tipo_propiedades WHERE nombre = '".$nombre ."'";
            $consulta_repetido=$conexion->query($sql);
            if($consulta_repetido->rowCount()>0){
               $vector['errorCampo']='El campo no puede repetirse';
            }
            if(strlen($nombre)>50) { 
                $vector['errorSize']='El nombre no puede superar los 50 caracteres';   
            } 
            if(!$vector){
             $sql="UPDATE tipo_propiedades SET nombre=:nombre WHERE id=$buscarId";
             $query=$conexion->prepare($sql);
             $query->bindValue(':nombre',$nombre);
             $query->execute();
             $response->getBody()->write(json_encode(['status'=>'success','code'=>201,'actualizacion'=>'Se actualizo el registro']));
             return $response->withHeader('Content-Type','application/json')->withStatus(201);
             } 
            else{
                $response->getBody()->write(json_encode(['status'=>'error','code'=>400,'error'=>$vector]));
                return $response->withHeader('Content-Type','application/json')->withStatus(400);
            } 
            }
        catch (PDOException $e){
              $payload=json_encode([
                'status' => 'success',
                'code' => 500,
                'error' => $e->getMessage()
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(500);
        } 
    }
    });
    $app->delete('/tipos_propiedad/{id}',function(Request $request,Response $response, array $args){
        $data=$request->getParsedBody();
        $buscarId=$args['id'];
        $vector=array();
         try{
            $conexion = getConnection();
            $sql="SELECT * FROM tipo_propiedades WHERE id=$buscarId";
            $query=$conexion->query($sql);
            $tipos = $query->fetch(PDO::FETCH_ASSOC);
            if(!($tipos)){
                $response->getBody()->write(json_encode(['status'=>'error','code'=>404,'errorId'=>'No hay ningun tipo de propiedad asociada a ese id']));
                return $response->withHeader('Content-Type','application/json')->withStatus(404);
            }
            $sql="SELECT * FROM propiedades WHERE tipo_propiedad_id=$buscarId";
            $query=$conexion->query($sql);
            if($query->rowCount()>0){
                $vector['errorPropiedad']='Hay una propiedad asociada a este tipo de id';
            }
            if(!$vector){
             $sql="DELETE FROM tipo_propiedades WHERE id=$buscarId";
             $query=$conexion->prepare($sql);
             $query->execute();
             return $response->withHeader('Content-Type','application/json')->withStatus(204);
             } 
            else{
                $response->getBody()->write(json_encode(['status'=>'error','code'=>400,'errors'=>$vector]));
                return $response->withHeader('Content-Type','application/json')->withStatus(400);
            } 
            }
        catch (PDOException $e){
              $payload=json_encode([
                'status' => 'success',
                'code' => 500,
                'error' => $e->getMessage()
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(500);
        } 
    }); 
    $app->get('/localidades', function(Request $request,Response $response,){
        try{
            $connection = getConnection();
            $query = $connection->query('SELECT * FROM localidades');
            $tipos = $query->fetchAll(PDO::FETCH_ASSOC);
    
            $payload = json_encode([
                'status' => 'success',
                'code' => 200,
                'data' => $tipos
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(200);
        } catch(PDOException $e){
            $payload=json_encode([
                'status' => 'success',
                'code' => 500,
                'errors'=>$e->getMessage()
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(500);
        } 
    });
    $app->post('/localidades',function(Request $request,Response $response,){
        $data=$request->getParsedBody();
        $vector=array();
        if(!isset($data['nombre'])){
            $response->getBody()->write(json_encode(['status'=>'error','code'=>400,'error'=>'El campo nombre es requerido']));
            return $response->withHeader('Content-Type','application/json')->withStatus(400);
        }else {
         try{
            $conexion = getConnection();
            $nombre = $data['nombre'];
    
            $sql="SELECT * FROM localidades WHERE nombre = '".$nombre ."'";
            $consulta_repetido=$conexion->query($sql);
            if($consulta_repetido->rowCount()>0){
               $vector['errorNombreRepetido']='El campo no puede repetirse';
            }
            if(strlen($nombre)>50) { 
                $vector['errorSize']='El nombre no puede superar los 50 caracteres';
            } 
            if($vector){
                $response->getBody()->write(json_encode(['status'=>'error','code'=>400,'error'=>$vector]));
                return $response->withHeader('Content-Type','application/json')->withStatus(400);
            }
            else{
             $sql="INSERT INTO localidades (nombre) VALUES (:nombre)";
             $query=$conexion->prepare($sql);
             $query->bindValue(':nombre',$nombre);
             $query->execute();
             $response->getBody()->write(json_encode(['status'=>'success','code'=>201,'Registro'=>'Se completo el registro']));
             return $response->withHeader('Content-Type','application/json')->withStatus(201);
             } 
            }
        catch (PDOException $e){
              $payload=json_encode([
                'status' => 'error',
                'code' => 500,
                "error" => $e->getMessage()
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(500);
        } 
      }
    });
    $app->put('/localidades/{id}',function(Request $request,Response $response,array $args){
        $data=$request->getParsedBody();
        $buscarId=$args['id'];
        $vector=array();
        if(!isset($data['nombre'])){
            $response->getBody()->write(json_encode(['status'=>'error','code'=>400,'errorCampoNombre'=>'El campo nombre es requerido']));
            return $response->withStatus(400);
        }else {
         try{
            $conexion = getConnection();
            $nombre = $data['nombre'];
            $sql="SELECT * FROM localidades WHERE id=$buscarId";
            $query=$conexion->query($sql);
            $tipos = $query->fetch(PDO::FETCH_ASSOC);
            if(!($tipos)){
                $response->getBody()->write(json_encode(['status'=>'error','code'=>404,'errorLocalidadInexistente'=>'No existe localidad asociada al ID']));
                return $response->withStatus(404);
    
            }
            $sql="SELECT * FROM localidades WHERE nombre = '".$nombre ."'";
            $consulta_repetido=$conexion->query($sql);
            if($consulta_repetido->rowCount()>0){
               $vector['errorNombreRepetido']='El campo no puede repetirse';
            }
            if(strlen($nombre)>50) { 
                $vector['errorSize']='El nombre no puede superar los 50 caracteres';  
            } 
            if($vector){
                $response->getBody()->write(json_encode(['status'=>'error','code'=>400,'ERRORS'=>$vector]));
                return $response->withHeader('Content-Type','application/json')->withStatus(400);
            }
            else{
             $sql="UPDATE localidades SET nombre=:nombre WHERE id=$buscarId";
             $query=$conexion->prepare($sql);
             $query->bindValue(':nombre',$nombre);
             $query->execute();
             $response->getBody()->write(json_encode(['status'=>'success','code'=>201,'actualizacion'=>'Se actualizo el registro']));
             return $response->withHeader('Content-Type','application/json')->withStatus(201);
             } 
            }
        catch (PDOException $e){
              $payload=json_encode([
                'status' => 'success',
                'code' => 500,
                'error' => $e->getMessage()
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(500);
        } 
    }
    });
    $app->delete('/localidades/{id}',function(Request $request,Response $response, array $args){
        $data=$request->getParsedBody();
        $buscarId=$args['id'];
        $vector=array();
         try{
            $conexion = getConnection();
            $sql="SELECT * FROM localidades WHERE id=$buscarId";
            $query=$conexion->query($sql);
            $tipos = $query->fetch(PDO::FETCH_ASSOC);
            if(!($tipos)){
                $response->getBody()->write(json_encode(['status'=>'error','code'=>404,'errorId'=>'No hay ninguna localidad asociada a ese id']));
                return $response->withHeader('Content-Type','application/json')->withStatus(404);
            }
            $sql="SELECT * FROM propiedades WHERE localidad_id=$buscarId";
            $query=$conexion->query($sql);
            if($query->rowCount()>0){
                $vector['errorPropiedad']='Hay una propiedad ubicada en esta localidad';
            }
            if(!$vector){
             $sql="DELETE FROM localidades WHERE id=$buscarId";
             $query=$conexion->prepare($sql);
             $query->execute();
             return $response->withHeader('Content-Type','application/json')->withStatus(204);
             } 
            else{
                $response->getBody()->write(json_encode(['error'=>$vector]));
                return $response->withHeader('Content-Type','application/json')->withStatus(400);
            } 
            }
        catch (PDOException $e){
              $payload=json_encode([
                'status' => 'success',
                'code' => 500,
                'error' => $e->getMessage()
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(500);
        } 
    }); 
    $app->get('/inquilinos', function(Request $request,Response $response,){
        try{
            $connection = getConnection();
            $query = $connection->query('SELECT * FROM inquilinos');
            $tipos = $query->fetchAll(PDO::FETCH_ASSOC);
            $payload = json_encode([
                'status' => 'success',
                'code' => 200,
                'data' => $tipos
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(200);
        } catch(PDOException $e){
            $payload=json_encode([
                'status' => 'success',
                'code' => 500,
                'error'=>$e->getMessage()
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(500);
        } 
    });
    $app->get('/inquilinos/{id}', function(Request $request,Response $response,array $args){
        $buscarId=$args['id'];
        try{
            $connection = getConnection();
            $sql="SELECT * FROM inquilinos WHERE id=$buscarId";
            $query = $connection->query($sql);
           $tipos = $query->fetch(PDO::FETCH_ASSOC);
           if(!($tipos)){
            $payload= json_encode([
                'status'=>'error',
                'code'=> 404,
                'error'=>'No existe inquilino asociado a ese id'
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(404);
        }
            else{
            $payload = json_encode([
                'status' => 'success',
                'code' => 200,
                'data' => $tipos
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(200);
        }
        } catch(PDOException $e){
            $payload=json_encode([
                'status' => 'error',
                'code' => 500,
                'error'=>$e->getMessage()
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(500);
        } 
    });  
    $app->get('/inquilinos/{id}/reservas', function(Request $request,Response $response,array $args){
        $buscarId=$args['id'];
        try{
            $connection = getConnection();
            $sql="SELECT * FROM inquilinos WHERE id=$buscarId";
            $query = $connection->query($sql);
           $tipos = $query->fetch(PDO::FETCH_ASSOC);
           if(!($tipos)){
            $payload= json_encode([
                'status'=>'error',
                'code'=> 404,
                'error'=>'No existe inquilino asociado a ese id'
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(404);
        }
            else{
            $sql="SELECT * FROM reservas WHERE inquilino_id=$buscarId";
                 $query = $connection->query($sql);
                 $tipos=$query->fetchAll(PDO::FETCH_ASSOC);
            if($query->rowCount()>0){
                $payload= json_encode([
                    'status'=>'success',
                    'code'=>200,
                    'data'=>$tipos
                ]);
                $response->getBody()->write($payload);
                return $response->withHeader('Content-Type','application/json')->withStatus(200);
            }
            else{
                $payload= json_encode([
                    'status'=>'error',
                    'code'=>400,
                    'error'=>'El inquilino buscado no tiene ninguna reserva'
                ]);
                $response->getBody()->write($payload);
                return $response->withHeader('Content-Type','application/json')->withStatus(400);
            }
        }
        } catch(PDOException $e){
            $payload=json_encode([
                'status' => 'error',
                'code' => 500,
                'error'=>$e->getMessage()
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(500);
        } 
    }); 
    $app->post('/inquilinos',function(Request $request,Response $response,){
        $data=$request->getParsedBody();
        $vector=array();
        $requiredFields=['apellido'=>'El campo apellido es requerido','nombre'=>'El campo nombre es requerido',
            'documento'=>'El campo Documento es requerido'
            ,'email'=>'El campo Email es requerido','activo'=>'El campo activo es requerido'];
            foreach($requiredFields as $key=>$message){
                if(!isset($data[$key])){
                    $vector[$key]=$message;
                }
            }
        if($vector){
            $response->getBody()->write(json_encode(['status'=>'error','code'=>400,'error'=>$vector]));
           return $response->withHeader('Content-Type','application/json')->withStatus(400);
        }
        else {
         try{
            $conexion = getConnection();
            $sql="SELECT * FROM inquilinos WHERE documento = '".$data['documento'] ."'";
            $consulta_repetido=$conexion->query($sql);
            if($consulta_repetido->rowCount()>0){
               $vector['errorDocumentoRepetido']='El campo documento no puede repetirse';
            }
            if(strlen($data['nombre'])>25) { 
                $vector['errorSizeNombre']='El nombre no puede superar los 25 caracteres';
            }
            if(strlen($data['apellido'])>15) { 
                $vector['errorSizeApellido']='El apellido no puede superar los 15 caracteres';  
            }
            if(strlen($data['email'])>20) { 
                $vector['errorSizeEmail']='El email no puede superar los 20 caracteres'; 
            }
            if($vector){
                $response->getBody()->write(json_encode(['status'=>'error','code'=>400,'error'=>$vector]));
                return $response->withHeader('Content-Type','application/json')->withStatus(400); 
            }
            else{
             $sql="INSERT INTO inquilinos (apellido,nombre,documento,email,activo) VALUES (:apellido,:nombre,:documento,:email,:activo)";
             $query=$conexion->prepare($sql);
             $query->bindValue(':apellido',$data['apellido']);
             $query->bindValue(':nombre',$data['nombre']);
             $query->bindValue(':documento',$data['documento']);
             $query->bindValue(':email',$data['email']);
             $query->bindValue(':activo',$data['activo']);
             $query->execute();
             $response->getBody()->write(json_encode(['status'=>'success','code'=>201,'registro'=>'Se completo el registro']));
             return $response->withHeader('Content-Type','application/json')->withStatus(201);
             } 
            }
        catch (PDOException $e){
              $payload=json_encode([
                'status' => 'success',
                'code' => 500,
                "error" => $e->getMessage()
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(500);
        } 
      }
    });
    $app->put('/inquilinos/{id}',function(Request $request,Response $response,array $args){
        $data=$request->getParsedBody();
        $buscarId=$args['id'];
        $vector=array();
         try{
            $requiredFields=['apellido'=>'El campo apellido es requerido','nombre'=>'El campo nombre es requerido',
            'documento'=>'El campo Documento es requerido'
            ,'email'=>'El campo Email es requerido','activo'=>'El campo activo es requerido'];
            foreach($requiredFields as $key=>$message){
                if(!isset($data[$key])){
                    $vector[$key]=$message;
                }
            }
            if($vector){
                $response->getBody()->write(json_encode(['status'=>'error','code'=>400,'errors'=>$vector]));
                return $response->withHeader('Content-Type','application/json')->withStatus(400);
            } 
            $conexion = getConnection();
            $sql="SELECT * FROM inquilinos WHERE id = '".$buscarId ."'";
            $query = $conexion->query($sql);
            $tipos = $query->fetch(PDO::FETCH_ASSOC);
            if(!($tipos)){
               $vector['errorInquilinoInexistente']='No existe inquilino con ese id';
               $estado=404;
            }
            else{
            $sql="SELECT * FROM inquilinos WHERE documento = '".$data['documento']."' and id !='".$buscarId."'";
            $query= $conexion->query($sql);
            if($query->rowCount()>0){
                $vector['InquilinoRepetido']='No puede repetirse el documento';
                $estado=400;
            }
            if((isset($data['nombre'])) and (strlen($data['nombre'])>25)) { 
                $vector['errorSizeNombre']='El nombre no puede superar los 25 caracteres';
                $estado=400;
            }
            if((isset($data['apellido'])) and (strlen($data['apellido'])>15)) { 
                $vector['errorSizeApellido']='El apellido no puede superar los 15 caracteres';  
                $estado=400;
            }
            if((isset($data['email'])) and (strlen($data['email'])>20)) { 
                $vector['errorSizeEmail']='El email no puede superar los 20 caracteres';  
                $estado=400;
            }
        }
            if($vector){
                $response->getBody()->write(json_encode(['status'=>'error','code'=>$estado,'errors'=>$vector]));
                return $response->withHeader('Content-Type','application/json')->withStatus($estado); 
            }
            else{
                foreach($data as $key=>$values){
                    if(isset($data[$key])){
                        $tipos[$key]=$values;
                    }
                }
             $sql="UPDATE inquilinos SET apellido=:apellido,nombre=:nombre,documento=:documento,email=:email,activo=:activo WHERE id=:buscarId";
             $query=$conexion->prepare($sql);
             $query->bindValue(':buscarId',$buscarId);
             $query->bindValue(':apellido',$tipos['apellido']);
             $query->bindValue(':nombre',$tipos['nombre']);
             $query->bindValue(':documento',$tipos['documento']);
             $query->bindValue(':email',$tipos['email']);
             $query->bindValue(':activo',$tipos['activo']);
             $query->execute();
             $response->getBody()->write(json_encode(['status'=>'success','code'=>201,'Actualizacion exitosa'=>'Se ha realizado la actualizacion']));
             return $response->withStatus(201);
             } 
            }
        catch (PDOException $e){
              $payload=json_encode([
                'status' => 'error',
                'code' => 500,
                "error" => $e->getMessage()
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(500);
        } 
      
    });
    $app->delete('/inquilinos/{id}',function(Request $request,Response $response, array $args){
        $buscarId=$args['id'];
        $vector=array();
         try{
            $conexion = getConnection();
            $sql="SELECT * FROM inquilinos WHERE id=$buscarId";
            $query=$conexion->query($sql);
            $tipos = $query->fetch(PDO::FETCH_ASSOC);
            if(!($tipos)){
                $vector['errorId']='No hay ningun inquilino asociado a ese id';
            }
            $sql="SELECT * FROM reservas WHERE inquilino_id=$buscarId";
            $query=$conexion->query($sql);
            if($query->rowCount()>0){
                $vector['errorReserva']='Hay una reserva asociada a este inquilino';
            }
            if(!$vector){
             $sql="DELETE FROM inquilinos WHERE id=$buscarId";
             $query=$conexion->prepare($sql);
             $query->execute();
             $response->getBody()->write(json_encode(['code'=>204]));
             return $response->withHeader('Content-Type','application/json')->withStatus(204);
             } 
            else{
                $response->getBody()->write(json_encode(['status'=>'error','code'=>400,'error'=>$vector]));
                return $response->withHeader('Content-Type','application/json')->withStatus(400);
            } 
            }
        catch (PDOException $e){
              $payload=json_encode([
                'status' => 'success',
                'code' => 500,
                'error' => $e->getMessage()
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(500);
        } 
    }); 
    $app->get('/propiedades', function(Request $request,Response $response,array $args){
        $filtros=$request->getQueryParams();
        try{
            $connection = getConnection();
            $consulta="";
            foreach($filtros as $key=>$value){
                if(isset($filtros[$key])){
                    $consulta=$consulta." and Prop.".$key."=".$value;
                }
            }
            $query = $connection->query('SELECT
                    Prop.*,Loc.nombre AS ciudad,
                    Tipo.nombre AS tipoPropiedad
                FROM 
                    propiedades Prop,
                    localidades Loc,
                    tipo_propiedades Tipo
                WHERE 
                    Prop.localidad_id=Loc.id 
                    and Prop.tipo_propiedad_id=Tipo.id '.$consulta);
            $tipos = $query->fetchAll(PDO::FETCH_ASSOC);
            $payload = json_encode([
                'status' => 'success',
                'code' => 200,
                'data' => $tipos
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(200);
        } catch(PDOException $e){
            $payload=json_encode([
                'status' => 'success',
                'code' => 500,
                'error'=>$e->getMessage()
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(500);
        } 
    });
    $app->get('/propiedades/{id}',function(Request $request, Response $response,array $args){
       $buscarId=$args['id'];
       try{
        $conexion=getConnection();
        $sql= "SELECT * FROM propiedades WHERE id=$buscarId";
        $query=$conexion->query($sql);
        $tipos=$query->fetch(PDO::FETCH_ASSOC);
        if(!$tipos){
            $response->getBody()->write(json_encode(['status'=>'error','code'=>404,'error Id'=>'No existe una propiedad asociada a ese id']));
            return $response->withStatus(404);   
        }
        else{
            $payload = json_encode([
                'status' => 'success',
                'code' => 200,
                'data' => $tipos
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(200);
        }
        } catch(PDOException $e){
            $payload=json_encode([
                'status' => 'error',
                'code' => 500,
                'error'=>$e->getMessage()
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(500);
        } 
    
    });
    $app->post('/propiedades',function(Request $request,Response $response,){
        $data=$request->getParsedBody();
        $vector=array();
        $requiredFields = [
            'domicilio' => 'El campo domicilio es requerido',
            'localidad_id' => 'El campo localidad_id es requerido',
            'cantidad_huespedes' => 'El campo cantidad_huespedes es requerido',
            'fecha_inicio_disponibilidad' => 'El campo fecha_inicio_disponibilidad es requerido',
            'cantidad_dias' => 'El campo cantidad_dias es requerido',
            'disponible' => 'El campo disponible es requerido',
            'valor_noche' => 'El campo valor_noche es requerido',
            'tipo_propiedad_id' => 'El campo tipo_propiedad_id es requerido'
        ];
        foreach ($requiredFields as $field => $errorMessage) {
            if (!isset($data[$field])) {
                $vector['error ' .$field] = $errorMessage;
            }
        }
        if($vector){
            $response->getBody()->write(json_encode(['status'=>'error','code'=>400,'errors'=>$vector]));
           return $response->withHeader('Content-Type','application/json')->withStatus(400);
        }
         try{
            $conexion = getConnection();
            $optionalFields=['cantidad_banios'=>null,'cantidad_habitaciones'=>null,'cochera'=>null,'imagen'=>null,'tipo_imagen'=>null];
            foreach($optionalFields as $key=>$values){
                if(!isset($data[$key])){
                    $data[$key]=$values;
                }
            }
              
            $sql="SELECT * FROM localidades WHERE id = '".$data["localidad_id"] ."'";
            $query=$conexion->query($sql);
            $consulta_repetido=$query->fetch(PDO::FETCH_ASSOC);
            if(!$consulta_repetido){
               $vector['errorLocalidadExistente']='No hay una localidad relacionada a ese id';
            }
            $sql="SELECT * FROM tipo_propiedades WHERE id ='".$data['tipo_propiedad_id'] ."'";
            $query=$conexion->query($sql);
            $consulta_repetido=$query->fetch(PDO::FETCH_ASSOC);
            if(!$consulta_repetido){
                $vector['errorPropiedadExistente']='No hay un tipo de propiedad relacionada a ese id';
            }
            if($vector){
                $response->getBody()->write(json_encode(['status'=>'error','code'=>400,'error'=>$vector]));
                return $response->withHeader('Content-Type','application/json')->withStatus(400);
            } 
            else{
             $sql="INSERT INTO propiedades (domicilio,localidad_id,cantidad_habitaciones,cantidad_banios,cochera,cantidad_huespedes,fecha_inicio_disponibilidad,cantidad_dias,disponible,valor_noche,tipo_propiedad_id,imagen,tipo_imagen) VALUES (:domicilio,:localidad_id,:cantidad_habitaciones,:cantidad_banios,:cochera,:cantidad_huespedes,:fecha_inicio_disponibilidad,:cantidad_dias,:disponible,:valor_noche,:tipo_propiedad_id,:imagen,:tipo_imagen)";
             $query=$conexion->prepare($sql);
             $query->bindValue(':domicilio',$data['domicilio']);
             $query->bindValue(':localidad_id',$data['localidad_id']);
             $query->bindValue(':cantidad_habitaciones',$data['cantidad_habitaciones']);
             $query->bindValue(':cantidad_banios',$data['cantidad_banios']);
             $query->bindValue(':cochera',$data['cochera']);
             $query->bindValue(':cantidad_huespedes',$data['cantidad_huespedes']);
             $query->bindValue(':fecha_inicio_disponibilidad',$data['fecha_inicio_disponibilidad']);
             $query->bindValue(':cantidad_dias',$data['cantidad_dias']);
             $query->bindValue(':disponible',$data['disponible']);
             $query->bindValue(':valor_noche',$data['valor_noche']);
             $query->bindValue(':tipo_propiedad_id',$data['tipo_propiedad_id']);
             $query->bindValue(':imagen',$data['imagen']);
             $query->bindValue(':tipo_imagen',$data['tipo_imagen']);
             $query->execute();
             $response->getBody()->write(json_encode(['status'=>'sucess','code'=>201,'Registrado'=>'Se completo el registro']));
             return $response->withHeader('Content-Type','application/json')->withStatus(201);
             } 
            }
        catch (PDOException $e){
              $payload=json_encode([
                'status' => 'error',
                'code' => 500,
                "error" => $e->getMessage()
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(500);
        } 
    });
    $app->put('/propiedades/{id}',function(Request $request,Response $response,array $args){
        $data=$request->getParsedBody();
        $buscarId=$args['id'];
        $vector=array();
         try{
            $conexion = getConnection();    
            $sql="SELECT * FROM propiedades WHERE id = '".$buscarId ."'";
            $query = $conexion->query($sql);
            $tipos = $query->fetch(PDO::FETCH_ASSOC);
            if(!($tipos)){
              $response->getBody()->write(json_encode(['errorPropiedadInexistente'=>'No existe propiedad asociada a ese ID']));
              return $response->withHeader('Content-Type','application/json')->withStatus(404);
            }
                $requiredFields = [
                    'domicilio' => 'El campo domicilio es requerido',
                    'localidad_id' => 'El campo localidad_id es requerido',
                    'cantidad_huespedes' => 'El campo cantidad_huespedes es requerido',
                    'fecha_inicio_disponibilidad' => 'El campo fecha_inicio_disponibilidad es requerido',
                    'cantidad_dias' => 'El campo cantidad_dias es requerido',
                    'disponible' => 'El campo disponible es requerido',
                    'valor_noche' => 'El campo valor_noche es requerido',
                    'tipo_propiedad_id' => 'El campo tipo_propiedad_id es requerido'
                ];
                foreach ($requiredFields as $field => $errorMessage) {
                    if (!isset($data[$field])) {
                        $vector['error ' .$field] = $errorMessage;
                    }
                }
                if($vector){
                    $response->getBody()->write(json_encode(['status'=>'error','code'=>400,'error'=>$vector]));
                    return $response->withHeader('Content-Type','application/json')->withStatus(400);
                }
                $consulta="";
                foreach($data as $key=>$values) {
                    if(isset($data[$key])){
                        $tipos[$key]=$values;
                    }
                }  
                $optionalFields=['cantidad_banios'=>null,'cantidad_habitaciones'=>null,'cochera'=>null,'imagen'=>null,'tipo_imagen'=>null];
                foreach($optionalFields as $key=>$values){
                    if(!isset($data[$key])){
                        $tipos[$key]=$values;
                    }
                }
                foreach($tipos as $key => $value) {
                        if($key!='id'){
                        $consulta .= $key . " = :" . $key . ", ";
                        }
                }
                $consulta = rtrim($consulta, ", ");
                $sql="SELECT * FROM localidades WHERE id = '".$tipos['localidad_id'] ."'";
                $query=$conexion->query($sql);
                $consulta_repetido = $query->fetch(PDO::FETCH_ASSOC);
                if(!($consulta_repetido)){
                   $vector['errorLocalidadExistente']='No hay una localidad relacionada a ese id';
                   $estado=400;
                }
                $sql="SELECT * FROM tipo_propiedades WHERE id ='".$tipos['tipo_propiedad_id'] ."'";
                $query=$conexion->query($sql);
                $consulta_repetido = $query->fetch(PDO::FETCH_ASSOC);
                if(!$consulta_repetido){
                    $vector['errorPropiedadExistente']='No hay un tipo de propiedad relacionada a ese id';
                    $estado=400;
                } 
                if($vector){
                    $response->getBody()->write(json_encode(['status'=>'error','code'=>400,'error'=>$vector]));
                    return $response->withHeader('Content-Type','application/json')->withStatus(400);
                }  
              else{ 
             $sql="UPDATE propiedades SET " .$consulta." WHERE id=:buscarId";  
             $query=$conexion->prepare($sql);
             $query->bindValue(':buscarId',$buscarId);
             $query->bindValue(':domicilio',$tipos['domicilio']);
             $query->bindValue(':localidad_id',$tipos['localidad_id']);
             $query->bindValue(':cantidad_habitaciones',$tipos['cantidad_habitaciones']);
             $query->bindValue(':cantidad_banios',$tipos['cantidad_banios']);
             $query->bindValue(':cochera',$tipos['cochera']);
             $query->bindValue(':cantidad_huespedes',$tipos['cantidad_huespedes']);
             $query->bindValue(':fecha_inicio_disponibilidad',$tipos['fecha_inicio_disponibilidad']);
             $query->bindValue(':cantidad_dias',$tipos['cantidad_dias']);
             $query->bindValue(':disponible',$tipos['disponible']);
             $query->bindValue(':valor_noche',$tipos['valor_noche']);
             $query->bindValue(':tipo_propiedad_id',$tipos['tipo_propiedad_id']);
             $query->bindValue(':imagen',$tipos['imagen']);
             $query->bindValue(':tipo_imagen',$tipos['tipo_imagen']);
             $query->execute();
             $response->getBody()->write(json_encode(['status'=>'error','code'=>201,'Actualizacion Exitosa'=>'Se ha realizado la actualizacion']));
             return $response->withHeader('Content-Type','application/json')->withStatus(201);   
            }
            }
        catch (PDOException $e){
              $payload=json_encode([
                'status' => 'error',
                'code' => 500,
                "error" => $e->getMessage()
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(500);
        } 
      
    });
    $app->delete('/propiedades/{id}',function(Request $request,Response $response,array $args ){
    $buscarId=$args['id'];
    $vector=array();
         try{
            $conexion = getConnection();
            $sql="SELECT * FROM propiedades WHERE id=$buscarId";
            $query=$conexion->query($sql);
            $tipos = $query->fetch(PDO::FETCH_ASSOC);
            if(!($tipos)){
                $vector['errorId']='No hay ninguna propiedad asociada a ese id';
                $estado=404;
            }
            $sql="SELECT * FROM reservas WHERE propiedad_id=$buscarId";
            $query=$conexion->query($sql);
            if($query->rowCount()>0){
                $vector['errorReserva']='Hay una reserva asociada a esta propiedad';
                $estado=400;
            }
            if(!$vector){
             $sql="DELETE FROM propiedades WHERE id=$buscarId";
             $query=$conexion->prepare($sql);
             $query->execute();
             $response->getBody()->write(json_encode(['code'=>204]));
             return $response->withHeader('Content-Type','application/json')->withStatus(204);
             } 
            else{
                $response->getBody()->write(json_encode(['status'=>'error','code'=>$estado,'error'=>$vector]));
                return $response->withHeader('Content-Type','application/json')->withStatus($estado);
            } 
            }
        catch (PDOException $e){
              $payload=json_encode([
                'status' => 'success',
                'code' => 500,
                'error' => $e->getMessage()
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(500);
        } 
    });
    $app->get('/reservas', function(Request $request,Response $response,){
        try{
            $connection = getConnection();
            $query = $connection->query('SELECT Res.*, Prop.domicilio AS Domicilio, Inq.apellido AS Apellido,Inq.nombre AS Nombre 
             FROM reservas Res, propiedades Prop, inquilinos Inq
             WHERE Res.propiedad_id=Prop.id and Res.inquilino_id=Inq.id');
            $tipos = $query->fetchAll(PDO::FETCH_ASSOC);
            $payload = json_encode([
                'status' => 'success',
                'code' => 200,
                'data' => $tipos
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(200);
        } catch(PDOException $e){
            $payload=json_encode([
                'status' => 'error',
                'code' => 400,
                'error'=>$e->getMessage()
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(400);
        } 
    }); 
    $app->post('/reservas',function(Request $request,Response $response,){
        $data=$request->getParsedBody();
        $vector=array();
        try{
        $requiredFields = ['propiedad_id' => 'El campo propiedad_id es requerido',
            'inquilino_id' => 'El campo inquilino_id es requerido',
            'fecha_desde' => 'El campo fecha_desde es requerido',
            'cantidad_noches' => 'El campo cantidad_noches es requerido'];
        foreach ($requiredFields as $field => $errorMessage) {
            if (!isset($data[$field])) {
                $vector['error ' .$field] = $errorMessage;
            }
        }
            $conexion = getConnection();
            if(isset($data['propiedad_id'])){
            $sql="SELECT Prop.valor_noche FROM propiedades Prop WHERE '".$data['propiedad_id'] ."'=Prop.id";
            $query=$conexion->query($sql);
            $valorNoche=$query->fetch(PDO::FETCH_ASSOC);
            if($valorNoche){
                $valor_total=$data['cantidad_noches'] * $valorNoche['valor_noche'];
            }
            $sql="SELECT * FROM propiedades WHERE id = '".$data['propiedad_id'] ."'";
            $query=$conexion->query($sql);
            $existe=$query->fetch(PDO::FETCH_ASSOC);
            if(!$existe){
               $vector['errorPropiedadInexistente']='No hay una propiedad asociada a ese id';
            }else{
                $sql="SELECT Prop.valor_noche FROM propiedades Prop WHERE '".$data['propiedad_id'] ."'=Prop.id";
                $query=$conexion->query($sql);
                $valorNoche=$query->fetch(PDO::FETCH_ASSOC);
                if($valorNoche){
                    $valor_total=$data['cantidad_noches'] * $valorNoche['valor_noche'];
                }    
            if(!($existe['disponible'])){
                $vector['errorPropiedadNoDisponible']='La propiedad no esta disponible';
            }
        }
      }       
           if(isset($data['inquilino_id'])){
            $sql="SELECT * FROM inquilinos WHERE id='".$data['inquilino_id'] ."'";
            $query=$conexion->query($sql);
            $existe=$query->fetch(PDO::FETCH_ASSOC);
            if(!$existe){
                $vector['errorInquilinoInexistente']='No hay un inquilino con ese id';
            } else{
            if(!($existe['activo'])){
                $vector['errorInquilinoNoActivo']='El inquilino no se encuentra activo';
            }
        }
    }
            if($vector){
             $response->getBody()->write(json_encode(['status'=>'error','code'=>400,'error'=>$vector]));   
            return $response->withHeader('Content-Type','application/json')->withStatus(400);
            }
            else{
             $sql="INSERT INTO reservas (propiedad_id,inquilino_id,fecha_desde,valor_total,cantidad_noches) VALUES (:propiedad_id,:inquilino_id,:fecha_desde,:valor_total,:cantidad_noches)";
             $query=$conexion->prepare($sql);
             $query->bindValue(':propiedad_id',$data['propiedad_id']);
             $query->bindValue(':inquilino_id',$data['inquilino_id']);
             $query->bindValue(':fecha_desde',$data['fecha_desde']);
             $query->bindValue(':valor_total',$valor_total);
             $query->bindValue(':cantidad_noches',$data['cantidad_noches']);
             $query->execute();
             $response->getBody()->write(json_encode(['status'=>'success','code'=>201,'Reserva Registrada'=>'Se completo el registro']));
             return $response->withHeader('Content-Type','application/json')->withStatus(201);
             } 
            }
        catch (PDOException $e){
              $payload=json_encode([
                'status' => 'error',
                'code' => 500,
                "error" => $e->getMessage()
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json')->withStatus(500);
        } 
      
    });
    $app->put('/reservas/{id}',function(Request $request,Response $response,array $args){
        $data=$request->getParsedBody();
        $vector=array();
        $buscarId=$args['id'];
        try{
            $conexion = getConnection();    
            $sql="SELECT * FROM reservas WHERE id = '".$buscarId ."'";
            $query = $conexion->query($sql);
            $tipos = $query->fetch(PDO::FETCH_ASSOC);
            if(!($tipos)){
              $response->getBody()->write(json_encode(['errorReservaInexistente'=>'No existe reserva asociada a ese ID']));
              return $response->withStatus(404);
            }
        $requiredFields = ['propiedad_id' => 'El campo propiedad_id es requerido',
            'inquilino_id' => 'El campo inquilino_id es requerido',
            'fecha_desde' => 'El campo fecha_desde es requerido',
            'cantidad_noches' => 'El campo cantidad_noches es requerido'];
        foreach ($requiredFields as $field => $errorMessage) {
            if (!isset($data[$field])) {
                $vector['error ' .$field] = $errorMessage;
            }
        }
           if($vector){
            $response->getBody()->write(json_encode(['status'=>'error','code'=>400,'errors'=>$vector]));
            return $response->withStatus(400);
           }
           else{
            $conexion = getConnection();
            $sql="SELECT * FROM propiedades WHERE id = '".$data['propiedad_id'] ."'";
            $query=$conexion->query($sql);
            $existe=$query->fetch(PDO::FETCH_ASSOC);
            if(!$existe){
               $vector['errorPropiedadInexistente']='No hay una propiedad asociada a ese id';
            }else{
                $sql="SELECT Prop.valor_noche FROM propiedades Prop WHERE '".$data['propiedad_id'] ."'=Prop.id";
                $query=$conexion->query($sql);
                $valorNoche=$query->fetch(PDO::FETCH_ASSOC);
                if($valorNoche){
                    $valor_total=$data['cantidad_noches'] * $valorNoche['valor_noche'];
                }    
            if(!($existe['disponible'])){
                $vector['errorPropiedadNoDisponible']='La propiedad no esta disponible';
            }
        }     
           if(isset($data['inquilino_id'])){
            $sql="SELECT * FROM inquilinos WHERE id='".$data['inquilino_id'] ."'";
            $query=$conexion->query($sql);
            $existe=$query->fetch(PDO::FETCH_ASSOC);
            if(!$existe){
                $vector['errorInquilinoInexistente']='No hay un inquilino con ese id';
            } else{
            if(!($existe['activo'])){
                $vector['errorInquilinoNoActivo']='El inquilino no se encuentra activo';
            }
        }
            $fecha=date("Y-m-d");
            if($tipos['fecha_desde']<=$fecha){
                $vector['errorFecha']='La reserva se encuentra en progreso';
            }   
            if($vector){
                $response->getBody()->write(json_encode(['status'=>'error','code'=>400,'error'=>$vector]));   
               return $response->withHeader('Content-Type','application/json')->withStatus(400);
               }
           else{
            foreach($data as $key=>$value){
                if(isset($data[$key])){
                    $tipos[$key]=$value;
                }
            }
            $sql="UPDATE reservas SET inquilino_id=:inquilino_id,propiedad_id=:propiedad_id,fecha_desde=:fecha_desde,cantidad_noches=:cantidad_noches,valor_total=:valor_total WHERE id=$buscarId";
            $query=$conexion->prepare($sql);
            $query->bindValue(':inquilino_id',$tipos['inquilino_id']);
            $query->bindValue(':propiedad_id',$tipos['propiedad_id']);
            $query->bindValue(':fecha_desde',$tipos['fecha_desde']);
            $query->bindValue(':cantidad_noches',$tipos['cantidad_noches']);
            $query->bindValue(':valor_total',$valor_total);
            $query->execute();
            $response->getBody()->write(json_encode(['status'=>'success','code'=>201,'Actualizacion Exitosa'=>'Se ha realizado la actualizacion']));
            return $response->withHeader('Content-Type','application/json')->withStatus(201);
            } 
           }
        }
    }
       catch (PDOException $e){
             $payload=json_encode([
               'status' => 'error',
               'code' => 500,
               "error" => $e->getMessage()
           ]);
           $response->getBody()->write($payload);
           return $response->withHeader('Content-Type','application/json')->withStatus(500);
       } 
    
    });
    $app->delete('/reservas/{id}',function(Request $request,Response $response,array $args){
        $buscarId=$args['id'];
        $vector=array();
             try{
                $conexion = getConnection();
                $sql="SELECT * FROM reservas WHERE id=$buscarId";
                $query=$conexion->query($sql);
                $tipos = $query->fetch(PDO::FETCH_ASSOC);
                if(!($tipos)){
                    $vector['errorId']='No hay ninguna reserva asociada a ese id';
                    $estado=404;
                }
                else{ $fecha=date("Y-m-d");
                    if($tipos['fecha_desde']<=$fecha){
                        $vector['errorFecha']="La reserva no puede eliminarse porque se encuentra en curso";
                        $estado=400;
                    }
                }    
                if(!$vector){
                 $sql="DELETE FROM reservas WHERE id=$buscarId";
                 $query=$conexion->prepare($sql);
                 $query->execute();
                 return $response->withHeader('Content-Type','application/json')->withStatus(204);
                 } 
                else{
                    $response->getBody()->write(json_encode(['status'=>'error','code'=>$estado,'error'=>$vector]));
                    return $response->withHeader('Content-Type','application/json')->withStatus($estado);
                } 
                }
            catch (PDOException $e){
                  $payload=json_encode([
                    'status' => 'success',
                    'code' => 500,
                    'error' => $e->getMessage()
                ]);
                $response->getBody()->write($payload);
                return $response->withHeader('Content-Type','application/json')->withStatus(500);
            } 
    });       
    $app->run();