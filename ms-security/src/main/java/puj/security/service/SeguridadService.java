package puj.security.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import puj.security.dto.InicioSesionDto;
import puj.security.dto.RespuestaInicioSesionDto;
import puj.security.domain.User;
import puj.security.repository.UserRepository;
import puj.security.security.jwt.JwtProvider;
import puj.security.security.service.UserDetailsServiceImpl;
import puj.security.vo.RespuestaServicioVO;

@Service
public class SeguridadService {

    Logger logger = LoggerFactory.getLogger(SeguridadService.class);

    @Autowired
    private UserRepository repository;

    @Autowired
    private UserDetailsServiceImpl jwtService;

    @Autowired
    private JwtProvider jwtProvider;

    public RespuestaServicioVO iniciarSesion (InicioSesionDto inicioSesionDto) {
        RespuestaServicioVO respuesta = new RespuestaServicioVO();
        String username = inicioSesionDto.getUsername();
        String password = inicioSesionDto.getPassword();
        User usuario = repository.findByUsername(username.toUpperCase());
        if (usuario != null) {
            if (usuario.getPass().equals(password)) {
                RespuestaInicioSesionDto respuestaObj = new RespuestaInicioSesionDto();
                respuestaObj.setNombres(usuario.getNombre());
                respuestaObj.setApellidos(usuario.getApellido());
                respuestaObj.setUsuarioId(usuario.getId().toString());
                respuestaObj.setRolId(usuario.getTipoUsuario().getId().toString());
                respuestaObj.setRolNombre(usuario.getTipoUsuario().getRol());
                respuestaObj.setUsername(usuario.getUsername());

                final UserDetails userDetails = jwtService.loadUserByUsername(usuario.getUsername());
                final String token = jwtProvider.generateToken(userDetails, usuario);

                respuestaObj.setToken(token);
                respuesta.setObjeto(respuestaObj);
            } else {
                respuesta.setObjeto(null);
                respuesta.setExitosa(true);
                respuesta.setDescripcionRespuesta("Contraseña incorrecta.");
            }
        } else {
            respuesta.setObjeto(null);
            respuesta.setExitosa(false);
            respuesta.setDescripcionRespuesta("No se encontró un usuario con el username " + username);
        }
        return respuesta;
    }
}
