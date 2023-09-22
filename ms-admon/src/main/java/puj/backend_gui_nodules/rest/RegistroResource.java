package puj.backend_gui_nodules.rest;

import puj.backend_gui_nodules.model.RegistroDTO;
import puj.backend_gui_nodules.service.RegistroService;
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
@RequestMapping(value = "/api/registros", produces = MediaType.APPLICATION_JSON_VALUE)
public class RegistroResource {

    private final RegistroService registroService;

    public RegistroResource(final RegistroService registroService) {
        this.registroService = registroService;
    }

    @GetMapping
    public ResponseEntity<List<RegistroDTO>> getAllRegistros() {
        return ResponseEntity.ok(registroService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegistroDTO> getRegistro(@PathVariable final Integer id) {
        return ResponseEntity.ok(registroService.get(id));
    }

    @PostMapping
    public ResponseEntity<Integer> createRegistro(
            @RequestBody @Valid final RegistroDTO registroDTO) {
        final Integer createdId = registroService.create(registroDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integer> updateRegistro(@PathVariable final Integer id,
            @RequestBody @Valid final RegistroDTO registroDTO) {
        registroService.update(id, registroDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRegistro(@PathVariable final Integer id) {
        registroService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
