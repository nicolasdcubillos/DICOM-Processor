package puj.security.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import puj.security.dto.InicioSesionDto;
import puj.security.service.SeguridadService;
import puj.security.vo.RespuestaServicioVO;


@RestController
@RequestMapping("/Security")
public class SeguridadController {
    private static final String origen = "*";

    @Autowired
    private SeguridadService service;

    @CrossOrigin(origins = origen)
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public @ResponseBody RespuestaServicioVO iniciarSesion(@RequestBody InicioSesionDto inicioSesionDto) {
        return service.iniciarSesion(inicioSesionDto);
    }


}
