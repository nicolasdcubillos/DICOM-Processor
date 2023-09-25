package puj.backend_gui_nodules.rest;

import puj.backend_gui_nodules.model.ParametroDTO;
import puj.backend_gui_nodules.service.ParametroService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(value = "/api-ms-admon/parametros", produces = MediaType.APPLICATION_JSON_VALUE)
public class ParametroResource {

    private final ParametroService parametroService;

    public ParametroResource(final ParametroService parametroService) {
        this.parametroService = parametroService;
    }

    @GetMapping
    public ResponseEntity<List<ParametroDTO>> getAllParametros() {
        return ResponseEntity.ok(parametroService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParametroDTO> getParametro(@PathVariable final Integer id) {
        return ResponseEntity.ok(parametroService.get(id));
    }

    @PostMapping
    public ResponseEntity<Integer> createParametro(
            @RequestBody @Valid final ParametroDTO parametroDTO) {
        final Integer createdId = parametroService.create(parametroDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integer> updateParametro(@PathVariable final Integer id,
            @RequestBody @Valid final ParametroDTO parametroDTO) {
        parametroService.update(id, parametroDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParametro(@PathVariable final Integer id) {
        parametroService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
