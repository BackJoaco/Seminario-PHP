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

$app->get('/HelloWorld', function(Request $request,Response $response,$args){
$response->getBody()->write("Hello world");
return $response;
});

$app->get('/localidades/listar', function(Request $request, Response $response){
    try{
        $connection=getConnection();
        $query= $connection->query('SELECT * FROM localidades');
        $tipos = $query->fetchAll(PDO::FETCH_ASSOC);

        $payload=json_encode([
            'status' => 'success',
            'code' => 200,
            'data' => $tipos
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json');
    } catch(PDOException $e) {
        $payload=json_encode([
            'status' => 'error',
            'code' => 400,
            'data' => $e,
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json');
    }
});

$app->post('/localidades/crear', function(Request $request, Response $response){
    $data=$request->getParsedBody();
    if(!isset($data['nombre'])){
        $response->getBody()->write(json_encode(['error'=>'El campo nombre es requerido']));
        return $response->withStatus(400);
    } else {
        try {
            $conexion = getConnection();
            $nombre = $data['nombre'];
            $sql="SELECT * FROM localidades WHERE nombre = '".$nombre ."'";
            $consulta_repetido = $conexion->query($sql);
            if($consulta_repetido->fetchAll()){
                $response->getBody()->write(json_encode(['error'=>'El campo no puede repetirse']));
                return $response->withStatus(400);
            } else {
                $sql="INSERT INTO localidades (nombre) VALUES (:nombre)";
                $query=$conexion->prepare($sql);
                $query->bindValue(':nombre',$nombre);
                $query->execute();
                $response->getBody()->write(json_encode(['Se completo el registro']));
                return $response->withStatus(201);
            }
        } catch (PDOException $e){
            $payload=json_encode([
                'status' => 'success',
                'code' => 500,
                "error" => $e
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json');   
        }
    }
});

$app->put('/localidades/{id}/editar', function(Request $request, Response $response, $args){
    $localidad_id = $args['id'];
    $data = $request->getParsedBody();

    if(!isset($data['nombre'])) {
        $response->getBody()->write(json_encode(['error'=>'El campo nombre es requerido']));
        return $response->withStatus(400);
    }

    try {
        $conexion = getConnection();
        $nombre = $data['nombre'];

        // Verificar si la localidad existe
        $sql_existencia = "SELECT * FROM localidades WHERE id = :id";
        $query_existencia = $conexion->prepare($sql_existencia);
        $query_existencia->bindParam(':id', $localidad_id);
        $query_existencia->execute();
        $localidad_existente = $query_existencia->fetch();

        if (!$localidad_existente) {
            $response->getBody()->write(json_encode(['error'=>'La localidad no existe']));
            return $response->withStatus(404);
        }

        // Actualizar el nombre de la localidad
        $sql_actualizacion = "UPDATE localidades SET nombre = :nombre WHERE id = :id";
        $query_actualizacion = $conexion->prepare($sql_actualizacion);
        $query_actualizacion->bindParam(':nombre', $nombre);
        $query_actualizacion->bindParam(':id', $localidad_id);
        $query_actualizacion->execute();

        $response->getBody()->write(json_encode(['mensaje' => 'Localidad actualizada correctamente']));
        return $response->withStatus(200);

    } catch (PDOException $e){
        $payload = json_encode([
            'status' => 'error',
            'code' => 500,
            "error" => $e->getMessage()
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json')->withStatus(500);   
    }
});

$app->delete('/localidades/{id}/eliminar', function(Request $request, Response $response, $args){
    $localidad_id = $args['id'];

    try {
        $conexion = getConnection();

        // Verificar si la localidad existe
        $sql_existencia = "SELECT COUNT(*) AS cantidad FROM localidades WHERE id = :id";
        $query_existencia = $conexion->prepare($sql_existencia);
        $query_existencia->bindParam(':id', $localidad_id);
        $query_existencia->execute();
        $resultado_existencia = $query_existencia->fetch();

        if ($resultado_existencia['cantidad'] == 0) {
            $response->getBody()->write(json_encode(['error'=>'La localidad no existe']));
            return $response->withStatus(404);
        }

        // Verificar si la localidad está siendo utilizada en otra tabla
        $sql_uso = "SELECT COUNT(*) AS cantidad_usos FROM propiedades WHERE localidad_id = :localidad_id";
        $query_uso = $conexion->prepare($sql_uso);
        $query_uso->bindParam(':localidad_id', $localidad_id);
        $query_uso->execute();
        $resultado_uso = $query_uso->fetch();

        if ($resultado_uso['cantidad_usos'] > 0) {
            $response->getBody()->write(json_encode(['error'=>'La localidad está siendo utilizada en una propiedad y no se puede eliminar']));
            return $response->withStatus(400);
        }

        // Eliminar la localidad
        $sql_eliminar = "DELETE FROM localidades WHERE id = :id";
        $query_eliminar = $conexion->prepare($sql_eliminar);
        $query_eliminar->bindParam(':id', $localidad_id);
        $query_eliminar->execute();

        $response->getBody()->write(json_encode(['mensaje' => 'Localidad eliminada correctamente']));
        return $response->withStatus(200);

    } catch (PDOException $e){
        $payload = json_encode([
            'status' => 'error',
            'code' => 500,
            "error" => $e->getMessage()
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json')->withStatus(500);   
    }
});

$app->get('/tipos_propiedad/listar', function(Request $request, Response $response){
    try {
        $connection=getConnection();
        $query= $connection->query('SELECT * FROM tipo_propiedades');
        $tipos = $query->fetchAll(PDO::FETCH_ASSOC);

        $payload=json_encode([
            'status' => 'success',
            'code' => 200,
            'data' => $tipos
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json');
    } catch(PDOException $e) {
        $payload=json_encode([
            'status' => 'error',
            'code' => 400,
            'data' => $e,
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json');
    }
});

$app->post('/tipos_propiedad/crear',function(Request $request,Response $response){
    $data=$request->getParsedBody();
    if(!isset($data['nombre'])){
        $response->getBody()->write(json_encode(['error'=>'El campo nombre es requerido']));
        return $response->withStatus(400);
    }else {
     try{
        $conexion = getConnection();
        $nombre = $data['nombre'];

        $sql="SELECT * FROM tipo_propiedades WHERE nombre = '".$nombre ."'";
        $consulta_repetido=$conexion->query($sql);
        if($consulta_repetido->fetchAll()){
           $response->getBody()->write(json_encode(['error'=>'El campo no puede repetirse']));
           return $response->withStatus(400);
        }else{
         $sql="INSERT INTO tipo_propiedades (nombre) VALUES (:nombre)";
         $query=$conexion->prepare($sql);
         $query->bindValue(':nombre',$nombre);
         $query->execute();
         $response->getBody()->write(json_encode(['Se completo el registro']));
         return $response->withStatus(201);
         } 
        }
    catch (PDOException $e){
          $payload=json_encode([
            'status' => 'success',
            'code' => 500,
            "error" => $e
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json');
    } 
  }
});

$app->put('/tipos_propiedad/{id}/editar', function(Request $request, Response $response, $args){
    $tipo_propiedad_id = $args['id'];
    $data = $request->getParsedBody();

    if(!isset($data['nombre'])) {
        $response->getBody()->write(json_encode(['error'=>'El campo nombre es requerido']));
        return $response->withStatus(400);
    }

    try {
        $conexion = getConnection();
        $nombre = $data['nombre'];

        // Verificar si el tipo de propiedad existe
        $sql_existencia = "SELECT * FROM tipo_propiedades WHERE id = :id";
        $query_existencia = $conexion->prepare($sql_existencia);
        $query_existencia->bindParam(':id', $tipo_propiedad_id);
        $query_existencia->execute();
        $tipo_existente = $query_existencia->fetch();

        if (!$tipo_existente) {
            $response->getBody()->write(json_encode(['error'=>'El tipo de propiedad no existe']));
            return $response->withStatus(404);
        }

        // Actualizar el nombre del tipo de propiedad
        $sql_actualizacion = "UPDATE tipo_propiedades SET nombre = :nombre WHERE id = :id";
        $query_actualizacion = $conexion->prepare($sql_actualizacion);
        $query_actualizacion->bindParam(':nombre', $nombre);
        $query_actualizacion->bindParam(':id', $tipo_propiedad_id);
        $query_actualizacion->execute();

        $response->getBody()->write(json_encode(['mensaje' => 'Tipo de propiedad actualizada correctamente']));
        return $response->withStatus(200);

    } catch (PDOException $e){
        $payload = json_encode([
            'status' => 'error',
            'code' => 500,
            "error" => $e->getMessage()
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json')->withStatus(500);   
    }
});

$app->delete('/tipos_propiedad/{id}/eliminar', function(Request $request, Response $response, $args){
    $tipo_propiedad_id = $args['id'];

    try {
        $conexion = getConnection();

        // Verificar si el tipo de propiedad existe
        $sql_existencia = "SELECT COUNT(*) AS cantidad FROM tipo_propiedades WHERE id = :id";
        $query_existencia = $conexion->prepare($sql_existencia);
        $query_existencia->bindParam(':id', $tipo_propiedad_id);
        $query_existencia->execute();
        $resultado_existencia = $query_existencia->fetch();

        if ($resultado_existencia['cantidad'] == 0) {
            $response->getBody()->write(json_encode(['error'=>'El tipo de propiedad no existe']));
            return $response->withStatus(404);
        }

        // Verificar si el tipo de propiedad está siendo utilizada en otra tabla
        $sql_uso = "SELECT COUNT(*) AS cantidad_usos FROM propiedades WHERE tipo_propiedad_id = :tipo_propiedad_id";
        $query_uso = $conexion->prepare($sql_uso);
        $query_uso->bindParam(':tipo_propiedad_id', $tipo_propiedad_id);
        $query_uso->execute();
        $resultado_uso = $query_uso->fetch();

        if ($resultado_uso['cantidad_usos'] > 0) {
            $response->getBody()->write(json_encode(['error'=>'El tipo de propiedad está siendo utilizado en una propiedad y no se puede eliminar']));
            return $response->withStatus(400);
        }

        // Eliminar el tipo de propiedad
        $sql_eliminar = "DELETE FROM tipo_propiedades WHERE id = :id";
        $query_eliminar = $conexion->prepare($sql_eliminar);
        $query_eliminar->bindParam(':id', $tipo_propiedad_id);
        $query_eliminar->execute();

        $response->getBody()->write(json_encode(['mensaje' => 'Tipo de propiedad eliminada correctamente']));
        return $response->withStatus(200);

    } catch (PDOException $e){
        $payload = json_encode([
            'status' => 'error',
            'code' => 500,
            "error" => $e->getMessage()
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json')->withStatus(500);   
    }
});

$app->get('/inquilinos/listar', function(Request $request, Response $response){
    try {
        $connection=getConnection();
        $query= $connection->query('SELECT * FROM inquilinos');
        $tipos = $query->fetchAll(PDO::FETCH_ASSOC);

        $payload=json_encode([
            'status' => 'success',
            'code' => 200,
            'data' => $tipos
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json');
    } catch(PDOException $e) {
        $payload=json_encode([
            'status' => 'error',
            'code' => 400,
            'data' => $e,
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json');
    }
});

$app->get('/inquilinos/{id}/listar', function(Request $request, Response $response, $args){
    $inquilino_id = $args['id'];
    try {
        $conexion = getConnection();
        // Consultar el inquilino especificado por su id
        $sql = "SELECT * FROM inquilinos WHERE id = :id";
        $query = $conexion->prepare($sql);
        $query->bindParam(':id', $inquilino_id);
        $query->execute();
        $inquilino = $query->fetch(PDO::FETCH_ASSOC);

        // Verificar si el inquilino se encuentra
        if (!$inquilino){
            $response->getBody()->write(json_encode(['error'=>'Inquilino no encontrado']));
            return $response->withStatus(404);
        }

        // Devolver el inquilino
        $response->getBody()->write(json_encode($inquilino));
        return $response->withStatus(200);

    } catch (PDOException $e) {
        $payload = json_encode([
            'status' => 'error',
            'code' => 500,
            "error" => $e->getMessage()
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json')->withStatus(500);
    }
});

$app->get('/inquilinos/{idInquilino}/reservas', function(Request $request, Response $response, $args){
    $inquilino_id = $args['id'];
    try {
        $conexion = getConnection();
        // consultar si existe el inquilino
        $sql_existencia = "SELECT COUNT(*) as cantidad FROM inquilinos WHERE id = :id";
        $query_existencia = $conexion->prepare($sql);
        $query_existencia->bindParam(':id', $inquilino_id);
        $query_existencia->execute();
        $resultado_existencia = $query_existencia->fetch();

        if ($resultado_existencia['cantidad'] == 0){
            $response->getBody()->write(json_encode(['error'=>'El inquilino no existe']));
            return $response-withStatus(404);
        }
        
        $sql = "SELECT * FROM reservas WHERE inquilino_id = :inquilino_id";
        $query = $conexion->prepare($sql);
        $query->bindParam(':inquilino_id', $inquilino_id);
        $query->execute();
        $reservas = $query->fetchAll(PDO::FETCH_ASSOC);
        
        // Verifico que el inquilino tenga reservas
        if(!$reservas) {
            $response->getBody()->write(json_encode(['error'=>'El inquilino no posee reservas a su nombre']));
            return $response->withStatus(404);
        }

        $response->getBody()->write(json_encode($reservas));
        return $response->withStatus(200);
    } catch (PDOException $e) {
        $payload = json_encode([
            'status' => 'error',
            'code' => 500,
            "error" => $e->getMessage()
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json')-withStatus(500);
    }
});

$app->post('/inquilinos/crear', function(Request $request, Response $response){
    $data=$request->getParsedBody();
    if(!(isset($data['apellido']) && isset($data['nombre']) && isset($data['documento']) && isset($data['email']) && isset($data['activo']))){
        $response->getBody()->write(json_encode(['error'=>'Todos los campos son requeridos']));
        return $response->withStatus(400);
    } else {
        try {
            $conexion = getConnection();
            $apellido = $data['apellido'];
            $nombre = $data['nombre'];
            $documento = $data['documento'];
            $email = $data['email'];
            $activo = $data['activo'];
            $sql="SELECT * FROM inquilinos WHERE documento = '".$documento ."'";
            $consulta_repetido = $conexion->query($sql);
            if($consulta_repetido->fetchAll()){
                $response->getBody()->write(json_encode(['error'=>'El campo no puede repetirse']));
                return $response->withStatus(400);
            } else {
                $sql="INSERT INTO inquilinos (apellido, nombre, documento, email, activo) VALUES (:apellido, :nombre, :documento, :email, :activo)";
                $query=$conexion->prepare($sql);
                $query->bindValue(':apellido',$apellido);
                $query->bindValue(':nombre',$nombre);
                $query->bindValue(':documento',$documento);
                $query->bindValue(':email',$email);
                $query->bindValue(':activo',$activo);
                $query->execute();
                $response->getBody()->write(json_encode(['Se completo el registro']));
                return $response->withStatus(201);
            }
        } catch (PDOException $e){
            $payload=json_encode([
                'status' => 'success',
                'code' => 500,
                "error" => $e
            ]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type','application/json');   
        }
    }
});

$app->put('/inquilinos/{id}/editar', function(Request $request, Response $response, $args){
    $inquilinos_id = $args['id'];
    $data = $request->getParsedBody();

    // Comprobar si se proporcionaron datos para actualizar
    if(empty($data)) {
        $response->getBody()->write(json_encode(['error'=>'No se proporcionaron datos para actualizar']));
        return $response->withStatus(400);
    }

    try {
        $conexion = getConnection();

        // Construir la consulta de actualización
        $sql_actualizacion = "UPDATE inquilinos SET ";
        $campos_actualizados = [];
        foreach($data as $campo => $valor) {
            $campos_actualizados[] = "$campo = :$campo";
        }
        $sql_actualizacion .= implode(", ", $campos_actualizados);
        $sql_actualizacion .= " WHERE id = :id";

        // Preparar la consulta
        $query_actualizacion = $conexion->prepare($sql_actualizacion);
        
        // Asignar los valores de los campos a actualizar
        foreach($data as $campo => $valor) {
            $query_actualizacion->bindValue(":$campo", $valor);
        }
        $query_actualizacion->bindParam(':id', $inquilinos_id);

        // Ejecutar la consulta
        $query_actualizacion->execute();

        $response->getBody()->write(json_encode(['mensaje' => 'Inquilino actualizado correctamente']));
        return $response->withStatus(200);

    } catch (PDOException $e){
        $payload = json_encode([
            'status' => 'error',
            'code' => 500,
            "error" => $e->getMessage()
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json')->withStatus(500);   
    }
});

$app->delete('/inquilinos/{id}/eliminar', function(Request $request, Response $response, $args){
    $inquilino_id = $args['id'];
    try {
        $conexion = getConnection();

        // Verificar si el inquilino existe
        $sql_existencia = "SELECT COUNT(*) AS cantidad FROM inquilinos WHERE id = :id";
        $query_existencia = $conexion->prepare($sql_existencia);
        $query_existencia->bindParam(':id', $inquilino_id);
        $query_existencia->execute();
        $resultado_existencia = $query_existencia->fetch();

        if ($resultado_existencia['cantidad'] == 0) {
            $response->getBody()->write(json_encode(['error'=>'El inquilino no existe']));
            return $response->withStatus(404);
        }

        // Verificar si el inquilino está siendo utilizado en otra tabla
        $sql_uso = "SELECT COUNT(*) AS cantidad_usos FROM reservas WHERE inquilino_id = :inquilino_id";
        $query_uso = $conexion->prepare($sql_uso);
        $query_uso->bindParam(':inquilino_id', $inquilino_id);
        $query_uso->execute();
        $resultado_uso = $query_uso->fetch();

        if ($resultado_uso['cantidad_usos'] > 0) {
            $response->getBody()->write(json_encode(['error'=>'El inquilino está siendo utilizado en una reserva y no se puede eliminar']));
            return $response->withStatus(400);
        }

        // Eliminar el inquilino
        $sql_eliminar = "DELETE FROM inquilinos WHERE id = :id";
        $query_eliminar = $conexion->prepare($sql_eliminar);
        $query_eliminar->bindParam(':id', $inquilino_id);
        $query_eliminar->execute();

        $response->getBody()->write(json_encode(['mensaje' => 'Inquilino eliminado correctamente']));
        return $response->withStatus(200);

    } catch (PDOException $e){
        $payload = json_encode([
            'status' => 'error',
            'code' => 500,
            "error" => $e->getMessage()
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json')->withStatus(500);   
    }
});

$app->get('/propiedades/listar', function(Request $request, Response $response){
    try {
        $connection=getConnection();
        $query= $connection->query('SELECT Prop.*, Loc.nombre as Localidad, Tipo.nombre as Tipo 
        FROM propiedades Prop, tipo_propiedades Tipo, localidades Loc
        WHERE Prop.localidad_id = Loc.id and Prop.tipo_propiedad_id = Tipo.id');
        $tipos = $query->fetchAll(PDO::FETCH_ASSOC);
        $payload=json_encode([
            'status' => 'success',
            'code' => 200,
            'data' => $tipos
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json');
    } catch(PDOException $e) {
        $payload=json_encode([
            'status' => 'error',
            'code' => 400,
            'data' => $e,
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json');
    }
});

$app->get('/propiedades/{id}/listar', function(Request $request, Response $response, $args){
    $propiedad_id = $args['id'];
    try {
        $conexion = getConnection();
        
        // Consultar la propiedad específica por su ID
        $sql = "SELECT * FROM propiedades WHERE id = :id";
        $query = $conexion->prepare($sql);
        $query->bindParam(':id', $propiedad_id);
        $query->execute();
        $propiedad = $query->fetch(PDO::FETCH_ASSOC);

        // Verificar si se encontró la propiedad
        if (!$propiedad) {
            $response->getBody()->write(json_encode(['error'=>'Propiedad no encontrada']));
            return $response->withStatus(404);
        }

        // Devolver la propiedad encontrada
        $response->getBody()->write(json_encode($propiedad));
        return $response->withStatus(200);
        
    } catch (PDOException $e){
        $payload=json_encode([
            'status' => 'error',
            'code' => 500,
            "error" => $e->getMessage()
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json')->withStatus(500);   
    }
});

$app->post('/propiedades/crear', function(Request $request, Response $response){
    $data = $request->getParsedBody();
    
    // Verificar campos obligatorios
    $campos_obligatorios = ['domicilio', 'localidad_id', 'cantidad_huespedes', 'fecha_inicio_disponibilidad', 'cantidad_dias', 'disponible', 'valor_noche', 'tipo_propiedad_id'];
    foreach ($campos_obligatorios as $campo) {
        if (!isset($data[$campo])) {
            $response->getBody()->write(json_encode(['error'=>'Falta el campo requerido: ' . $campo]));
            return $response->withStatus(400);
        }
    }

    try {
        $conexion = getConnection();
        $sql = "SELECT * FROM propiedades WHERE domicilio = :domicilio";
        $consulta_repetido = $conexion->prepare($sql);
        $consulta_repetido->bindValue(':domicilio', $data['domicilio']);
        $consulta_repetido->execute();

        if($consulta_repetido->fetch()) {
            $response->getBody()->write(json_encode(['error'=>'La propiedad no puede repetirse']));
            return $response->withStatus(400);
        } else {
            // Construir la consulta de inserción
            $sql_insert = "INSERT INTO propiedades (domicilio, localidad_id, cantidad_habitaciones, cantidad_banios, cochera, cantidad_huespedes, fecha_inicio_disponibilidad, cantidad_dias, disponible, valor_noche, tipo_propiedad_id, imagen, tipo_imagen) VALUES (:domicilio, :localidad_id, :cantidad_habitaciones, :cantidad_banios, :cochera, :cantidad_huespedes, :fecha_inicio_disponibilidad, :cantidad_dias, :disponible, :valor_noche, :tipo_propiedad_id, :imagen, :tipo_imagen)";
            $query_insert = $conexion->prepare($sql_insert);

            // Asignar valores a los campos presentes en la solicitud
            foreach ($data as $campo => $valor) {
                if (in_array($campo, $campos_obligatorios) || $campo == 'imagen' || $campo == 'tipo_imagen') {
                    $query_insert->bindValue(":$campo", $valor);
                }
            }

            // Ejecutar la consulta
            $query_insert->execute();

            $response->getBody()->write(json_encode(['mensaje' => 'Se completó el registro']));
            return $response->withStatus(201);
        }
    } catch (PDOException $e){
        $payload=json_encode([
            'status' => 'success',
            'code' => 500,
            "error" => $e->getMessage()
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json')->withStatus(500);   
    }
});

$app->put('/propiedades/{id}/editar', function(Request $request, Response $response, $args){
    $propiedades_id = $args['id'];
    $data = $request->getParsedBody();

    // Comprobar si se proporcionaron datos para actualizar
    if(empty($data)) {
        $response->getBody()->write(json_encode(['error'=>'No se proporcionaron datos para actualizar']));
        return $response->withStatus(400);
    }

    try {
        $conexion = getConnection();

        // Construir la consulta de actualización
        $sql_actualizacion = "UPDATE propiedades SET ";
        $campos_actualizados = [];
        foreach($data as $campo => $valor) {
            $campos_actualizados[] = "$campo = :$campo";
        }
        $sql_actualizacion .= implode(", ", $campos_actualizados);
        $sql_actualizacion .= " WHERE id = :id";

        // Preparar la consulta
        $query_actualizacion = $conexion->prepare($sql_actualizacion);
        
        // Asignar los valores de los campos a actualizar
        foreach($data as $campo => $valor) {
            $query_actualizacion->bindValue(":$campo", $valor);
        }
        $query_actualizacion->bindParam(':id', $propiedades_id);

        // Ejecutar la consulta
        $query_actualizacion->execute();

        $response->getBody()->write(json_encode(['mensaje' => 'Propiedad actualizada correctamente']));
        return $response->withStatus(200);

    } catch (PDOException $e){
        $payload = json_encode([
            'status' => 'error',
            'code' => 500,
            "error" => $e->getMessage()
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json')->withStatus(500);   
    }
});

$app->delete('/propiedades/{id}/eliminar', function(Request $request, Response $response, $args){
    $propiedad_id = $args['id'];
    try {
        $conexion = getConnection();

        // Verificar si la propiedad existe
        $sql_existencia = "SELECT COUNT(*) AS cantidad FROM propiedades WHERE id = :id";
        $query_existencia = $conexion->prepare($sql_existencia);
        $query_existencia->bindParam(':id', $propiedad_id);
        $query_existencia->execute();
        $resultado_existencia = $query_existencia->fetch();

        if ($resultado_existencia['cantidad'] == 0) {
            $response->getBody()->write(json_encode(['error'=>'La propiedad no existe']));
            return $response->withStatus(404);
        }

        // Verificar si la propiedad está siendo utilizado en otra tabla
        $sql_uso = "SELECT COUNT(*) AS cantidad_usos FROM reservas WHERE propiedad_id = :propiedad_id";
        $query_uso = $conexion->prepare($sql_uso);
        $query_uso->bindParam(':propiedad_id', $propiedad_id);
        $query_uso->execute();
        $resultado_uso = $query_uso->fetch();

        if ($resultado_uso['cantidad_usos'] > 0) {
            $response->getBody()->write(json_encode(['error'=>'La propiedad está siendo utilizado en una reserva y no se puede eliminar']));
            return $response->withStatus(400);
        }

        // Eliminar la propiedad
        $sql_eliminar = "DELETE FROM propiedades WHERE id = :id";
        $query_eliminar = $conexion->prepare($sql_eliminar);
        $query_eliminar->bindParam(':id', $propiedad_id);
        $query_eliminar->execute();

        $response->getBody()->write(json_encode(['mensaje' => 'Propiedad eliminada correctamente']));
        return $response->withStatus(200);

    } catch (PDOException $e){
        $payload = json_encode([
            'status' => 'error',
            'code' => 500,
            "error" => $e->getMessage()
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json')->withStatus(500);   
    }
});

$app->get('/reservas/listar', function(Request $request, Response $response){
    try {
        $connection = getConnection();
        $query= $connection->query('SELECT Res.id, Res.fecha_desde, Res.cantidad_noches, Res.valor_total, Prop.domicilio as Domicilio, Inq.apellido as Apellido, Inq.nombre as Nombre
        FROM reservas Res, propiedades Prop, inquilinos Inq
        WHERE Res.propiedad_id = Prop.id and Res.inquilino_id = Inq.id');
        $tipos = $query->fetchAll(PDO::FETCH_ASSOC);
        $payload = json_encode([
            'status' => 'success',
            'code' => 200,
            'data' => $tipos
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json');
    } catch(PDOException $e){
        $payload=json_encode([
            'status' => 'error',
            'code' => 400,
            'data' => $e,
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json');
    }
});

$app->post('/reservas/crear', function(Request $request, Response $response){
    $data = $request->getParsedBody();
    if(!(isset($data['propiedad_id']) && isset($data['inquilino_id']) && isset($data['fecha_desde']) && isset($data['cantidad_noches']))){
        $response->getBody()->write(json_encode(['error'=>'Todos los campos son requeridos']));
        return $response->withStatus(400);
    } else {
        try {
            $conexion = getConnection();
            $propiedad_id = $data['propiedad_id'];
            $inquilino_id = $data['inquilino_id'];
            $fecha_desde = $data['fecha_desde'];
            $cantidad_noches = $data['cantidad_noches'];

            // Verificar si la propiedad está disponible para las fechas especificadas
            $sql_propiedad_disponible = "SELECT * FROM reservas WHERE propiedad_id = :propiedad_id AND fecha_desde <= :fecha_desde AND DATE_ADD(fecha_desde, INTERVAL cantidad_noches DAY) >= :fecha_desde";
            $query_propiedad_disponible = $conexion->prepare($sql_propiedad_disponible);
            $query_propiedad_disponible->bindParam(':propiedad_id', $propiedad_id);
            $query_propiedad_disponible->bindParam(':fecha_desde', $fecha_desde);
            $query_propiedad_disponible->execute();
            $reservas_existente = $query_propiedad_disponible->fetchAll();

            if (!empty($reservas_existente)) {
                $response->getBody()->write(json_encode(['error'=>'La propiedad no está disponible para las fechas especificadas']));
                return $response->withStatus(400);
            }

            // Verificar si el inquilino está activo
            $sql_inquilino_activo = "SELECT * FROM inquilinos WHERE id = :inquilino_id AND activo = 1";
            $query_inquilino_activo = $conexion->prepare($sql_inquilino_activo);
            $query_inquilino_activo->bindParam(':inquilino_id', $inquilino_id);
            $query_inquilino_activo->execute();
            $inquilino_activo = $query_inquilino_activo->fetch();

            if (empty($inquilino_activo)) {
                $response->getBody()->write(json_encode(['error'=>'El inquilino no está activo']));
                return $response->withStatus(400);
            }

            // Consultar el valor de la noche de la propiedad
            $sql_propiedad = "SELECT valor_noche FROM propiedades WHERE id = :propiedad_id";
            $query_propiedad = $conexion->prepare($sql_propiedad);
            $query_propiedad->bindParam(':propiedad_id', $propiedad_id);
            $query_propiedad->execute();
            $valor_noche = $query_propiedad->fetchColumn();

            // Calcular el valor total de la reserva
            $valor_total = $valor_noche * $cantidad_noches;

            // Insertar la reserva
            $sql_insertar_reserva = "INSERT INTO reservas (propiedad_id, inquilino_id, fecha_desde, cantidad_noches, valor_total) VALUES (:propiedad_id, :inquilino_id, :fecha_desde, :cantidad_noches, :valor_total)";
            $query_insertar_reserva = $conexion->prepare($sql_insertar_reserva);
            $query_insertar_reserva->bindValue(':propiedad_id', $propiedad_id);
            $query_insertar_reserva->bindValue(':inquilino_id', $inquilino_id);
            $query_insertar_reserva->bindValue(':fecha_desde', $fecha_desde);
            $query_insertar_reserva->bindValue(':cantidad_noches', $cantidad_noches);
            $query_insertar_reserva->bindValue(':valor_total', $valor_total);
            $query_insertar_reserva->execute();
            
            $response->getBody()->write(json_encode(['mensaje' => 'Se completó el registro']));
            return $response->withStatus(201);
            
        } catch (PDOException $e){
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

$app->put('/reservas/{id}/editar', function(Request $request, Response $response, $args){
    $reserva_id = $args['id'];
    $data = $request->getParsedBody();

    // Comprobar si se proporcionaron datos para actualizar
    if(empty($data)) {
        $response->getBody()->write(json_encode(['error'=>'No se proporcionaron datos para actualizar']));
        return $response->withStatus(400);
    }

    try {
        $conexion = getConnection();

        // Verificar si la reserva existe y obtener su fecha de inicio
        $sql_existencia = "SELECT fecha_desde FROM reservas WHERE id = :id";
        $query_existencia = $conexion->prepare($sql_existencia);
        $query_existencia->bindParam(':id', $reserva_id);
        $query_existencia->execute();
        $reserva = $query_existencia->fetch();

        if (!$reserva) {
            $response->getBody()->write(json_encode(['error'=>'La reserva no existe']));
            return $response->withStatus(404);
        }

        $fecha_desde = $reserva['fecha_desde'];

        // Verificar si la reserva ya comenzó
        $fecha_actual = date('Y-m-d'); // Obtener la fecha actual
        if ($fecha_desde <= $fecha_actual) {
            $response->getBody()->write(json_encode(['error'=>'La reserva ya comenzó, no se puede modificar']));
            return $response->withStatus(400);
        }

        // Construir la consulta de actualización
        $sql_actualizacion = "UPDATE reservas SET ";
        $campos_actualizados = [];
        foreach($data as $campo => $valor) {
            $campos_actualizados[] = "$campo = :$campo";
        }
        $sql_actualizacion .= implode(", ", $campos_actualizados);
        $sql_actualizacion .= " WHERE id = :id";

        // Preparar la consulta
        $query_actualizacion = $conexion->prepare($sql_actualizacion);
        
        // Asignar los valores de los campos a actualizar
        foreach($data as $campo => $valor) {
            $query_actualizacion->bindValue(":$campo", $valor);
        }
        $query_actualizacion->bindParam(':id', $reserva_id);

        // Ejecutar la consulta
        $query_actualizacion->execute();

        $response->getBody()->write(json_encode(['mensaje' => 'Reserva actualizada correctamente']));
        return $response->withStatus(200);

    } catch (PDOException $e){
        $payload = json_encode([
            'status' => 'error',
            'code' => 500,
            "error" => $e->getMessage()
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json')->withStatus(500);   
    }
});

$app->delete('/reservas/{id}', function(Request $request, Response $response, $args){
    $reserva_id = $args['id'];

    try {
        $conexion = getConnection();

        // Verificar si la reserva existe
        $sql_existencia = "SELECT COUNT(*) AS cantidad FROM reservas WHERE id = :id";
        $query_existencia = $conexion->prepare($sql_existencia);
        $query_existencia->bindParam(':id', $reserva_id);
        $query_existencia->execute();
        $resultado_existencia = $query_existencia->fetch();

        if ($resultado_existencia['cantidad'] == 0) {
            $response->getBody()->write(json_encode(['error'=>'La reserva no existe']));
            return $response->withStatus(404);
        }

        // Verificar si la reserva ha comenzado
        $sql_fecha = "SELECT fecha_desde FROM reservas WHERE id = :id";
        $query_fecha = $conexion->prepare($sql_fecha);
        $query_fecha->bindParam(':id', $reserva_id);
        $query_fecha->execute();
        $fecha_desde = $query_fecha->fetchColumn();

        if (strtotime($fecha_desde) <= strtotime('now')) {
            $response->getBody()->write(json_encode(['error'=>'La reserva ya ha comenzado y no se puede eliminar']));
            return $response->withStatus(400);
        }

        // Eliminar la reserva
        $sql_eliminar = "DELETE FROM reservas WHERE id = :id";
        $query_eliminar = $conexion->prepare($sql_eliminar);
        $query_eliminar->bindParam(':id', $reserva_id);
        $query_eliminar->execute();

        $response->getBody()->write(json_encode(['mensaje' => 'Reserva eliminada correctamente']));
        return $response->withStatus(200);

    } catch (PDOException $e){
        $payload = json_encode([
            'status' => 'error',
            'code' => 500,
            "error" => $e->getMessage()
        ]);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json')->withStatus(500);   
    }
});

$app->run();